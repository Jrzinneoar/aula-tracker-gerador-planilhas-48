
import React from 'react';

interface StatsSummaryProps {
  totalStudents: number;
  totalClasses: number;
  totalAbsences: number;
  unjustifiedAbsences: number;
}

const StatsSummary = ({ 
  totalStudents, 
  totalClasses, 
  totalAbsences, 
  unjustifiedAbsences 
}: StatsSummaryProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
        <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
        <div className="text-sm text-blue-800 font-medium">Total de Alunos</div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
        <div className="text-2xl font-bold text-green-600">{totalClasses}</div>
        <div className="text-sm text-green-800 font-medium">Aulas no Período</div>
      </div>
      <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
        <div className="text-2xl font-bold text-red-600">{totalAbsences}</div>
        <div className="text-sm text-red-800 font-medium">Faltas no Período</div>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
        <div className="text-2xl font-bold text-yellow-600">{unjustifiedAbsences}</div>
        <div className="text-sm text-yellow-800 font-medium">Faltas Não Justificadas</div>
      </div>
    </div>
  );
};

export default StatsSummary;
