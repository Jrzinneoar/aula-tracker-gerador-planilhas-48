
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Student, Subject, ClassSession } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AttendanceHistory = () => {
  const [students] = useLocalStorage<Student[]>('students', []);
  const [subjects] = useLocalStorage<Subject[]>('subjects', []);
  const [classSessions] = useLocalStorage<ClassSession[]>('classSessions', []);
  
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  const filteredSessions = useMemo(() => {
    return classSessions.filter(session => {
      if (selectedSubject !== 'all' && session.subjectId !== selectedSubject) {
        return false;
      }
      
      if (selectedStudent !== 'all') {
        return session.attendanceRecords.some(record => record.studentId === selectedStudent);
      }
      
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [classSessions, selectedSubject, selectedStudent]);

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Aluno não encontrado';
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Matéria não encontrada';
  };

  const getAttendanceStats = (session: ClassSession) => {
    const total = session.attendanceRecords.length;
    const present = session.attendanceRecords.filter(r => r.present).length;
    const absent = total - present;
    return { total, present, absent };
  };

  if (classSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum registro de aula encontrado.</p>
        <p className="text-gray-400">Registre aulas primeiro na aba "Registro de Aulas".</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Histórico de Presenças</h2>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as matérias</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por aluno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os alunos</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
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
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {getSubjectName(session.subjectId)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(sessionDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-sm font-medium text-slate-700 mt-1">
                      Tópico: {session.topic}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {stats.present} Presentes
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      {stats.absent} Faltas
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.attendanceRecords
                    .filter(record => selectedStudent === 'all' || record.studentId === selectedStudent)
                    .map((record) => (
                    <div 
                      key={record.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          record.present ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium">
                          {getStudentName(record.studentId)}
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
                          <span className="text-sm text-gray-600 italic">
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
