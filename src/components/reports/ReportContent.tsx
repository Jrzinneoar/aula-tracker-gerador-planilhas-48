
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportContentProps {
  logoUrl: string;
  title: string;
  reportType: 'daily' | 'weekly' | 'monthly';
  filteredAbsences: any[];
  filteredClasses: any[];
  students: any[];
  subjects: any[];
  attendanceRate: number;
  subjectsWithClasses: number;
  totalAttendances: number;
  studentsWithPerfectAttendance: number;
  averageAbsencesPerStudent: number;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
  subjectStats: any[];
  studentAbsenceStats: any[];
}

const ReportContent = ({
  logoUrl,
  title,
  reportType,
  filteredAbsences,
  filteredClasses,
  students,
  attendanceRate,
  subjectsWithClasses,
  totalAttendances,
  studentsWithPerfectAttendance,
  averageAbsencesPerStudent,
  justifiedAbsences,
  unjustifiedAbsences,
  subjectStats,
  studentAbsenceStats
}: ReportContentProps) => {
  const limitedAbsences = filteredAbsences.slice(0, 10);
  const limitedClasses = filteredClasses.slice(0, 8);

  // Calcular presenças por dia
  const attendancesByDate = filteredClasses.reduce((acc: any, session: any) => {
    const date = session.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += session.attendance_records?.length || 0;
    return acc;
  }, {});

  const totalDailyAttendances = Object.values(attendancesByDate).reduce((sum: number, count: any) => sum + (count as number), 0);

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      lineHeight: '1.4',
      width: '800px',
      maxWidth: '800px',
      minWidth: '800px',
      margin: '0 auto',
      padding: '30px',
      boxSizing: 'border-box',
      overflow: 'visible',
      position: 'relative'
    }}>
      {/* Header - Centralizado */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #2563eb',
        width: '100%'
      }}>
        {logoUrl && (
          <div style={{ 
            marginBottom: '15px',
            height: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
            <img 
              src={logoUrl} 
              alt="Logo" 
              style={{
                maxWidth: '200px',
                maxHeight: '80px',
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

      {/* Estatísticas Gerais - Grid organizado */}
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
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          Resumo Geral
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '20px',
          width: '100%'
        }}>
          <div style={{
            padding: '15px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#2563eb',
              margin: '0 0 5px 0'
            }}>
              {students.length}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Total de Alunos
            </div>
          </div>
          
          <div style={{
            padding: '15px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#f0fdf4'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#059669',
              margin: '0 0 5px 0'
            }}>
              {limitedClasses.length}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Aulas no Período
            </div>
          </div>

          <div style={{
            padding: '15px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#fef2f2'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#dc2626',
              margin: '0 0 5px 0'
            }}>
              {filteredAbsences.length}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Total de Faltas
            </div>
          </div>

          <div style={{
            padding: '15px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#fefce8'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ca8a04',
              margin: '0 0 5px 0'
            }}>
              {totalDailyAttendances}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Presenças Totais
            </div>
          </div>
        </div>
      </div>

      {/* Frequência por Data */}
      {Object.keys(attendancesByDate).length > 0 && (
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
            borderBottom: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            Presenças por Data
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            width: '100%'
          }}>
            {Object.entries(attendancesByDate).slice(0, 6).map(([date, count]) => (
              <div key={date} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 15px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #dcfce7',
                borderRadius: '6px'
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#1f2937' 
                }}>
                  {format(new Date(date + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#059669',
                  backgroundColor: '#dcfce7',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {String(count)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aulas Realizadas */}
      {limitedClasses.length > 0 && (
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
            borderBottom: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            Aulas Realizadas
          </h3>
          <div style={{ 
            display: 'grid',
            gap: '10px',
            width: '100%'
          }}>
            {limitedClasses.map((session: any) => (
              <div key={session.id} style={{
                padding: '15px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#f8fafc'
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
                    {session.subject?.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    backgroundColor: '#e5e7eb',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>
                    {format(new Date(session.date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#4b5563',
                  lineHeight: '1.3'
                }}>
                  <strong>Tópico:</strong> {session.topic}
                </div>
                {session.notes && (
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    marginTop: '5px',
                    lineHeight: '1.3'
                  }}>
                    <strong>Obs:</strong> {session.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faltas Registradas */}
      {limitedAbsences.length > 0 && (
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
            borderBottom: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            Faltas Registradas
          </h3>
          <div style={{ 
            display: 'grid',
            gap: '10px',
            width: '100%'
          }}>
            {limitedAbsences.map((absence: any) => (
              <div key={absence.id} style={{
                padding: '15px',
                border: '1px solid #fecaca',
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
                    {absence.student?.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    backgroundColor: '#e5e7eb',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    fontWeight: '500'
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
                    borderRadius: '12px',
                    backgroundColor: absence.justified ? '#dcfce7' : '#fee2e2',
                    color: absence.justified ? '#166534' : '#991b1b',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>
                    {absence.justified ? 'Justificada' : 'Não Justificada'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '30px',
        paddingTop: '15px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        width: '100%'
      }}>
        <p style={{
          fontSize: '11px',
          color: '#6b7280',
          margin: '0 0 5px 0',
          fontWeight: '500'
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
    </div>
  );
};

export default ReportContent;
