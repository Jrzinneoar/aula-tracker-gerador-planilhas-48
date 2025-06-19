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
      
      // Aguarda um pouco para garantir que tudo foi renderizado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Configurações otimizadas para melhor captura
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        width: 800,
        height: reportRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: reportRef.current.scrollHeight,
        foreignObjectRendering: false,
        imageTimeout: 30000,
        removeContainer: false,
        onclone: (clonedDoc, element) => {
          // Aplica estilos específicos no clone para garantir renderização correta
          const clonedElement = element as HTMLElement;
          clonedElement.style.width = '800px';
          clonedElement.style.maxWidth = '800px';
          clonedElement.style.minWidth = '800px';
          clonedElement.style.fontSize = '12px';
          clonedElement.style.lineHeight = '1.4';
          clonedElement.style.backgroundColor = '#ffffff';
          clonedElement.style.color = '#000000';
          clonedElement.style.padding = '30px';
          clonedElement.style.boxSizing = 'border-box';
          clonedElement.style.overflow = 'visible';
          
          // Força a visibilidade de todos os elementos
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach((el: any) => {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.display = el.style.display === 'none' ? 'block' : el.style.display;
          });
        }
      });

      // Verifica se o canvas foi gerado corretamente
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas com dimensões inválidas');
      }

      // Cria o link de download
      const link = document.createElement('a');
      link.download = `relatorio_${reportType}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      
      // Força o download
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
  const totalAttendances = filteredClasses.reduce((sum: number, cls: any) => sum + (cls.attendance_records?.length || 0), 0);
  const totalPossibleAttendances = filteredClasses.length * students.length;
  const attendanceRate = totalPossibleAttendances > 0 ? ((totalAttendances / totalPossibleAttendances) * 100) : 0;

  console.log('Debug - Total attendances:', totalAttendances);
  console.log('Debug - Total possible attendances:', totalPossibleAttendances);
  console.log('Debug - Filtered absences:', filteredAbsences.length);
  console.log('Debug - Attendance rate:', attendanceRate);

  const subjectsWithClasses = [...new Set(filteredClasses.map((cls: any) => cls.subject?.name))].length;
  const averageAbsencesPerStudent = students.length > 0 ? (filteredAbsences.length / students.length) : 0;
  const justifiedAbsences = filteredAbsences.filter((abs: any) => abs.justified).length;
  const unjustifiedAbsences = filteredAbsences.length - justifiedAbsences;
  const studentsWithPerfectAttendance = students.filter(student => 
    !filteredAbsences.some((abs: any) => abs.student_id === student.id)
  ).length;

  // Estatísticas por matéria
  const subjectStats = subjects.map(subject => {
    const subjectClasses = filteredClasses.filter((cls: any) => cls.subject_id === subject.id);
    const subjectAbsences = filteredAbsences.filter((abs: any) => abs.subject_id === subject.id);
    const subjectAttendances = subjectClasses.reduce((sum: number, cls: any) => sum + (cls.attendance_records?.length || 0), 0);
    const subjectPossibleAttendances = subjectClasses.length * students.length;
    
    return {
      name: subject.name,
      classes: subjectClasses.length,
      absences: subjectAbsences.length,
      attendances: subjectAttendances,
      attendanceRate: subjectPossibleAttendances > 0 ? ((subjectAttendances / subjectPossibleAttendances) * 100) : 0
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
        <CardContent className="p-0">
          <div 
            ref={reportRef} 
            data-report-content 
            style={{ 
              backgroundColor: '#ffffff',
              color: '#000000',
              width: '800px',
              maxWidth: '800px',
              minWidth: '800px',
              margin: '0 auto',
              overflow: 'visible'
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
