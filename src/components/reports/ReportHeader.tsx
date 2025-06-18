
import React from 'react';
import { format } from 'date-fns';

interface ReportHeaderProps {
  logoUrl?: string;
  title: string;
}

const ReportHeader = ({ logoUrl, title }: ReportHeaderProps) => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '30px',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '20px'
    }}>
      {logoUrl ? (
        <div style={{ marginBottom: '16px' }}>
          <img 
            src={logoUrl} 
            alt="Logo da Instituição" 
            style={{
              maxWidth: '180px',
              maxHeight: '80px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>
      ) : (
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          Desenvolvimento de Sistemas
        </h1>
      )}
      <h2 style={{
        fontSize: '20px',
        color: '#2563eb',
        fontWeight: '600',
        marginBottom: '8px',
        margin: '0 0 8px 0'
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: '12px',
        color: '#6b7280',
        margin: '0'
      }}>
        Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}
      </p>
    </div>
  );
};

export default ReportHeader;
