
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student, Subject, Absence } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { FileText, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const ReportGenerator = () => {
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

  const generateCSV = (reportType: string) => {
    let csvContent = '';
    
    if (reportType === 'full') {
      // Relatório detalhado de faltas
      csvContent = 'Data,Matéria,Professor,Aluno,Status,Motivo,Justificada\n';
      absences.forEach((absence: any) => {
        const absenceDate = format(new Date(absence.absence_date), 'dd/MM/yyyy');
        csvContent += `${absenceDate},`;
        csvContent += `"${absence.subject?.name || 'N/A'}",`;
        csvContent += `"${absence.subject?.teacher || 'N/A'}",`;
        csvContent += `"${absence.student?.name || 'N/A'}",`;
        csvContent += `Falta,`;
        csvContent += `"${absence.reason || ''}",`;
        csvContent += `${absence.justified ? 'Sim' : 'Não'}\n`;
      });
    } else {
      // Relatório resumido
      csvContent = 'Aluno,Email,';
      subjects.forEach((subject) => {
        csvContent += `${subject.name} - Faltas,`;
      });
      csvContent += 'Total de Faltas\n';
      
      students.forEach((student) => {
        csvContent += `"${student.name}","${student.email || ''}",`;
        let totalAbsences = 0;
        subjects.forEach((subject) => {
          const studentAbsences = absences.filter((absence: any) => 
            absence.student_id === student.id && absence.subject_id === subject.id
          ).length;
          totalAbsences += studentAbsences;
          csvContent += `${studentAbsences},`;
        });
        csvContent += `${totalAbsences}\n`;
      });
    }

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
      description: "Relatório gerado e baixado com sucesso!"
    });
  };

  if (absences.length === 0 && classSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Nenhum dado para relatório.</p>
        <p className="text-muted-foreground">Registre aulas e faltas primeiro para gerar relatórios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Gerador de Relatórios CSV</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <FileText className="w-5 h-5" />
              Relatório Resumido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Gera uma planilha com o resumo de faltas por aluno e matéria.
            </p>
            <Button
              onClick={() => generateCSV('summary')}
              className="w-full"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório Resumido
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <FileText className="w-5 h-5" />
              Relatório Detalhado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Gera uma planilha detalhada com todas as faltas registradas, incluindo motivos e justificativas.
            </p>
            <Button
              onClick={() => generateCSV('full')}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório Detalhado
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportGenerator;
