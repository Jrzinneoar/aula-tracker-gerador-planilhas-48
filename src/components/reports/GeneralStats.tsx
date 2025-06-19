
import React from 'react';

interface GeneralStatsProps {
  totalStudents: number;
  totalClasses: number;
  totalAbsences: number;
  attendanceRate: number;
}

const GeneralStats = ({
  totalStudents,
  totalClasses,
  totalAbsences,
  attendanceRate
}: GeneralStatsProps) => {
  return (
    <div style={{ 
      marginBottom: '30px',
      width: '100%'
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 15px 0',
        paddingBottom: '8px',
        borderBottom: '2px solid #e5e7eb',
        textAlign: 'center'
      }}>
        Resumo Geral
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        width: '100%'
      }}>
        <div style={{
          padding: '15px',
          border: '2px solid #e5e7eb',
          borderRadius: '10px',
          textAlign: 'center',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#2563eb',
            margin: '0 0 5px 0'
          }}>
            {totalStudents}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#374151',
            fontWeight: '600'
          }}>
            Total de Alunos
          </div>
        </div>
        
        <div style={{
          padding: '15px',
          border: '2px solid #e5e7eb',
          borderRadius: '10px',
          textAlign: 'center',
          backgroundColor: '#f0fdf4'
        }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#059669',
            margin: '0 0 5px 0'
          }}>
            {totalClasses}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#374151',
            fontWeight: '600'
          }}>
            Aulas no Período
          </div>
        </div>

        <div style={{
          padding: '15px',
          border: '2px solid #e5e7eb',
          borderRadius: '10px',
          textAlign: 'center',
          backgroundColor: '#fef2f2'
        }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            margin: '0 0 5px 0'
          }}>
            {totalAbsences}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#374151',
            fontWeight: '600'
          }}>
            Total de Faltas
          </div>
        </div>

        <div style={{
          padding: '15px',
          border: '2px solid #e5e7eb',
          borderRadius: '10px',
          textAlign: 'center',
          backgroundColor: '#fefce8'
        }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#ca8a04',
            margin: '0 0 5px 0'
          }}>
            {Math.round(attendanceRate)}%
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#374151',
            fontWeight: '600'
          }}>
            Taxa de Frequência
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralStats;
