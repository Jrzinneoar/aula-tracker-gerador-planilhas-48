
import React from 'react';

interface MonthlyStatsProps {
  students: any[];
  filteredAbsences: any[];
  getStudentTotalAbsences: (studentId: string) => number;
}

const MonthlyStats = ({ students, filteredAbsences, getStudentTotalAbsences }: MonthlyStatsProps) => {
  // Calcular estatísticas
  const studentsWithAbsences = students.map(student => {
    const monthlyAbsences = filteredAbsences.filter((a: any) => a.student_id === student.id).length;
    const totalAbsences = getStudentTotalAbsences(student.id);
    return {
      ...student,
      monthlyAbsences,
      totalAbsences,
      status: monthlyAbsences > 5 ? 'Crítico' : monthlyAbsences > 3 ? 'Atenção' : 'Normal'
    };
  });

  // Ordenar por faltas mensais (maior para menor)
  const sortedByMonthlyAbsences = [...studentsWithAbsences].sort((a, b) => b.monthlyAbsences - a.monthlyAbsences);
  
  // Top 5 com mais faltas no mês
  const topAbsentees = sortedByMonthlyAbsences.slice(0, 5).filter(s => s.monthlyAbsences > 0);
  
  // Estudantes com status crítico
  const criticalStudents = studentsWithAbsences.filter(s => s.status === 'Crítico');
  
  // Estudantes com boa frequência (0-1 faltas)
  const goodAttendance = studentsWithAbsences.filter(s => s.monthlyAbsences <= 1);

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Estatísticas destacadas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid #fca5a5',
          backgroundColor: '#fee2e2',
          color: '#dc2626'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            {criticalStudents.length}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>
            Alunos em Situação Crítica
          </div>
          <div style={{ fontSize: '9px', marginTop: '2px' }}>
            (+5 faltas no mês)
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid #86efac',
          backgroundColor: '#dcfce7',
          color: '#15803d'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            {goodAttendance.length}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>
            Boa Frequência
          </div>
          <div style={{ fontSize: '9px', marginTop: '2px' }}>
            (0-1 faltas no mês)
          </div>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '2px solid #93c5fd',
          backgroundColor: '#dbeafe',
          color: '#1e40af'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            {filteredAbsences.length > 0 ? Math.round(filteredAbsences.length / students.length * 10) / 10 : 0}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>
            Média de Faltas
          </div>
          <div style={{ fontSize: '9px', marginTop: '2px' }}>
            por aluno no mês
          </div>
        </div>
      </div>

      {/* Top 5 com mais faltas */}
      {topAbsentees.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '8px'
          }}>
            📊 Alunos com Mais Faltas no Mês
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topAbsentees.map((student, index) => (
              <div key={student.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fef2f2',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#dc2626',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    flexShrink: 0
                  }}>
                    {index + 1}º
                  </div>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#1f2937',
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {student.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 'bold', color: '#dc2626', fontSize: '13px' }}>
                    {student.monthlyAbsences} faltas
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                    Total: {student.totalAbsences}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo detalhado por aluno */}
      <div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '8px'
        }}>
          👥 Resumo Detalhado por Aluno
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d1d5db',
            fontSize: '11px',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}>
                  Aluno
                </th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}>
                  Faltas no Mês
                </th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}>
                  Total de Faltas
                </th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '11px'
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedByMonthlyAbsences.map((student) => (
                <tr key={student.id}>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '8px',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {student.name}
                  </td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '8px',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: student.monthlyAbsences > 5 ? '#dc2626' : 
                             student.monthlyAbsences > 3 ? '#d97706' : '#059669'
                    }}>
                      {student.monthlyAbsences}
                    </span>
                  </td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {student.totalAbsences}
                  </td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '8px',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '12px',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      backgroundColor: student.status === 'Crítico' ? '#fee2e2' : 
                                     student.status === 'Atenção' ? '#fef3c7' : '#dcfce7',
                      color: student.status === 'Crítico' ? '#dc2626' : 
                             student.status === 'Atenção' ? '#d97706' : '#059669',
                      border: '1px solid',
                      borderColor: student.status === 'Crítico' ? '#fecaca' : 
                                  student.status === 'Atenção' ? '#fcd34d' : '#86efac'
                    }}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyStats;
