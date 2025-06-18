
import React from 'react';
import { format } from 'date-fns';

interface ReportHeaderProps {
  logoUrl?: string;
  title: string;
}

const ReportHeader = ({ logoUrl, title }: ReportHeaderProps) => {
  return (
    <div className="text-center mb-8 border-b border-gray-200 pb-6">
      {logoUrl ? (
        <div className="flex justify-center mb-4">
          <img 
            src={logoUrl} 
            alt="Logo da Instituição" 
            className="max-w-48 max-h-24 object-contain"
            style={{ maxWidth: '192px', maxHeight: '96px' }}
          />
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Desenvolvimento de Sistemas
        </h1>
      )}
      <h2 className="text-xl text-blue-600 font-semibold mb-2">
        {title}
      </h2>
      <p className="text-sm text-gray-500">
        Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}
      </p>
    </div>
  );
};

export default ReportHeader;
