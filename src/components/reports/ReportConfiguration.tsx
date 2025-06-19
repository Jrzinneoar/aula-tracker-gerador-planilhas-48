
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Upload, X, Download } from 'lucide-react';

interface ReportConfigurationProps {
  reportType: 'daily' | 'weekly' | 'monthly';
  setReportType: (type: 'daily' | 'weekly' | 'monthly') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  onGenerateReport: () => void;
  isGenerating: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ReportConfiguration = ({
  reportType,
  setReportType,
  selectedDate,
  setSelectedDate,
  logoUrl,
  onLogoUpload,
  onRemoveLogo,
  onGenerateReport,
  isGenerating,
  fileInputRef
}: ReportConfigurationProps) => {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-black">
          <Settings className="w-5 h-5" />
          Configurações do Relatório
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Tipo de Relatório</label>
            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
              <SelectTrigger className="bg-white border-gray-300 text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="daily" className="text-black">Relatório Diário</SelectItem>
                <SelectItem value="weekly" className="text-black">Relatório Semanal</SelectItem>
                <SelectItem value="monthly" className="text-black">Relatório Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-black">Data de Referência</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-black">Logo da Instituição</label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onLogoUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border-gray-300 text-black hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
              Escolher Logo
            </Button>
            {logoUrl && (
              <div className="flex items-center gap-2">
                <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain border border-gray-300 rounded" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRemoveLogo}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={onGenerateReport} 
          className="w-full bg-black text-white hover:bg-gray-800" 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Gerando Relatório...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Gerar e Baixar Relatório Visual
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportConfiguration;
