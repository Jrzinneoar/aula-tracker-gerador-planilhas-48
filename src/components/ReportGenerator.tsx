
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Student, Subject, Absence } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Download, Calendar, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const ReportGenerator = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

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

  const getFilteredData = () => {
    let dateRange: { start: Date; end: Date };
    
    switch (reportType) {
      case 'daily':
        const day = new Date(selectedDate);
        dateRange = { start: day, end: day };
        break;
      case 'weekly':
        const week = new Date(selectedDate);
        dateRange = { 
          start: startOfWeek(week, { weekStartsOn: 1 }), 
          end: endOfWeek(week, { weekStartsOn: 1 }) 
        };
        break;
      case 'monthly':
        const month = new Date(selectedDate);
        dateRange = { 
          start: startOfMonth(month), 
          end: endOfMonth(month) 
        };
        break;
      case 'custom':
        dateRange = { 
          start: new Date(startDate), 
          end: new Date(endDate) 
        };
        break;
      default:
        dateRange = { start: new Date(), end: new Date() };
    }

    const filteredAbsences = absences.filter((absence: any) =>
      isWithinInterval(new Date(absence.absence_date), dateRange)
    );

    const filteredClasses = classSessions.filter((session: any) =>
      isWithinInterval(new Date(session.date), dateRange)
    );

    return { filteredAbsences, filteredClasses, dateRange };
  };

  const generateCSV = () => {
    const { filteredAbsences, filteredClasses, dateRange } = getFilteredData();
    
    let csvContent = '';
    
    // Cabeçalho com informações do período
    const periodText = reportType === 'daily' 
      ? format(dateRange.start, 'dd/MM/yyyy')
      : `${format(dateRange.start, 'dd/MM/yyyy')} - ${format(dateRange.end, 'dd/MM/yyyy')}`;
    
    csvContent += `RELATÓRIO COMPLETO - ${periodText}\n\n`;
    
    // Seção de Aulas
    csvContent += 'REGISTRO DE AULAS\n';
    csvContent += 'Data,Matéria,Professor,Tópico,Observações\n';
    
    filteredClasses.forEach((session: any) => {
      const sessionDate = format(new Date(session.date), 'dd/MM/yyyy');
      csvContent += `${sessionDate},`;
      csvContent += `"${session.subject?.name || 'N/A'}",`;
      csvContent += `"${session.subject?.teacher || 'N/A'}",`;
      csvContent += `"${session.topic || ''}",`;
      csvContent += `"${session.notes || ''}"\n`;
    });
    
    csvContent += '\n';
    
    // Seção de Faltas por Dia
    csvContent += 'REGISTRO DE FALTAS POR DIA\n';
    csvContent += 'Data,Aluno,Matéria,Professor,Motivo,Justificada\n';
    
    filteredAbsences.forEach((absence: any) => {
      const absenceDate = format(new Date(absence.absence_date), 'dd/MM/yyyy');
      csvContent += `${absenceDate},`;
      csvContent += `"${absence.student?.name || 'N/A'}",`;
      csvContent += `"${absence.subject?.name || 'N/A'}",`;
      csvContent += `"${absence.subject?.teacher || 'N/A'}",`;
      csvContent += `"${absence.reason || ''}",`;
      csvContent += `${absence.justified ? 'Sim' : 'Não'}\n`;
    });
    
    csvContent += '\n';
    
    // Resumo Estatístico
    csvContent += 'RESUMO ESTATÍSTICO\n';
    csvContent += 'Métrica,Valor\n';
    csvContent += `Total de Aulas,${filteredClasses.length}\n`;
    csvContent += `Total de Faltas,${filteredAbsences.length}\n`;
    csvContent += `Faltas Justificadas,${filteredAbsences.filter((a: any) => a.justified).length}\n`;
    csvContent += `Faltas Não Justificadas,${filteredAbsences.filter((a: any) => !a.justified).length}\n`;

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${reportType}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sucesso",
      description: "Relatório completo gerado e baixado com sucesso!"
    });
  };

  if (absences.length === 0 && classSessions.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
        <div className="max-w-md mx-auto">
          <TrendingDown className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-blue-800 text-lg font-semibold mb-2">Nenhum dado para relatório</p>
          <p className="text-blue-600">Registre aulas e faltas primeiro para gerar relatórios detalhados</p>
        </div>
      </div>
    );
  }

  const { filteredAbsences, filteredClasses } = getFilteredData();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Relatórios do Sistema</h2>
        <p className="text-muted-foreground">Gere relatórios completos de aulas e faltas por período</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="w-5 h-5" />
            Configuração do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-blue-700 font-medium">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-200">
                  <SelectItem value="daily">Relatório Diário</SelectItem>
                  <SelectItem value="weekly">Relatório Semanal</SelectItem>
                  <SelectItem value="monthly">Relatório Mensal</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType !== 'custom' ? (
              <div>
                <Label className="text-blue-700 font-medium">
                  {reportType === 'daily' ? 'Data' : reportType === 'weekly' ? 'Semana de' : 'Mês de'} Referência
                </Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white border-blue-200 focus:border-blue-400"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-blue-700 font-medium text-sm">Data Inicial</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label className="text-blue-700 font-medium text-sm">Data Final</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={generateCSV}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Gerar Relatório Completo (CSV)
          </Button>
        </CardContent>
      </Card>

      {/* Preview dos Dados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Calendar className="w-5 h-5" />
              Aulas do Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600">{filteredClasses.length}</div>
              <div className="text-green-700">Aulas Registradas</div>
            </div>
            {filteredClasses.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredClasses.slice(0, 5).map((session: any) => (
                  <div key={session.id} className="bg-white p-3 rounded border border-green-200">
                    <div className="font-medium text-green-800">{session.subject?.name}</div>
                    <div className="text-sm text-green-600">
                      {format(new Date(session.date), 'dd/MM/yyyy')} - {session.topic}
                    </div>
                  </div>
                ))}
                {filteredClasses.length > 5 && (
                  <div className="text-center text-green-600 text-sm">
                    +{filteredClasses.length - 5} aulas adicionais
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <TrendingDown className="w-5 h-5" />
              Faltas do Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-red-600">{filteredAbsences.length}</div>
              <div className="text-red-700">Faltas Registradas</div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div className="bg-green-100 p-2 rounded">
                  <div className="font-bold text-green-700">
                    {filteredAbsences.filter((a: any) => a.justified).length}
                  </div>
                  <div className="text-green-600">Justificadas</div>
                </div>
                <div className="bg-red-100 p-2 rounded">
                  <div className="font-bold text-red-700">
                    {filteredAbsences.filter((a: any) => !a.justified).length}
                  </div>
                  <div className="text-red-600">Não Justificadas</div>
                </div>
              </div>
            </div>
            {filteredAbsences.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredAbsences.slice(0, 5).map((absence: any) => (
                  <div key={absence.id} className="bg-white p-3 rounded border border-red-200">
                    <div className="font-medium text-red-800">{absence.student?.name}</div>
                    <div className="text-sm text-red-600">
                      {format(new Date(absence.absence_date), 'dd/MM/yyyy')} - {absence.subject?.name}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                      absence.justified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {absence.justified ? 'Justificada' : 'Não Justificada'}
                    </div>
                  </div>
                ))}
                {filteredAbsences.length > 5 && (
                  <div className="text-center text-red-600 text-sm">
                    +{filteredAbsences.length - 5} faltas adicionais
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportGenerator;
