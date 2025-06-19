
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
      marginBottom: '40px',
      paddingBottom: '30px',
      borderBottom: '3px solid #2563eb'
    }}>
      {logoUrl ? (
        <div style={{ 
          marginBottom: '20px',
          height: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img 
            src={logoUrl} 
            alt="Logo da Instituição" 
            style={{
              maxWidth: '250px',
              maxHeight: '100px',
              objectFit: 'contain'
            }}
          />
        </div>
      ) : (
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '15px',
          margin: '0 0 15px 0'
        }}>
          Sistema de Frequência
        </h1>
      )}
      <h2 style={{
        fontSize: '22px',
        color: '#2563eb',
        fontWeight: '600',
        marginBottom: '15px',
        margin: '0 0 15px 0'
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
