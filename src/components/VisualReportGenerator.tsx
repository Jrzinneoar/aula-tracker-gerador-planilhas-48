
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Student, Subject, Absence } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FileImage, Download, Calendar, TrendingDown, Users, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import { useState } from 'react';

const VisualReportGenerator = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
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
          subject:subjects(*),
          attendance_records(*)
        `)
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const getFilteredData = () => {
    const selectedDateObj = new Date(selectedDate);
    let startDate: Date, endDate: Date;

    switch (reportType) {
      case 'daily':
        startDate = new Date(selectedDate);
        endDate = new Date(selectedDate);
        break;
      case 'weekly':
        startDate = startOfWeek(selectedDateObj, { weekStartsOn: 1 });
        endDate = endOfWeek(selectedDateObj, { weekStartsOn: 1 });
        break;
      case 'monthly':
        startDate = startOfMonth(selectedDateObj);
        endDate = endOfMonth(selectedDateObj);
        break;
      default:
        startDate = new Date(selectedDate);
        endDate = new Date(selectedDate);
    }

    const filteredAbsences = absences.filter((absence: any) =>
      isWithinInterval(new Date(absence.absence_date), { start: startDate, end: endDate })
    );

    const filteredClasses = classSessions.filter((session: any) =>
      isWithinInterval(new Date(session.date), { start: startDate, end: endDate })
    );

    return { filteredAbsences, filteredClasses, startDate, endDate };
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

  const getStudentDailyAbsences = (studentId: string, date: Date) => {
    return absences.filter((absence: any) => 
      absence.student_id === studentId && 
      format(new Date(absence.absence_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).length;
  };

  const getStudentTotalAbsences = (studentId: string) => {
    return absences.filter((absence: any) => absence.student_id === studentId).length;
  };

  const { filteredAbsences, filteredClasses, startDate, endDate } = getFilteredData();

  const getReportTitle = () => {
    switch (reportType) {
      case 'daily':
        return `Relatório Diário - ${format(startDate, 'dd/MM/yyyy')}`;
      case 'weekly':
        return `Relatório Semanal - ${format(startDate, 'dd/MM/yyyy')} a ${format(endDate, 'dd/MM/yyyy')}`;
      case 'monthly':
        return `Relatório Mensal - ${format(startDate, 'MMMM yyyy', { locale: ptBR })}`;
      default:
        return 'Relatório';
    }
  };

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
                  <SelectItem value="daily" className="text-popover-foreground">Relatório Diário</SelectItem>
                  <SelectItem value="weekly" className="text-popover-foreground">Relatório Semanal</SelectItem>
                  <SelectItem value="monthly" className="text-popover-foreground">Relatório Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground">Data de Referência</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
              />
            </div>
          </div>

          <Button onClick={generateReport} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Gerar e Baixar Relatório Visual
          </Button>
        </CardContent>
      </Card>

      {/* Preview do Relatório */}
      <div ref={reportRef} className="bg-white p-8 rounded-lg shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="text-center mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Controle de Presença Escolar
          </h1>
          <h2 className="text-xl text-blue-600 font-semibold">
            {getReportTitle()}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
        </div>

        {/* Resumo Estatístico */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <div className="text-sm text-blue-800 font-medium">Total de Alunos</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">{filteredClasses.length}</div>
            <div className="text-sm text-green-800 font-medium">Aulas no Período</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600">{filteredAbsences.length}</div>
            <div className="text-sm text-red-800 font-medium">Faltas no Período</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredAbsences.filter((a: any) => !a.justified).length}
            </div>
            <div className="text-sm text-yellow-800 font-medium">Faltas Não Justificadas</div>
          </div>
        </div>

        {/* Aulas do Período */}
        {filteredClasses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Aulas Realizadas
            </h3>
            <div className="grid gap-3">
              {filteredClasses.map((session: any) => (
                <div key={session.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{session.subject?.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{session.topic}</div>
                      {session.notes && (
                        <div className="text-xs text-gray-500 mt-2 italic">{session.notes}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        {format(new Date(session.date), 'dd/MM/yyyy')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {session.attendance_records?.length || 0} presentes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Faltas do Período */}
        {filteredAbsences.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Faltas Registradas
            </h3>
            <div className="grid gap-3">
              {filteredAbsences.map((absence: any) => (
                <div key={absence.id} className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{absence.student?.name}</div>
                      {absence.reason && (
                        <div className="text-sm text-gray-600 mt-1">{absence.reason}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        {format(new Date(absence.absence_date), 'dd/MM/yyyy')}
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                        absence.justified 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {absence.justified ? 'Justificada' : 'Não Justificada'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumo por Aluno (apenas para relatórios mensais) */}
        {reportType === 'monthly' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
              <Users className="w-5 h-5 text-purple-600" />
              Resumo por Aluno
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left font-semibold">Aluno</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">Faltas no Mês</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">Total de Faltas</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const monthlyAbsences = filteredAbsences.filter((a: any) => a.student_id === student.id).length;
                    const totalAbsences = getStudentTotalAbsences(student.id);
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">{student.name}</td>
                        <td className="border border-gray-300 p-3 text-center">
                          <span className={`font-semibold ${monthlyAbsences > 5 ? 'text-red-600' : monthlyAbsences > 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {monthlyAbsences}
                          </span>
                        </td>
                        <td className="border border-gray-300 p-3 text-center font-medium">{totalAbsences}</td>
                        <td className="border border-gray-300 p-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            monthlyAbsences > 5 ? 'bg-red-100 text-red-800' : 
                            monthlyAbsences > 3 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {monthlyAbsences > 5 ? 'Crítico' : monthlyAbsences > 3 ? 'Atenção' : 'Normal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-8 pt-6 border-t border-gray-300 text-center">
          <p className="text-xs text-gray-500">
            Sistema de Controle de Presença Escolar - Relatório gerado automaticamente
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Este documento contém informações confidenciais da instituição de ensino
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisualReportGenerator;
