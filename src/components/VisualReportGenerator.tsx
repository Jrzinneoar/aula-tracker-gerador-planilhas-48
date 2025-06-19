
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student, Subject, Absence } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FileImage, Download, Upload, X, Settings, AlertCircle, TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';

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
    if (!reportRef.current) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
        windowWidth: 1200,
        windowHeight: 1600,
        scrollX: 0,
        scrollY: 0
      });

      const link = document.createElement('a');
      link.download = `relatorio_${reportType}_${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
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

  // Estatísticas avançadas
  const attendanceRate = filteredClasses.length > 0 ? 
    ((filteredClasses.reduce((sum: number, cls: any) => sum + (cls.attendance_records?.length || 0), 0) / 
      (filteredClasses.length * students.length)) * 100) : 0;

  const subjectsWithClasses = [...new Set(filteredClasses.map((cls: any) => cls.subject?.name))].length;
  const studentsWithAbsences = [...new Set(filteredAbsences.map((abs: any) => abs.student_id))].length;
  const averageAbsencesPerStudent = students.length > 0 ? (filteredAbsences.length / students.length) : 0;

  const limitedAbsences = filteredAbsences.slice(0, 12);
  const limitedClasses = filteredClasses.slice(0, 10);

  const hasLimitedData = filteredAbsences.length > 12 || filteredClasses.length > 10;

  return (
    <div className="space-y-6 bg-white">
      <div className="bg-white border-b border-gray-200 pb-6">
        <h2 className="text-3xl font-bold text-black mb-2">Relatórios Visuais</h2>
        <p className="text-gray-600">Gere relatórios visuais organizados e profissionais</p>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-black">
            <Settings className="w-5 h-5" />
            Configurações do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-black">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger className="bg-white border-gray-300 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="daily" className="text-black">Relatório Diário</SelectItem>
                  <SelectItem value="weekly" className="text-black">Relatório Semanal</SelectItem>
                  <SelectItem value="monthly" className="text-black">Relatório Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-black">Data de Referência</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Logo da Instituição</label>
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
                className="flex items-center gap-2 border-gray-300 text-black hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Escolher Logo
              </Button>
              {logoUrl && (
                <div className="flex items-center gap-2">
                  <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain border border-gray-300 rounded" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {hasLimitedData && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Dados limitados para melhor qualidade da imagem: {limitedClasses.length} aulas e {limitedAbsences.length} faltas mostradas
              </p>
            </div>
          )}

          <Button 
            onClick={generateReport} 
            className="w-full bg-black text-white hover:bg-gray-800" 
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
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-black">Preview do Relatório</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div 
            ref={reportRef} 
            style={{ 
              backgroundColor: '#000000',
              color: '#ffffff',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              fontSize: '14px',
              lineHeight: '1.6',
              padding: '40px',
              maxWidth: '900px',
              margin: '0 auto',
              border: '3px solid #ffffff',
              borderRadius: '12px',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Brush effects */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.8) 80%, transparent 100%)',
              transform: 'skewX(-15deg)',
              transformOrigin: 'left'
            }} />
            
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.6) 70%, transparent 100%)',
              transform: 'skewX(15deg)',
              transformOrigin: 'right'
            }} />

            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '40px',
              borderBottom: '2px solid #ffffff',
              paddingBottom: '24px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: '20%',
                right: '20%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
                transform: 'scaleX(1.2)'
              }} />
              
              {logoUrl ? (
                <div style={{ marginBottom: '20px' }}>
                  <img 
                    src={logoUrl} 
                    alt="Logo da Instituição" 
                    style={{
                      maxWidth: '220px',
                      maxHeight: '90px',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto',
                      filter: 'brightness(1.1) contrast(1.1)'
                    }}
                  />
                </div>
              ) : (
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '12px',
                  margin: '0 0 12px 0',
                  textShadow: '2px 2px 4px rgba(255, 255, 255, 0.1)'
                }}>
                  System Tb
                </h1>
              )}
              <h2 style={{
                fontSize: '24px',
                color: '#ffffff',
                fontWeight: '600',
                marginBottom: '12px',
                margin: '0 0 12px 0',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.1)'
              }}>
                {getReportTitle()}
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#cccccc',
                margin: '0'
              }}>
                Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>

            {/* Estatísticas Principais */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '20px',
                borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                paddingBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative'
              }}>
                <TrendingUp style={{ width: '20px', height: '20px' }} />
                Estatísticas Gerais
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  width: '60px',
                  height: '2px',
                  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%)'
                }} />
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }}>
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
                  }} />
                  <Users style={{ width: '24px', height: '24px', margin: '0 auto 8px', color: '#ffffff' }} />
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>
                    {students.length}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#cccccc' }}>
                    Total de Alunos
                  </div>
                </div>
                
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
                  }} />
                  <Calendar style={{ width: '24px', height: '24px', margin: '0 auto 8px', color: '#ffffff' }} />
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>
                    {limitedClasses.length}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#cccccc' }}>
                    Aulas no Período
                  </div>
                </div>
                
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
                  }} />
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>
                    {Math.round(attendanceRate)}%
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#cccccc' }}>
                    Taxa de Presença
                  </div>
                </div>
                
                <div style={{
                  padding: '24px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
                  }} />
                  <BookOpen style={{ width: '24px', height: '24px', margin: '0 auto 8px', color: '#ffffff' }} />
                  <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>
                    {subjectsWithClasses}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#cccccc' }}>
                    Matérias Ativas
                  </div>
                </div>
              </div>
            </div>

            {/* Estatísticas Detalhadas */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                paddingBottom: '8px'
              }}>
                Análise Detalhada
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px'
              }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: '#ffffff' }}>
                    {limitedAbsences.length}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#cccccc' }}>
                    Total de Faltas
                  </div>
                </div>
                
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: '#ffffff' }}>
                    {studentsWithAbsences}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#cccccc' }}>
                    Alunos com Faltas
                  </div>
                </div>
                
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: '#ffffff' }}>
                    {Math.round(averageAbsencesPerStudent * 10) / 10}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#cccccc' }}>
                    Média Faltas/Aluno
                  </div>
                </div>
              </div>
            </div>

            {/* Aulas */}
            {limitedClasses.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '20px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  paddingBottom: '8px'
                }}>
                  Aulas Realizadas
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {limitedClasses.map((session: any) => (
                    <div key={session.id} style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      wordWrap: 'break-word',
                      overflow: 'hidden',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{
                        flex: 1,
                        paddingRight: '16px',
                        minWidth: 0,
                        wordWrap: 'break-word'
                      }}>
                        <div style={{
                          fontWeight: 'bold',
                          color: '#ffffff',
                          fontSize: '16px',
                          marginBottom: '6px',
                          wordWrap: 'break-word'
                        }}>
                          {session.subject?.name}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#cccccc',
                          marginBottom: '4px',
                          wordWrap: 'break-word'
                        }}>
                          {session.topic}
                        </div>
                        {session.notes && (
                          <div style={{
                            fontSize: '12px',
                            color: '#aaaaaa',
                            fontStyle: 'italic',
                            wordWrap: 'break-word'
                          }}>
                            {session.notes}
                          </div>
                        )}
                      </div>
                      <div style={{
                        textAlign: 'right',
                        flexShrink: 0,
                        minWidth: '100px'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#ffffff',
                          marginBottom: '4px'
                        }}>
                          {format(new Date(session.date + 'T12:00:00'), 'dd/MM/yyyy')}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#ffffff',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {session.attendance_records?.length || 0} presentes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Faltas */}
            {limitedAbsences.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '20px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  paddingBottom: '8px'
                }}>
                  Faltas Registradas
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {limitedAbsences.map((absence: any) => (
                    <div key={absence.id} style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      wordWrap: 'break-word',
                      overflow: 'hidden',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{
                        flex: 1,
                        paddingRight: '16px',
                        minWidth: 0,
                        wordWrap: 'break-word'
                      }}>
                        <div style={{
                          fontWeight: 'bold',
                          color: '#ffffff',
                          fontSize: '16px',
                          marginBottom: '6px',
                          wordWrap: 'break-word'
                        }}>
                          {absence.student?.name}
                        </div>
                        {absence.reason && (
                          <div style={{
                            fontSize: '14px',
                            color: '#cccccc',
                            wordWrap: 'break-word'
                          }}>
                            {absence.reason}
                          </div>
                        )}
                      </div>
                      <div style={{
                        textAlign: 'right',
                        flexShrink: 0,
                        minWidth: '120px'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#ffffff',
                          marginBottom: '4px'
                        }}>
                          {format(new Date(absence.absence_date + 'T12:00:00'), 'dd/MM/yyyy')}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          border: '1px solid',
                          borderRadius: '12px',
                          backgroundColor: absence.justified ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          color: absence.justified ? '#ffffff' : '#cccccc',
                          borderColor: absence.justified ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'
                        }}>
                          {absence.justified ? 'Justificada' : 'Não Justificada'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '2px solid rgba(255, 255, 255, 0.3)',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-2px',
                left: '30%',
                right: '30%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
              }} />
              <p style={{
                fontSize: '12px',
                color: '#cccccc',
                margin: '0 0 8px 0'
              }}>
                System Tb - Relatório gerado automaticamente
              </p>
              <p style={{
                fontSize: '10px',
                color: '#aaaaaa',
                margin: '0'
              }}>
                Este documento contém informações confidenciais da instituição de ensino
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualReportGenerator;
