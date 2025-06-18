
import React from 'react';
import { format } from 'date-fns';
import { TrendingDown } from 'lucide-react';

interface AbsencesListProps {
  absences: any[];
}

const AbsencesList = ({ absences }: AbsencesListProps) => {
  if (absences.length === 0) return null;

  return (
    <div className="mb-8 break-inside-avoid">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
        <TrendingDown className="w-5 h-5 text-red-600" />
        Faltas Registradas
      </h3>
      <div className="space-y-3">
        {absences.map((absence: any) => (
          <div key={absence.id} className="bg-red-50 p-4 rounded-lg border border-red-200 break-inside-avoid">
            <div className="flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 truncate">{absence.student?.name}</div>
                {absence.reason && (
                  <div className="text-sm text-gray-600 mt-1 break-words">{absence.reason}</div>
                )}
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <div className="text-sm font-medium text-gray-700">
                  {format(new Date(absence.absence_date), 'dd/MM/yyyy')}
                </div>
                <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                  absence.justified 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {absence.justified ? 'Justificada' : 'Não Justificada'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbsencesList;
