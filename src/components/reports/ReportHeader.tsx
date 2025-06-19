
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportHeaderProps {
  logoUrl: string;
  title: string;
}

const ReportHeader = ({ logoUrl, title }: ReportHeaderProps) => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '3px solid #2563eb',
      width: '100%'
    }}>
      {logoUrl && (
        <div style={{ 
          marginBottom: '15px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <img 
            src={logoUrl} 
            alt="Logo" 
            style={{
              maxWidth: '150px',
              maxHeight: '60px',
              objectFit: 'contain'
            }}
          />
        </div>
      )}
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 10px 0',
        lineHeight: '1.2'
      }}>
        Sistema de Frequência
      </h1>
      <h2 style={{
        fontSize: '18px',
        color: '#2563eb',
        fontWeight: '600',
        margin: '0 0 10px 0',
        lineHeight: '1.2'
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: '11px',
        color: '#6b7280',
        margin: '0'
      }}>
        Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
      </p>
    </div>
  );
};

export default ReportHeader;
