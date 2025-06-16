
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Student, Subject } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { format, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Calendar, TrendingDown, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const ReportGenerator = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Student[];
    }
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Subject[];
    }
  });

  const { data: absences = [] } = useQuery({
    queryKey: ['absences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('absences')
        .select(`
          *,
          student:students(*)
        `)
        .order('absence_date', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: classSessions = [] } = useQuery({
    queryKey: ['class_sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_sessions')
        .select(`
          *,
          subject:subjects(*)
        `)
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const getFilteredData = () => {
    const selectedDay = new Date(selectedDate);
    const dateRange = { start: selectedDay, end: selectedDay };

    const filteredAbsences = absences.filter((absence: any) =>
      isWithinInterval(new Date(absence.absence_date), dateRange)
    );

    const filteredClasses = classSessions.filter((session: any) =>
      isWithinInterval(new Date(session.date), dateRange)
    );

    return { filteredAbsences, filteredClasses };
  };

  if (absences.length === 0 && classSessions.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
        <div className="max-w-md mx-auto">
          <TrendingDown className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-blue-800 text-lg font-semibold mb-2">Nenhum dado para relatório</p>
          <p className="text-blue-600">Registre aulas e faltas primeiro para gerar relatórios</p>
        </div>
      </div>
    );
  }

  const { filteredAbsences, filteredClasses } = getFilteredData();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Relatório Diário</h2>
        <p className="text-muted-foreground">Visualize o resumo diário de aulas e faltas</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="w-5 h-5" />
            Selecionar Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label className="text-blue-700 font-medium">Data do Relatório</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border-blue-200 focus:border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Calendar className="w-5 h-5" />
              Aulas do Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{filteredClasses.length}</div>
              <div className="text-green-700">Aulas Ministradas</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <TrendingDown className="w-5 h-5" />
              Faltas do Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{filteredAbsences.length}</div>
              <div className="text-red-700">Faltas Registradas</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Users className="w-5 h-5" />
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{students.length}</div>
              <div className="text-purple-700">Alunos Cadastrados</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes das Aulas */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Calendar className="w-5 h-5" />
            Aulas Ministradas em {format(new Date(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClasses.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-green-600">Nenhuma aula registrada nesta data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClasses.map((session: any) => (
                <div key={session.id} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <div className="font-semibold text-green-800 text-lg">{session.subject?.name}</div>
                  <div className="text-green-600 font-medium">Professor: {session.subject?.teacher}</div>
                  <div className="text-green-700 mt-2">
                    <strong>Tópico:</strong> {session.topic}
                  </div>
                  {session.notes && (
                    <div className="text-green-600 mt-1">
                      <strong>Observações:</strong> {session.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalhes das Faltas */}
      <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <TrendingDown className="w-5 h-5" />
            Faltas Registradas em {format(new Date(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAbsences.length === 0 ? (
            <div className="text-center py-8">
              <TrendingDown className="w-12 h-12 text-red-300 mx-auto mb-4" />
              <p className="text-red-600">Nenhuma falta registrada nesta data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAbsences.map((absence: any) => (
                <div key={absence.id} className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                  <div className="font-semibold text-red-800 text-lg">{absence.student?.name}</div>
                  <div className={`inline-block px-3 py-1 rounded text-sm font-medium mt-2 ${
                    absence.justified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {absence.justified ? 'Falta Justificada' : 'Falta Não Justificada'}
                  </div>
                  {absence.reason && (
                    <div className="text-red-600 mt-2">
                      <strong>Motivo:</strong> {absence.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
