
import React from 'react';
import { format } from 'date-fns';

interface ClassesListProps {
  classes: any[];
}

const ClassesList = ({ classes }: ClassesListProps) => {
  if (classes.length === 0) return null;

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
        📚 Aulas Realizadas
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {classes.map((session: any) => (
          <div key={session.id} style={{
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            minHeight: '80px',
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
                color: '#1e40af',
                fontSize: '14px',
                marginBottom: '4px',
                wordWrap: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {session.subject?.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#4b5563',
                marginBottom: '8px',
                wordWrap: 'break-word',
                lineHeight: '1.4'
              }}>
                {session.topic}
              </div>
              {session.notes && (
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  fontStyle: 'italic',
                  wordWrap: 'break-word',
                  lineHeight: '1.3'
                }}>
                  {session.notes}
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
                {format(new Date(session.date), 'dd/MM/yyyy')}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#059669',
                backgroundColor: '#d1fae5',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #a7f3d0'
              }}>
                {session.attendance_records?.length || 0} presentes
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesList;
