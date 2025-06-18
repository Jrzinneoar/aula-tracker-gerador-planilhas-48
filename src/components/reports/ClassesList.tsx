
import React from 'react';
import { format } from 'date-fns';
import { BookOpen } from 'lucide-react';

interface ClassesListProps {
  classes: any[];
}

const ClassesList = ({ classes }: ClassesListProps) => {
  if (classes.length === 0) return null;

  return (
    <div className="mb-8 break-inside-avoid">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
        <BookOpen className="w-5 h-5 text-blue-600" />
        Aulas Realizadas
      </h3>
      <div className="space-y-3">
        {classes.map((session: any) => (
          <div key={session.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 break-inside-avoid">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 truncate">{session.subject?.name}</div>
                <div className="text-sm text-gray-600 mt-1 break-words">{session.topic}</div>
                {session.notes && (
                  <div className="text-xs text-gray-500 mt-2 italic break-words">{session.notes}</div>
                )}
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <div className="text-sm font-medium text-gray-700">
                  {format(new Date(session.date), 'dd/MM/yyyy')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {session.attendance_records?.length || 0} presentes
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesList;
