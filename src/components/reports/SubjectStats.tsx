
import React from 'react';

interface SubjectStatsProps {
  subjectStats: Array<{
    name: string;
    classes: number;
    absences: number;
    attendances: number;
    attendanceRate: number;
  }>;
}

const SubjectStats = ({ subjectStats }: SubjectStatsProps) => {
  if (subjectStats.length === 0) return null;

  return (
    <div style={{ 
      marginBottom: '30px',
      width: '100%'
    }}>
      <h4 style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 12px 0',
        textAlign: 'center'
      }}>
        Desempenho por Matéria
      </h4>
      <div style={{ 
        display: 'grid',
        gap: '10px',
        width: '100%'
      }}>
        {subjectStats.slice(0, 5).map((stat, index) => (
          <div key={index} style={{
            padding: '12px 15px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontWeight: '600',
              color: '#1f2937',
              fontSize: '12px'
            }}>
              {stat.name}
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: stat.attendanceRate >= 80 ? '#16a34a' : stat.attendanceRate >= 60 ? '#d97706' : '#dc2626',
              backgroundColor: stat.attendanceRate >= 80 ? '#dcfce7' : stat.attendanceRate >= 60 ? '#fef3c7' : '#fee2e2',
              padding: '3px 8px',
              borderRadius: '10px'
            }}>
              {Math.round(stat.attendanceRate)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectStats;
