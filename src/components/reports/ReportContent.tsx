
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, UserX, BookOpen, TrendingUp } from 'lucide-react';
import ReportStatistics from './ReportStatistics';

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
  const limitedAbsences = filteredAbsences.slice(0, 12);
  const limitedClasses = filteredClasses.slice(0, 10);

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      borderRadius: '0',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'visible',
      minHeight: '1200px',
      border: '2px solid #e5e7eb'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        borderBottom: '3px solid #2563eb',
        paddingBottom: '24px',
        position: 'relative'
      }}>
        {logoUrl ? (
          <div style={{ marginBottom: '20px' }}>
            <img 
              src={logoUrl} 
              alt="Logo da Instituição" 
              style={{
                maxWidth: '220px',
                maxHeight: '90px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>
        ) : (
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>
            System
          </h1>
        )}
        <h2 style={{
          fontSize: '24px',
          color: '#2563eb',
          fontWeight: '600',
          marginBottom: '12px',
          margin: '0 0 12px 0'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          margin: '0'
        }}>
          Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>

      {/* Estatísticas Principais */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '20px',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '10px',
          display: 'block',
          margin: '0 0 20px 0'
        }}>
          Estatísticas Gerais
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '12px', 
              color: '#2563eb',
              lineHeight: '1.2'
            }}>
              {students.length}
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#374151',
              lineHeight: '1.4'
            }}>
              Total de Alunos
            </div>
          </div>
          <div style={{
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '12px', 
              color: '#059669',
              lineHeight: '1.2'
            }}>
              {limitedClasses.length}
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#374151',
              lineHeight: '1.4'
            }}>
              Aulas no Período
            </div>
          </div>
          <div style={{
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '12px', 
              color: '#dc2626',
              lineHeight: '1.2'
            }}>
              {Math.round(attendanceRate)}%
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#374151',
              lineHeight: '1.4'
            }}>
              Taxa de Presença
            </div>
          </div>
          <div style={{
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '12px', 
              color: '#7c3aed',
              lineHeight: '1.2'
            }}>
              {subjectsWithClasses}
            </div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#374151',
              lineHeight: '1.4'
            }}>
              Matérias Ativas
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Detalhadas */}
      {(reportType === 'weekly' || reportType === 'monthly') && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '8px',
            margin: '0 0 20px 0'
          }}>
            Análise Detalhada
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '20px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              textAlign: 'center',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#dc2626', 
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                {limitedAbsences.length}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#374151',
                lineHeight: '1.4'
              }}>
                Total de Faltas
              </div>
            </div>
            <div style={{
              padding: '20px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              textAlign: 'center',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#059669', 
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                {totalAttendances}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#374151',
                lineHeight: '1.4'
              }}>
                Total Presenças
              </div>
            </div>
            <div style={{
              padding: '20px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              textAlign: 'center',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#2563eb', 
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                {studentsWithPerfectAttendance}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#374151',
                lineHeight: '1.4'
              }}>
                Presença Perfeita
              </div>
            </div>
            <div style={{
              padding: '20px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              textAlign: 'center',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#7c3aed', 
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                {Math.round(averageAbsencesPerStudent * 10) / 10}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#374151',
                lineHeight: '1.4'
              }}>
                Média Faltas/Aluno
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aulas */}
      {limitedClasses.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '8px',
            margin: '0 0 20px 0'
          }}>
            Aulas Realizadas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {limitedClasses.map((session: any) => (
              <div key={session.id} style={{
                backgroundColor: '#f9fafb',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                minHeight: '80px'
              }}>
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#1f2937',
                    fontSize: '16px',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {session.subject?.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '6px',
                    lineHeight: '1.4'
                  }}>
                    {session.topic}
                  </div>
                  {session.notes && (
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      fontStyle: 'italic',
                      lineHeight: '1.4'
                    }}>
                      {session.notes}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {format(new Date(session.date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    whiteSpace: 'nowrap'
                  }}>
                    {session.attendance_records?.length || 0} presentes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faltas */}
      {limitedAbsences.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '8px',
            margin: '0 0 20px 0'
          }}>
            Faltas Registradas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {limitedAbsences.map((absence: any) => (
              <div key={absence.id} style={{
                backgroundColor: '#f9fafb',
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                minHeight: '80px'
              }}>
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#1f2937',
                    fontSize: '16px',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {absence.student?.name}
                  </div>
                  {absence.reason && (
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.4'
                    }}>
                      {absence.reason}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {format(new Date(absence.absence_date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '12px',
                    backgroundColor: absence.justified ? '#dcfce7' : '#fee2e2',
                    color: absence.justified ? '#166534' : '#991b1b',
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
        paddingTop: '24px',
        borderTop: '2px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          margin: '0 0 8px 0',
          lineHeight: '1.4'
        }}>
          System - Relatório gerado automaticamente
        </p>
        <p style={{
          fontSize: '10px',
          color: '#9ca3af',
          margin: '0',
          lineHeight: '1.4'
        }}>
          Este documento contém informações confidenciais da instituição de ensino
        </p>
      </div>
    </div>
  );
};

export default ReportContent;
