
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student, Subject, Absence } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FileImage, Download, Upload, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import ReportHeader from './reports/ReportHeader';
import StatsSummary from './reports/StatsSummary';
import ClassesList from './reports/ClassesList';
import AbsencesList from './reports/AbsencesList';
import MonthlyStats from './reports/MonthlyStats';
import ReportFooter from './reports/ReportFooter';

const VisualReportGenerator = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    
    setIsGenerating(true);
    
    try {
      // Aguardar um momento para garantir que o DOM está renderizado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        logging: false,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
        windowWidth: 1200,
        windowHeight: 1600,
        onclone: (clonedDoc) => {
          // Garantir que todos os estilos inline sejam aplicados
          const clonedElement = clonedDoc.querySelector('[data-report-content]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.fontFamily = 'Arial, sans-serif';
            clonedElement.style.color = '#000000';
            clonedElement.style.background = '#ffffff';
          }
        }
      });

      const link = document.createElement('a');
      link.download = `relatorio_${reportType}_${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png', 0.9);
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
    } finally {
      setIsGenerating(false);
    }
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

  // Limitar dados para evitar relatórios muito grandes
  const limitedAbsences = filteredAbsences.slice(0, 20);
  const limitedClasses = filteredClasses.slice(0, 15);
  const hasMoreAbsences = filteredAbsences.length > 20;
  const hasMoreClasses = filteredClasses.length > 15;

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

          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">Logo da Instituição</label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Escolher Logo
              </Button>
              {logoUrl && (
                <div className="flex items-center gap-2">
                  <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain border rounded" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {(filteredAbsences.length > 20 || filteredClasses.length > 15) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Este relatório contém muitos dados. Para melhor qualidade da imagem, 
                serão exibidos apenas os primeiros {filteredClasses.length > 15 ? '15 aulas' : 'todas as aulas'} 
                {filteredAbsences.length > 20 && filteredClasses.length > 15 ? ' e ' : ''}
                {filteredAbsences.length > 20 ? '20 faltas' : ''}.
                {hasMoreAbsences && ` (${filteredAbsences.length - 20} faltas não exibidas)`}
                {hasMoreClasses && ` (${filteredClasses.length - 15} aulas não exibidas)`}
              </p>
            </div>
          )}

          <Button 
            onClick={generateReport} 
            className="w-full" 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gerando Relatório...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Gerar e Baixar Relatório Visual
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview do Relatório */}
      <div 
        ref={reportRef} 
        data-report-content
        style={{ 
          backgroundColor: '#ffffff',
          color: '#000000',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.4',
          padding: '30px',
          maxWidth: '800px',
          margin: '0 auto',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        <ReportHeader logoUrl={logoUrl} title={getReportTitle()} />
        
        <StatsSummary
          totalStudents={students.length}
          totalClasses={limitedClasses.length}
          totalAbsences={limitedAbsences.length}
          unjustifiedAbsences={limitedAbsences.filter((a: any) => !a.justified).length}
        />

        <ClassesList classes={limitedClasses} />
        {hasMoreClasses && (
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '12px', marginBottom: '20px' }}>
            ... e mais {filteredClasses.length - 15} aulas não exibidas
          </div>
        )}
        
        <AbsencesList absences={limitedAbsences} />
        {hasMoreAbsences && (
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '12px', marginBottom: '20px' }}>
            ... e mais {filteredAbsences.length - 20} faltas não exibidas
          </div>
        )}

        {reportType === 'monthly' && (
          <MonthlyStats
            students={students}
            filteredAbsences={filteredAbsences}
            getStudentTotalAbsences={getStudentTotalAbsences}
          />
        )}

        <ReportFooter />
      </div>
    </div>
  );
};

export default VisualReportGenerator;
