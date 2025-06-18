
import React from 'react';
import { Users, TrendingDown, Award } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Estatísticas destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
          <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-600">{criticalStudents.length}</div>
          <div className="text-sm text-red-800 font-medium">Alunos em Situação Crítica</div>
          <div className="text-xs text-red-600 mt-1">(+5 faltas no mês)</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
          <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{goodAttendance.length}</div>
          <div className="text-sm text-green-800 font-medium">Boa Frequência</div>
          <div className="text-xs text-green-600 mt-1">(0-1 faltas no mês)</div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            {filteredAbsences.length > 0 ? Math.round(filteredAbsences.length / students.length * 10) / 10 : 0}
          </div>
          <div className="text-sm text-blue-800 font-medium">Média de Faltas</div>
          <div className="text-xs text-blue-600 mt-1">por aluno no mês</div>
        </div>
      </div>

      {/* Top 5 com mais faltas */}
      {topAbsentees.length > 0 && (
        <div className="mb-8 break-inside-avoid">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            Alunos com Mais Faltas no Mês
          </h3>
          <div className="space-y-2">
            {topAbsentees.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    {index + 1}º
                  </div>
                  <div className="font-medium text-gray-800">{student.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">{student.monthlyAbsences} faltas</div>
                  <div className="text-xs text-gray-500">Total: {student.totalAbsences}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumo detalhado por aluno */}
      <div className="break-inside-avoid">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
          <Users className="w-5 h-5 text-purple-600" />
          Resumo Detalhado por Aluno
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left font-semibold">Aluno</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Faltas no Mês</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Total de Faltas</th>
                <th className="border border-gray-300 p-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedByMonthlyAbsences.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3 font-medium">{student.name}</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className={`font-semibold ${
                      student.monthlyAbsences > 5 ? 'text-red-600' : 
                      student.monthlyAbsences > 3 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {student.monthlyAbsences}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 text-center font-medium">{student.totalAbsences}</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      student.status === 'Crítico' ? 'bg-red-100 text-red-800' : 
                      student.status === 'Atenção' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
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
