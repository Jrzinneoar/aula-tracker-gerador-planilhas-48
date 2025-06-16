
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Student, Subject, ClassSession, AttendanceRecord } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClassSessionWithRecords extends ClassSession {
  attendance_records: AttendanceRecord[];
  subjects: Subject;
}

const AttendanceHistory = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classSessions, setClassSessions] = useState<ClassSessionWithRecords[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscar alunos
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .order('name');

      // Buscar matérias
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      // Buscar sessões de aula com registros de presença
      const { data: sessionsData } = await supabase
        .from('class_sessions')
        .select(`
          *,
          subjects (*),
          attendance_records (*)
        `)
        .order('date', { ascending: false });

      setStudents(studentsData || []);
      setSubjects(subjectsData || []);
      setClassSessions(sessionsData || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const filteredSessions = classSessions.filter(session => {
    if (selectedSubject !== 'all' && session.subject_id !== selectedSubject) {
      return false;
    }
    
    if (selectedStudent !== 'all') {
      return session.attendance_records.some(record => record.student_id === selectedStudent);
    }
    
    return true;
  });

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Aluno não encontrado';
  };

  const getAttendanceStats = (session: ClassSessionWithRecords) => {
    const total = session.attendance_records.length;
    const present = session.attendance_records.filter(r => r.present).length;
    const absent = total - present;
    return { total, present, absent };
  };

  if (classSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Nenhum registro de aula encontrado.</p>
        <p className="text-muted-foreground">Registre aulas primeiro na aba "Registro de Aulas".</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Histórico de Presenças</h2>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48 bg-background border-border text-foreground">
              <SelectValue placeholder="Filtrar por matéria" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all" className="text-popover-foreground">Todas as matérias</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id} className="text-popover-foreground">
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-48 bg-background border-border text-foreground">
              <SelectValue placeholder="Filtrar por aluno" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all" className="text-popover-foreground">Todos os alunos</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id} className="text-popover-foreground">
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSessions.map((session) => {
          const stats = getAttendanceStats(session);
          const sessionDate = new Date(session.date);
          
          return (
            <Card key={session.id} className="hover:shadow-lg transition-shadow bg-card border-border">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-card-foreground">
                      {session.subjects.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(sessionDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-sm font-medium text-card-foreground mt-1">
                      Tópico: {session.topic}
                    </p>
                    {session.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Observações: {session.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {stats.present} Presentes
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {stats.absent} Faltas
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.attendance_records
                    .filter(record => selectedStudent === 'all' || record.student_id === selectedStudent)
                    .map((record) => (
                    <div 
                      key={record.id} 
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          record.present ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium text-foreground">
                          {getStudentName(record.student_id)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={record.present ? "default" : "destructive"}
                          className={record.present ? "bg-green-600" : ""}
                        >
                          {record.present ? 'Presente' : 'Falta'}
                        </Badge>
                        {record.notes && (
                          <span className="text-sm text-muted-foreground italic">
                            "{record.notes}"
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceHistory;
