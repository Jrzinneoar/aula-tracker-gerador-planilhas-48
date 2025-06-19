
import React from 'react';
import { BarChart3, Users, Calendar, Activity, BookOpen, PieChart, UserX, UserCheck, Award, Clock } from 'lucide-react';

interface ReportStatisticsProps {
  totalStudents: number;
  totalClasses: number;
  attendanceRate: number;
  subjectsWithClasses: number;
  reportType: 'daily' | 'weekly' | 'monthly';
  totalAbsences: number;
  totalAttendances: number;
  studentsWithPerfectAttendance: number;
  averageAbsencesPerStudent: number;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
}

const ReportStatistics = ({
  totalStudents,
  totalClasses,
  attendanceRate,
  subjectsWithClasses,
  reportType,
  totalAbsences,
  totalAttendances,
  studentsWithPerfectAttendance,
  averageAbsencesPerStudent,
  justifiedAbsences,
  unjustifiedAbsences
}: ReportStatisticsProps) => {
  const StatCard = ({ icon: Icon, value, label, style }: any) => (
    <div style={{
      padding: '24px',
      borderRadius: '12px',
      textAlign: 'center',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      ...style
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
      }} />
      <Icon style={{ width: '24px', height: '24px', margin: '0 auto 8px', color: '#ffffff' }} />
      <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>
        {value}
      </div>
      <div style={{ fontSize: '14px', fontWeight: '600', color: '#cccccc' }}>
        {label}
      </div>
    </div>
  );

  return (
    <>
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
          <BarChart3 style={{ width: '20px', height: '20px' }} />
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
          <StatCard icon={Users} value={totalStudents} label="Total de Alunos" />
          <StatCard icon={Calendar} value={totalClasses} label="Aulas no Período" />
          <StatCard icon={Activity} value={`${Math.round(attendanceRate)}%`} label="Taxa de Presença" />
          <StatCard icon={BookOpen} value={subjectsWithClasses} label="Matérias Ativas" />
        </div>
      </div>

      {/* Estatísticas Detalhadas (mais informações para semanal e mensal) */}
      {(reportType === 'weekly' || reportType === 'monthly') && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <PieChart style={{ width: '18px', height: '18px' }} />
            Análise Detalhada
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            <StatCard 
              icon={UserX} 
              value={totalAbsences} 
              label="Total de Faltas"
              style={{ padding: '16px' }}
            />
            <StatCard 
              icon={UserCheck} 
              value={totalAttendances} 
              label="Total Presenças"
              style={{ padding: '16px' }}
            />
            <StatCard 
              icon={Award} 
              value={studentsWithPerfectAttendance} 
              label="Presença Perfeita"
              style={{ padding: '16px' }}
            />
            <StatCard 
              icon={Clock} 
              value={Math.round(averageAbsencesPerStudent * 10) / 10} 
              label="Média Faltas/Aluno"
              style={{ padding: '16px' }}
            />
          </div>

          {/* Estatísticas Justificadas vs Não Justificadas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '20px'
          }}>
            <StatCard 
              value={justifiedAbsences} 
              label="Faltas Justificadas"
              style={{ padding: '16px' }}
            />
            <StatCard 
              value={unjustifiedAbsences} 
              label="Faltas Não Justificadas"
              style={{ padding: '16px' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReportStatistics;
