
import React from 'react';

const ReportFooter = () => {
  return (
    <div style={{
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #d1d5db',
      textAlign: 'center'
    }}>
      <p style={{
        fontSize: '10px',
        color: '#6b7280',
        margin: '0 0 4px 0'
      }}>
        Desenvolvimento de Sistemas - Relatório gerado automaticamente
      </p>
      <p style={{
        fontSize: '10px',
        color: '#9ca3af',
        margin: '0'
      }}>
        Este documento contém informações confidenciais da instituição de ensino
      </p>
    </div>
  );
};

export default ReportFooter;
