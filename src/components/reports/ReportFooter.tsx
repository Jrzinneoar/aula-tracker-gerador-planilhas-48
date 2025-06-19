
import React from 'react';

const ReportFooter = () => {
  return (
    <div style={{
      marginTop: '30px',
      paddingTop: '15px',
      borderTop: '2px solid #e5e7eb',
      textAlign: 'center',
      width: '100%'
    }}>
      <p style={{
        fontSize: '11px',
        color: '#6b7280',
        margin: '0 0 5px 0',
        fontWeight: '600'
      }}>
        Sistema de Frequência - Relatório Oficial
      </p>
      <p style={{
        fontSize: '10px',
        color: '#9ca3af',
        margin: '0'
      }}>
        Documento confidencial da instituição de ensino
      </p>
    </div>
  );
};

export default ReportFooter;
