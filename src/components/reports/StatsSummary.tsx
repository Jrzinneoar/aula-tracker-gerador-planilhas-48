
import React from 'react';

interface StatsSummaryProps {
  totalStudents: number;
  totalClasses: number;
  totalAbsences: number;
  unjustifiedAbsences: number;
}

const StatsSummary = ({ 
  totalStudents, 
  totalClasses, 
  totalAbsences, 
  unjustifiedAbsences 
}: StatsSummaryProps) => {
  const cardStyle = {
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    border: '2px solid',
    marginBottom: '8px'
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '30px'
    }}>
      <div style={{
        ...cardStyle,
        backgroundColor: '#dbeafe',
        borderColor: '#93c5fd',
        color: '#1e40af'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
          {totalStudents}
        </div>
        <div style={{ fontSize: '12px', fontWeight: '500' }}>
          Total de Alunos
        </div>
      </div>
      
      <div style={{
        ...cardStyle,
        backgroundColor: '#dcfce7',
        borderColor: '#86efac',
        color: '#15803d'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
          {totalClasses}
        </div>
        <div style={{ fontSize: '12px', fontWeight: '500' }}>
          Aulas no Período
        </div>
      </div>
      
      <div style={{
        ...cardStyle,
        backgroundColor: '#fee2e2',
        borderColor: '#fca5a5',
        color: '#dc2626'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
          {totalAbsences}
        </div>
        <div style={{ fontSize: '12px', fontWeight: '500' }}>
          Faltas no Período
        </div>
      </div>
      
      <div style={{
        ...cardStyle,
        backgroundColor: '#fef3c7',
        borderColor: '#fcd34d',
        color: '#d97706'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
          {unjustifiedAbsences}
        </div>
        <div style={{ fontSize: '12px', fontWeight: '500' }}>
          Faltas Não Justificadas
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
