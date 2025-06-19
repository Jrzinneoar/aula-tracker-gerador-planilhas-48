
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

  const totalDailyAttendances = Object.values(attendancesByDate).reduce((sum: number, count: any) => sum + (count as number), 0);

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '1000px',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        paddingBottom: '30px',
        borderBottom: '3px solid #2563eb'
      }}>
        {logoUrl && (
          <div style={{ 
            marginBottom: '20px',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img 
              src={logoUrl} 
              alt="Logo" 
              style={{
                maxWidth: '250px',
                maxHeight: '100px',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 15px 0',
          lineHeight: '1.2'
        }}>
          Sistema de Frequência
        </h1>
        <h2 style={{
          fontSize: '20px',
          color: '#2563eb',
          fontWeight: '600',
          margin: '0 0 15px 0',
          lineHeight: '1.2'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: '0'
        }}>
          Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 20px 0',
          paddingBottom: '10px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          Resumo Geral
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            padding: '20px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            textAlign: 'center',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#2563eb',
              margin: '0 0 8px 0'
            }}>
              {students.length}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#374151',
              fontWeight: '600'
            }}>
              Total de Alunos
            </div>
          </div>
          
          <div style={{
            padding: '20px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            textAlign: 'center',
            backgroundColor: '#f0fdf4'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#059669',
              margin: '0 0 8px 0'
            }}>
              {limitedClasses.length}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#374151',
              fontWeight: '600'
            }}>
              Aulas no Período
            </div>
          </div>

          <div style={{
            padding: '20px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            textAlign: 'center',
            backgroundColor: '#fef2f2'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#dc2626',
              margin: '0 0 8px 0'
            }}>
              {filteredAbsences.length}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#374151',
              fontWeight: '600'
            }}>
              Total de Faltas
            </div>
          </div>

          <div style={{
            padding: '20px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            textAlign: 'center',
            backgroundColor: '#fefce8'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#ca8a04',
              margin: '0 0 8px 0'
            }}>
              {totalDailyAttendances}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#374151',
              fontWeight: '600'
            }}>
              Presenças no Período
            </div>
          </div>
        </div>
      </div>

      {/* Detalhamento por Data */}
      {Object.keys(attendancesByDate).length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 20px 0',
            paddingBottom: '10px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            Frequência por Data
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px'
          }}>
            {Object.entries(attendancesByDate).map(([date, count]) => (
              <div key={date} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 20px',
                backgroundColor: '#f0fdf4',
                border: '2px solid #dcfce7',
                borderRadius: '10px'
              }}>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#1f2937' 
                }}>
                  {format(new Date(date + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#059669',
                  backgroundColor: '#dcfce7',
                  padding: '4px 12px',
                  borderRadius: '20px'
                }}>
                  {String(count)} presentes
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aulas Realizadas */}
      {limitedClasses.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 20px 0',
            paddingBottom: '10px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            Detalhamento das Aulas
          </h3>
          <div style={{ 
            display: 'grid',
            gap: '15px'
          }}>
            {limitedClasses.map((session: any) => (
              <div key={session.id} style={{
                padding: '20px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#1f2937',
                    fontSize: '16px',
                    flex: '1'
                  }}>
                    {session.subject?.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    backgroundColor: '#e5e7eb',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}>
                    {format(new Date(session.date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>
                  <strong>Tópico:</strong> {session.topic}
                </div>
                {session.notes && (
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    lineHeight: '1.4'
                  }}>
                    <strong>Observações:</strong> {session.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faltas Registradas */}
      {limitedAbsences.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 20px 0',
            paddingBottom: '10px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            Registro de Faltas
          </h3>
          <div style={{ 
            display: 'grid',
            gap: '15px'
          }}>
            {limitedAbsences.map((absence: any) => (
              <div key={absence.id} style={{
                padding: '20px',
                border: '2px solid #fecaca',
                borderRadius: '10px',
                backgroundColor: '#fef2f2'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#1f2937',
                    fontSize: '16px',
                    flex: '1'
                  }}>
                    {absence.student?.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    backgroundColor: '#e5e7eb',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}>
                    {format(new Date(absence.absence_date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  gap: '15px'
                }}>
                  {absence.reason && (
                    <div style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      flex: '1',
                      lineHeight: '1.4'
                    }}>
                      <strong>Motivo:</strong> {absence.reason}
                    </div>
                  )}
                  <div style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '20px',
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
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '2px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: '0 0 8px 0',
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
    </div>
  );
};

export default ReportContent;
