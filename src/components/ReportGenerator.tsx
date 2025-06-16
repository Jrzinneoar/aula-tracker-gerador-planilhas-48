
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student, Subject, ClassSession } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Download } from 'lucide-react';

const ReportGenerator = () => {
  const [students] = useLocalStorage<Student[]>('students', []);
  const [subjects] = useLocalStorage<Subject[]>('subjects', []);
  const [classSessions] = useLocalStorage<ClassSession[]>('classSessions', []);

  const attendanceData = useMemo(() => {
    const data: Record<string, Record<string, { present: number; total: number; percentage: number }>> = {};

    students.forEach(student => {
      data[student.id] = {};
      subjects.forEach(subject => {
        data[student.id][subject.id] = { present: 0, total: 0, percentage: 0 };
      });
    });

    classSessions.forEach(session => {
      session.attendanceRecords.forEach(record => {
        if (data[record.studentId] && data[record.studentId][record.subjectId]) {
          data[record.studentId][record.subjectId].total++;
          if (record.present) {
            data[record.studentId][record.subjectId].present++;
          }
        }
      });
    });

    // Calculate percentages
    Object.keys(data).forEach(studentId => {
      Object.keys(data[studentId]).forEach(subjectId => {
        const stats = data[studentId][subjectId];
        if (stats.total > 0) {
          stats.percentage = Math.round((stats.present / stats.total) * 100);
        }
      });
    });

    return data;
  }, [students, subjects, classSessions]);

  const generateCSV = (reportType: 'full' | 'summary') => {
    let csvContent = '';

    if (reportType === 'full') {
      // Full detailed report
      csvContent = 'Data,Matéria,Professor,Tópico,Aluno,Status,Observações\n';
      
      classSessions.forEach(session => {
        const subject = subjects.find(s => s.id === session.subjectId);
        const sessionDate = format(new Date(session.date), 'dd/MM/yyyy');
        
        session.attendanceRecords.forEach(record => {
          const student = students.find(s => s.id === record.studentId);
          csvContent += `${sessionDate},`;
          csvContent += `"${subject?.name || 'N/A'}",`;
          csvContent += `"${subject?.teacher || 'N/A'}",`;
          csvContent += `"${session.topic}",`;
          csvContent += `"${student?.name || 'N/A'}",`;
          csvContent += `${record.present ? 'Presente' : 'Falta'},`;
          csvContent += `"${record.notes || ''}"\n`;
        });
      });
    } else {
      // Summary report
      csvContent = 'Aluno,Email,';
      subjects.forEach(subject => {
        csvContent += `${subject.name} - Presenças,${subject.name} - Total,${subject.name} - %,`;
      });
      csvContent += '\n';

      students.forEach(student => {
        csvContent += `"${student.name}","${student.email}",`;
        subjects.forEach(subject => {
          const stats = attendanceData[student.id]?.[subject.id] || { present: 0, total: 0, percentage: 0 };
          csvContent += `${stats.present},${stats.total},${stats.percentage}%,`;
        });
        csvContent += '\n';
      });
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${reportType}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sucesso",
      description: "Relatório gerado e baixado com sucesso!"
    });
  };

  if (classSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum dado para relatório.</p>
        <p className="text-gray-400">Registre aulas primeiro para gerar relatórios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Gerador de Relatórios</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Relatório Resumido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Gera uma planilha com o resumo de presenças por aluno e matéria, 
              mostrando percentual de presença.
            </p>
            <Button 
              onClick={() => generateCSV('summary')} 
              className="w-full"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório Resumido
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Relatório Detalhado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Gera uma planilha com todos os registros de aula, 
              incluindo data, tópico, presença e observações.
            </p>
            <Button 
              onClick={() => generateCSV('full')} 
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório Detalhado
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview - Resumo de Presenças</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-2 text-left">Aluno</th>
                  {subjects.map(subject => (
                    <th key={subject.id} className="border border-gray-200 p-2 text-center">
                      {subject.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="border border-gray-200 p-2 font-medium">
                      {student.name}
                    </td>
                    {subjects.map(subject => {
                      const stats = attendanceData[student.id]?.[subject.id] || { present: 0, total: 0, percentage: 0 };
                      return (
                        <td key={subject.id} className="border border-gray-200 p-2 text-center">
                          {stats.total > 0 ? (
                            <div className="space-y-1">
                              <div className={`font-medium ${
                                stats.percentage >= 75 ? 'text-green-600' : 
                                stats.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {stats.percentage}%
                              </div>
                              <div className="text-xs text-gray-500">
                                {stats.present}/{stats.total}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Como usar os relatórios:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Os arquivos são baixados em formato CSV</li>
          <li>• Abra no Google Planilhas, Excel ou LibreOffice</li>
          <li>• O relatório resumido mostra percentuais de presença</li>
          <li>• O relatório detalhado lista todos os registros individuais</li>
          <li>• Cores: Verde (≥75%), Amarelo (50-74%), Vermelho (&lt;50%)</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportGenerator;
