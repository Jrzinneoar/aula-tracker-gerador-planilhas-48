
import React from 'react';

interface DetailedStatsProps {
  studentsWithPerfectAttendance: number;
  averageAbsencesPerStudent: number;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
}

const DetailedStats = ({
  studentsWithPerfectAttendance,
  averageAbsencesPerStudent,
  justifiedAbsences,
  unjustifiedAbsences
}: DetailedStatsProps) => {
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
        Estatísticas Detalhadas
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
          backgroundColor: '#f0f9ff'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#0369a1',
            margin: '0 0 5px 0'
          }}>
            {studentsWithPerfectAttendance}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#374151',
            fontWeight: '600'
          }}>
            Frequência Perfeita
          </div>
        </div>

        <div style={{
          padding: '15px',
          border: '2px solid #e5e7eb',
          borderRadius: '10px',
          textAlign: 'center',
          backgroundColor: '#fef3c7'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#d97706',
            margin: '0 0 5px 0'
          }}>
            {Math.round(averageAbsencesPerStudent * 10) / 10}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#374151',
            fontWeight: '600'
          }}>
            Média Faltas/Aluno
          </div>
        </div>

        <div style={{
          padding: '15px',
          border: '2px solid #e5e7eb',
          borderRadius: '10px',
          textAlign: 'center',
          backgroundColor: '#dcfce7'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#16a34a',
            margin: '0 0 5px 0'
          }}>
            {justifiedAbsences}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#374151',
            fontWeight: '600'
          }}>
            Faltas Justificadas
          </div>
        </div>

        <div style={{
          padding: '15px',
          border: '2px solid #e5e7eb',
          borderRadius: '10px',
          textAlign: 'center',
          backgroundColor: '#fee2e2'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#dc2626',
            margin: '0 0 5px 0'
          }}>
            {unjustifiedAbsences}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#374151',
            fontWeight: '600'
          }}>
            Faltas Não Justificadas
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedStats;
