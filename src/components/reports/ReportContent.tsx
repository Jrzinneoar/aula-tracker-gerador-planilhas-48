
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
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      borderRadius: '12px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '1200px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        borderBottom: '2px solid #ffffff',
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
                margin: '0 auto',
                filter: 'brightness(1.1) contrast(1.1)'
              }}
            />
          </div>
        ) : (
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '12px',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(255, 255, 255, 0.1)'
          }}>
            System
          </h1>
        )}
        <h2 style={{
          fontSize: '24px',
          color: '#ffffff',
          fontWeight: '600',
          marginBottom: '12px',
          margin: '0 0 12px 0',
          textShadow: '1px 1px 2px rgba(255, 255, 255, 0.1)'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#cccccc',
          margin: '0'
        }}>
          Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>

      <ReportStatistics
        totalStudents={students.length}
        totalClasses={limitedClasses.length}
        attendanceRate={attendanceRate}
        subjectsWithClasses={subjectsWithClasses}
        reportType={reportType}
        totalAbsences={limitedAbsences.length}
        totalAttendances={totalAttendances}
        studentsWithPerfectAttendance={studentsWithPerfectAttendance}
        averageAbsencesPerStudent={averageAbsencesPerStudent}
        justifiedAbsences={justifiedAbsences}
        unjustifiedAbsences={unjustifiedAbsences}
      />

      {/* Estatísticas por Matéria (apenas para semanal e mensal) */}
      {(reportType === 'weekly' || reportType === 'monthly') && subjectStats.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BookOpen style={{ width: '18px', height: '18px' }} />
            Desempenho por Matéria
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {subjectStats.slice(0, 6).map((stat, index) => (
              <div key={index} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontSize: '16px',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {stat.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#cccccc'
                  }}>
                    {stat.classes} aulas • {stat.absences} faltas
                  </div>
                </div>
                <div style={{
                  textAlign: 'right',
                  flexShrink: 0,
                  marginLeft: '16px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '4px'
                  }}>
                    {Math.round(stat.attendanceRate)}%
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#cccccc'
                  }}>
                    presença
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Alunos com Mais Faltas (apenas para semanal e mensal) */}
      {(reportType === 'weekly' || reportType === 'monthly') && studentAbsenceStats.filter(s => s.absences > 0).length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp style={{ width: '18px', height: '18px' }} />
            Alunos com Mais Faltas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {studentAbsenceStats.filter(s => s.absences > 0).slice(0, 5).map((student, index) => (
              <div key={index} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {student.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '14px' }}>
                    {student.absences} faltas
                  </div>
                  <div style={{ fontSize: '10px', color: '#cccccc' }}>
                    {student.justified} justificadas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aulas */}
      {limitedClasses.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Calendar style={{ width: '18px', height: '18px' }} />
            Aulas Realizadas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {limitedClasses.map((session: any) => (
              <div key={session.id} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                wordWrap: 'break-word',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  flex: 1,
                  paddingRight: '16px',
                  minWidth: 0,
                  wordWrap: 'break-word'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontSize: '16px',
                    marginBottom: '6px',
                    wordWrap: 'break-word'
                  }}>
                    {session.subject?.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#cccccc',
                    marginBottom: '4px',
                    wordWrap: 'break-word'
                  }}>
                    {session.topic}
                  </div>
                  {session.notes && (
                    <div style={{
                      fontSize: '12px',
                      color: '#aaaaaa',
                      fontStyle: 'italic',
                      wordWrap: 'break-word'
                    }}>
                      {session.notes}
                    </div>
                  )}
                </div>
                <div style={{
                  textAlign: 'right',
                  flexShrink: 0,
                  minWidth: '100px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '4px'
                  }}>
                    {format(new Date(session.date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    border: '1px solid',
                    borderRadius: '12px',
                    backgroundColor: session.attendance_records?.length || 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    color: session.attendance_records?.length || 0 ? '#ffffff' : '#cccccc',
                    borderColor: session.attendance_records?.length || 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'
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
            color: '#ffffff',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <UserX style={{ width: '18px', height: '18px' }} />
            Faltas Registradas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {limitedAbsences.map((absence: any) => (
              <div key={absence.id} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                wordWrap: 'break-word',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  flex: 1,
                  paddingRight: '16px',
                  minWidth: 0,
                  wordWrap: 'break-word'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontSize: '16px',
                    marginBottom: '6px',
                    wordWrap: 'break-word'
                  }}>
                    {absence.student?.name}
                  </div>
                  {absence.reason && (
                    <div style={{
                      fontSize: '14px',
                      color: '#cccccc',
                      wordWrap: 'break-word'
                    }}>
                      {absence.reason}
                    </div>
                  )}
                </div>
                <div style={{
                  textAlign: 'right',
                  flexShrink: 0,
                  minWidth: '120px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '4px'
                  }}>
                    {format(new Date(absence.absence_date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    border: '1px solid',
                    borderRadius: '12px',
                    backgroundColor: absence.justified ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    color: absence.justified ? '#ffffff' : '#cccccc',
                    borderColor: absence.justified ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'
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
        borderTop: '2px solid rgba(255, 255, 255, 0.3)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '30%',
          right: '30%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
        }} />
        <p style={{
          fontSize: '12px',
          color: '#cccccc',
          margin: '0 0 8px 0'
        }}>
          System - Relatório gerado automaticamente
        </p>
        <p style={{
          fontSize: '10px',
          color: '#aaaaaa',
          margin: '0'
        }}>
          Este documento contém informações confidenciais da instituição de ensino
        </p>
      </div>
    </div>
  );
};

export default ReportContent;
