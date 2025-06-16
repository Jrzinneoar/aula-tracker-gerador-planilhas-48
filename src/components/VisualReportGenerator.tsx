
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Student, Subject, Absence } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FileImage, Download, Calendar, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import { useState } from 'react';

const VisualReportGenerator = () => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly' | 'general'>('weekly');
  const [selectedWeek, setSelectedWeek] = useState<string>(new Date().toISOString().split('T')[0]);
  const reportRef = useRef<HTMLDivElement>(null);

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
          student:students(*),
          subject:subjects(*)
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
          subject:subjects(*),
          attendance_records(*)
        `)
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const getWeeklyData = () => {
    const weekStart = startOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });

    const weeklyAbsences = absences.filter((absence: any) =>
      isWithinInterval(new Date(absence.absence_date), { start: weekStart, end: weekEnd })
    );

    const weeklyClasses = classSessions.filter((session: any) =>
      isWithinInterval(new Date(session.date), { start: weekStart, end: weekEnd })
    );

    return { weeklyAbsences, weeklyClasses, weekStart, weekEnd };
  };

  const generateReport = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `relatorio_${reportType}_${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Sucesso",
        description: "Relatório visual gerado e baixado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório visual",
        variant: "destructive"
      });
    }
  };

  const getStudentAbsenceCount = (studentId: string, subjectId?: string) => {
    return absences.filter((absence: any) => 
      absence.student_id === studentId && 
      (!subjectId || absence.subject_id === subjectId)
    ).length;
  };

  const getStudentClassCount = (studentId: string, subjectId?: string) => {
    return classSessions.filter((session: any) => 
      session.attendance_records?.some((record: any) => record.student_id === studentId) &&
      (!subjectId || session.subject_id === subjectId)
    ).length;
  };

  const { weeklyAbsences, weeklyClasses, weekStart, weekEnd } = getWeeklyData();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Relatórios Visuais</h2>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <FileImage className="w-5 h-5" />
            Configurações do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="weekly" className="text-popover-foreground">Relatório Semanal</SelectItem>
                  <SelectItem value="monthly" className="text-popover-foreground">Relatório Mensal</SelectItem>
                  <SelectItem value="general" className="text-popover-foreground">Relatório Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === 'weekly' && (
              <div>
                <label className="text-sm font-medium text-card-foreground">Semana de Referência</label>
                <input
                  type="date"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                />
              </div>
            )}
          </div>

          <Button onClick={generateReport} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Gerar e Baixar Relatório Visual
          </Button>
        </CardContent>
      </Card>

      {/* Preview do Relatório */}
      <div ref={reportRef} className="bg-white p-8 rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Controle de Presença Escolar
          </h1>
          <h2 className="text-xl text-gray-600">
            {reportType === 'weekly' && `Relatório Semanal - ${format(weekStart, 'dd/MM/yyyy')} a ${format(weekEnd, 'dd/MM/yyyy')}`}
            {reportType === 'monthly' && `Relatório Mensal - ${format(new Date(), 'MMMM yyyy', { locale: ptBR })}`}
            {reportType === 'general' && 'Relatório Geral de Frequência'}
          </h2>
          <p className="text-sm text-gray-500">Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
        </div>

        {reportType === 'weekly' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Resumo da Semana
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total de Aulas:</span> {weeklyClasses.length}
                </div>
                <div>
                  <span className="font-medium">Total de Faltas:</span> {weeklyAbsences.length}
                </div>
                <div>
                  <span className="font-medium">Faltas Justificadas:</span> {weeklyAbsences.filter((a: any) => a.justified).length}
                </div>
                <div>
                  <span className="font-medium">Faltas Não Justificadas:</span> {weeklyAbsences.filter((a: any) => !a.justified).length}
                </div>
              </div>
            </div>

            {weeklyAbsences.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Faltas da Semana
                </h3>
                <div className="space-y-2">
                  {weeklyAbsences.map((absence: any) => (
                    <div key={absence.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <div>
                        <span className="font-medium">{absence.student?.name}</span>
                        <span className="text-gray-600 ml-2">- {absence.subject?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {format(new Date(absence.absence_date), 'dd/MM/yyyy')}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          absence.justified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {absence.justified ? 'Justificada' : 'Não Justificada'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {reportType === 'general' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas Gerais</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                  <div className="text-gray-600">Alunos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{subjects.length}</div>
                  <div className="text-gray-600">Matérias</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{absences.length}</div>
                  <div className="text-gray-600">Total de Faltas</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequência por Aluno</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Aluno</th>
                    {subjects.map((subject) => (
                      <th key={subject.id} className="border border-gray-300 p-2 text-center text-xs">
                        {subject.name}
                      </th>
                    ))}
                    <th className="border border-gray-300 p-2 text-center">Total Faltas</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="border border-gray-300 p-2 font-medium">{student.name}</td>
                      {subjects.map((subject) => {
                        const absenceCount = getStudentAbsenceCount(student.id, subject.id);
                        const classCount = getStudentClassCount(student.id, subject.id);
                        const attendanceRate = classCount > 0 ? Math.round(((classCount - absenceCount) / classCount) * 100) : 100;
                        
                        return (
                          <td key={subject.id} className="border border-gray-300 p-2 text-center">
                            <div className="text-xs">
                              <div className={`font-semibold ${
                                attendanceRate >= 75 ? 'text-green-600' : 
                                attendanceRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {attendanceRate}%
                              </div>
                              <div className="text-gray-500">{absenceCount} faltas</div>
                            </div>
                          </td>
                        );
                      })}
                      <td className="border border-gray-300 p-2 text-center font-semibold">
                        {getStudentAbsenceCount(student.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>Sistema de Controle de Presença Escolar - Relatório gerado automaticamente</p>
        </div>
      </div>
    </div>
  );
};

export default VisualReportGenerator;
