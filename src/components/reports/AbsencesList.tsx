
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AbsencesListProps {
  absences: Array<{
    id: string;
    student?: { name: string };
    absence_date: string;
    reason?: string;
    justified: boolean;
  }>;
}

const AbsencesList = ({ absences }: AbsencesListProps) => {
  if (absences.length === 0) return null;

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
        Faltas Registradas
      </h3>
      <div style={{ 
        display: 'grid',
        gap: '12px',
        width: '100%'
      }}>
        {absences.slice(0, 8).map((absence) => (
          <div key={absence.id} style={{
            padding: '15px',
            border: '2px solid #fecaca',
            borderRadius: '6px',
            backgroundColor: '#fef2f2'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div style={{
                fontWeight: 'bold',
                color: '#1f2937',
                fontSize: '14px',
                flex: '1'
              }}>
                {absence.student?.name || 'Nome não disponível'}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                backgroundColor: '#e5e7eb',
                padding: '3px 6px',
                borderRadius: '3px',
                fontWeight: '600'
              }}>
                {format(new Date(absence.absence_date + 'T12:00:00'), 'dd/MM/yyyy')}
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '10px'
            }}>
              {absence.reason && (
                <div style={{
                  fontSize: '12px',
                  color: '#4b5563',
                  flex: '1',
                  lineHeight: '1.3'
                }}>
                  <strong>Motivo:</strong> {absence.reason}
                </div>
              )}
              <div style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '15px',
                backgroundColor: absence.justified ? '#dcfce7' : '#fee2e2',
                color: absence.justified ? '#166534' : '#991b1b',
                fontWeight: '700',
                whiteSpace: 'nowrap'
              }}>
                {absence.justified ? 'Justificada' : 'Não Justificada'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbsencesList;
