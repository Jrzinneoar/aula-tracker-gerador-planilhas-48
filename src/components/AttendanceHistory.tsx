
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student, Subject, ClassSession } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClassSessionWithSubject extends ClassSession {
  subjects: Subject;
}

const AttendanceHistory = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classSessions, setClassSessions] = useState<ClassSessionWithSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

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

      // Buscar sessões de aula
      const { data: sessionsData } = await supabase
        .from('class_sessions')
        .select(`
          *,
          subjects (*)
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
    return true;
  });

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
        <h2 className="text-2xl font-bold text-foreground">Histórico de Aulas</h2>
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
      </div>

      <div className="space-y-4">
        {filteredSessions.map((session) => {
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
                    <p className="text-sm text-muted-foreground mt-1">
                      Professor: {session.subjects.teacher}
                    </p>
                  </div>
                </div>
              </CardHeader>
              {session.notes && (
                <CardContent>
                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Observações da Aula:</h4>
                    <p className="text-muted-foreground text-sm">{session.notes}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceHistory;
