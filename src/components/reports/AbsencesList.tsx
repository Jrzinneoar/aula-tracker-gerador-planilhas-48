
import React from 'react';
import { format } from 'date-fns';

interface AbsencesListProps {
  absences: any[];
}

const AbsencesList = ({ absences }: AbsencesListProps) => {
  if (absences.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '16px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        ❌ Faltas Registradas
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {absences.map((absence: any) => (
          <div key={absence.id} style={{
            backgroundColor: '#fef2f2',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            minHeight: '70px',
            wordWrap: 'break-word',
            overflow: 'hidden'
          }}>
            <div style={{
              flex: 1,
              paddingRight: '16px',
              minWidth: 0
            }}>
              <div style={{
                fontWeight: 'bold',
                color: '#dc2626',
                fontSize: '14px',
                marginBottom: '4px',
                wordWrap: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {absence.student?.name}
              </div>
              {absence.reason && (
                <div style={{
                  fontSize: '12px',
                  color: '#4b5563',
                  wordWrap: 'break-word',
                  lineHeight: '1.4'
                }}>
                  {absence.reason}
                </div>
              )}
            </div>
            <div style={{
              textAlign: 'right',
              flexShrink: 0,
              minWidth: '90px'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {format(new Date(absence.absence_date), 'dd/MM/yyyy')}
              </div>
              <div style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid',
                backgroundColor: absence.justified ? '#d1fae5' : '#fee2e2',
                color: absence.justified ? '#059669' : '#dc2626',
                borderColor: absence.justified ? '#a7f3d0' : '#fecaca'
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
