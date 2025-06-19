import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student, Subject, Absence } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReportConfiguration from './reports/ReportConfiguration';
import ReportContent from './reports/ReportContent';

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
    const selectedDateObj = new Date(selectedDate + 'T12:00:00');
    let startDate: Date, endDate: Date;

    switch (reportType) {
      case 'daily':
        startDate = new Date(selectedDate + 'T00:00:00');
        endDate = new Date(selectedDate + 'T23:59:59');
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
        startDate = new Date(selectedDate + 'T00:00:00');
        endDate = new Date(selectedDate + 'T23:59:59');
    }

    const filteredAbsences = absences.filter((absence: any) => {
      const absenceDate = new Date(absence.absence_date + 'T12:00:00');
      return isWithinInterval(absenceDate, { start: startDate, end: endDate });
    });

    const filteredClasses = classSessions.filter((session: any) => {
      const sessionDate = new Date(session.date + 'T12:00:00');
      return isWithinInterval(sessionDate, { start: startDate, end: endDate });
    });

    return { filteredAbsences, filteredClasses, startDate, endDate };
  };

  const generateReport = async () => {
    if (!reportRef.current) {
      toast({
        title: "Erro",
        description: "Elemento do relatório não encontrado",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      // Aguarda renderização completa
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Força o scroll para o topo do elemento
      reportRef.current.scrollTop = 0;
      
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
        removeContainer: true,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Força estilos no documento clonado com tipagem correta
          const clonedElement = clonedDoc.querySelector('[data-report-content]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.color = '#000000';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
          }
        }
      });

      // Verifica se o canvas foi gerado corretamente
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas gerado com dimensões inválidas');
      }

      const link = document.createElement('a');
      link.download = `relatorio_${reportType}_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Sucesso",
        description: "Relatório visual gerado e baixado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório visual. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const { filteredAbsences, filteredClasses, startDate, endDate } = getFilteredData();

  const getReportTitle = () => {
    switch (reportType) {
      case 'daily':
        return `Relatório Diário - ${format(startDate, 'dd/MM/yyyy', { locale: ptBR })}`;
      case 'weekly':
        return `Relatório Semanal - ${format(startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(endDate, 'dd/MM/yyyy', { locale: ptBR })}`;
      case 'monthly':
        return `Relatório Mensal - ${format(startDate, 'MMMM yyyy', { locale: ptBR })}`;
      default:
        return 'Relatório';
    }
  };

  // Estatísticas calculadas
  const attendanceRate = filteredClasses.length > 0 ? 
    ((filteredClasses.reduce((sum: number, cls: any) => sum + (cls.attendance_records?.length || 0), 0) / 
      (filteredClasses.length * students.length)) * 100) : 0;

  const subjectsWithClasses = [...new Set(filteredClasses.map((cls: any) => cls.subject?.name))].length;
  const averageAbsencesPerStudent = students.length > 0 ? (filteredAbsences.length / students.length) : 0;
  const justifiedAbsences = filteredAbsences.filter((abs: any) => abs.justified).length;
  const unjustifiedAbsences = filteredAbsences.length - justifiedAbsences;
  const totalAttendances = filteredClasses.reduce((sum: number, cls: any) => sum + (cls.attendance_records?.length || 0), 0);
  const studentsWithPerfectAttendance = students.filter(student => 
    !filteredAbsences.some((abs: any) => abs.student_id === student.id)
  ).length;

  // Estatísticas por matéria
  const subjectStats = subjects.map(subject => {
    const subjectClasses = filteredClasses.filter((cls: any) => cls.subject_id === subject.id);
    const subjectAbsences = filteredAbsences.filter((abs: any) => abs.subject_id === subject.id);
    const subjectAttendances = subjectClasses.reduce((sum: number, cls: any) => sum + (cls.attendance_records?.length || 0), 0);
    
    return {
      name: subject.name,
      classes: subjectClasses.length,
      absences: subjectAbsences.length,
      attendances: subjectAttendances,
      attendanceRate: subjectClasses.length > 0 ? ((subjectAttendances / (subjectClasses.length * students.length)) * 100) : 0
    };
  }).filter(stat => stat.classes > 0);

  // Top estudantes com mais faltas
  const studentAbsenceStats = students.map(student => {
    const studentAbsences = filteredAbsences.filter((abs: any) => abs.student_id === student.id);
    return {
      name: student.name,
      absences: studentAbsences.length,
      justified: studentAbsences.filter((abs: any) => abs.justified).length
    };
  }).sort((a, b) => b.absences - a.absences).slice(0, 5);

  return (
    <div className="space-y-6 bg-white">
      <div className="bg-white border-b border-gray-200 pb-6">
        <h2 className="text-3xl font-bold text-black mb-2">Relatórios Visuais</h2>
        <p className="text-gray-600">Gere relatórios visuais organizados e profissionais</p>
      </div>

      <ReportConfiguration
        reportType={reportType}
        setReportType={setReportType}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
        onLogoUpload={handleLogoUpload}
        onRemoveLogo={removeLogo}
        onGenerateReport={generateReport}
        isGenerating={isGenerating}
        fileInputRef={fileInputRef}
      />

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-black">Preview do Relatório</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div 
            ref={reportRef} 
            data-report-content 
            style={{ 
              backgroundColor: '#ffffff',
              color: '#000000',
              minHeight: '800px'
            }}
          >
            <ReportContent
              logoUrl={logoUrl}
              title={getReportTitle()}
              reportType={reportType}
              filteredAbsences={filteredAbsences}
              filteredClasses={filteredClasses}
              students={students}
              subjects={subjects}
              attendanceRate={attendanceRate}
              subjectsWithClasses={subjectsWithClasses}
              totalAttendances={totalAttendances}
              studentsWithPerfectAttendance={studentsWithPerfectAttendance}
              averageAbsencesPerStudent={averageAbsencesPerStudent}
              justifiedAbsences={justifiedAbsences}
              unjustifiedAbsences={unjustifiedAbsences}
              subjectStats={subjectStats}
              studentAbsenceStats={studentAbsenceStats}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualReportGenerator;
