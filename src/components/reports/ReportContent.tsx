
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
  const limitedAbsences = filteredAbsences.slice(0, 15);
  const limitedClasses = filteredClasses.slice(0, 12);

  // Calcular presenças por dia
  const attendancesByDate = filteredClasses.reduce((acc: any, session: any) => {
    const date = session.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += session.attendance_records?.length || 0;
    return acc;
  }, {});

  const totalDailyAttendances = Object.values(attendancesByDate).reduce((sum: number, count: number) => sum + count, 0);

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: '1.4',
      padding: '30px',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '1000px',
      boxSizing: 'border-box',
      pageBreakInside: 'avoid'
    }}>
      {/* Header com espaçamento fixo */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #2563eb',
        height: 'auto',
        overflow: 'visible'
      }}>
        {logoUrl && (
          <div style={{ 
            marginBottom: '15px',
            height: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 10px 0',
          lineHeight: '1.2'
        }}>
          Sistema de Gestão Acadêmica
        </h1>
        <h2 style={{
          fontSize: '16px',
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

      {/* Estatísticas em grid responsivo */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 15px 0',
          paddingBottom: '8px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          Estatísticas Gerais
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          justifyContent: 'space-between'
        }}>
          <div style={{
            flex: '1 1 180px',
            minWidth: '180px',
            padding: '15px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#f9fafb'
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
              fontSize: '11px', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Total de Alunos
            </div>
          </div>
          
          <div style={{
            flex: '1 1 180px',
            minWidth: '180px',
            padding: '15px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#f9fafb'
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
              fontSize: '11px', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Aulas no Período
            </div>
          </div>

          <div style={{
            flex: '1 1 180px',
            minWidth: '180px',
            padding: '15px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#dc2626',
              margin: '0 0 5px 0'
            }}>
              {totalDailyAttendances}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Total de Presenças
            </div>
          </div>

          <div style={{
            flex: '1 1 180px',
            minWidth: '180px',
            padding: '15px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              margin: '0 0 5px 0'
            }}>
              {subjectsWithClasses}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#374151',
              fontWeight: '500'
            }}>
              Matérias Ativas
            </div>
          </div>
        </div>
      </div>

      {/* Presenças por Data */}
      {Object.keys(attendancesByDate).length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 15px 0',
            paddingBottom: '8px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            Presenças por Data
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(attendancesByDate).map(([date, count]) => (
              <div key={date} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 15px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>
                  {format(new Date(date + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669' }}>
                  {count} presenças
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aulas com layout melhorado */}
      {limitedClasses.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 15px 0',
            paddingBottom: '8px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            Aulas Realizadas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {limitedClasses.map((session: any) => (
              <div key={session.id} style={{
                padding: '15px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#f9fafb',
                breakInside: 'avoid'
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
                    fontSize: '13px',
                    flex: '1',
                    marginRight: '10px'
                  }}>
                    {session.subject?.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    whiteSpace: 'nowrap'
                  }}>
                    {format(new Date(session.date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  marginBottom: '5px',
                  wordWrap: 'break-word'
                }}>
                  <strong>Tópico:</strong> {session.topic}
                </div>
                {session.notes && (
                  <div style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    wordWrap: 'break-word'
                  }}>
                    <strong>Observações:</strong> {session.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faltas com layout melhorado */}
      {limitedAbsences.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 15px 0',
            paddingBottom: '8px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            Faltas Registradas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {limitedAbsences.map((absence: any) => (
              <div key={absence.id} style={{
                padding: '15px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#f9fafb',
                breakInside: 'avoid'
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
                    fontSize: '13px',
                    flex: '1',
                    marginRight: '10px'
                  }}>
                    {absence.student?.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    whiteSpace: 'nowrap'
                  }}>
                    {format(new Date(absence.absence_date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {absence.reason && (
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      flex: '1',
                      marginRight: '10px',
                      wordWrap: 'break-word'
                    }}>
                      <strong>Motivo:</strong> {absence.reason}
                    </div>
                  )}
                  <div style={{
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: absence.justified ? '#dcfce7' : '#fee2e2',
                    color: absence.justified ? '#166534' : '#991b1b',
                    whiteSpace: 'nowrap',
                    fontWeight: '500'
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
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '10px',
          color: '#6b7280',
          margin: '0 0 5px 0'
        }}>
          Sistema de Gestão Acadêmica - Relatório Oficial
        </p>
        <p style={{
          fontSize: '9px',
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
