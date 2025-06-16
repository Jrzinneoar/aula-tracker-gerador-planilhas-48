
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Calendar, UserX, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AbsenceManager = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [absenceDate, setAbsenceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState<string>('');
  const [justified, setJustified] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Student[];
    }
  });

  const { data: absences = [], refetch: refetchAbsences } = useQuery({
    queryKey: ['absences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('absences')
        .select(`
          *,
          student:students(*),
          subject:subjects(*)
        `)
        .order('absence_date', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent) {
      toast({
        title: "Erro",
        description: "Selecione um aluno",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('absences')
        .insert([{
          student_id: selectedStudent,
          subject_id: null, // Faltas agora são por dia, não por matéria
          absence_date: absenceDate,
          reason: reason.trim() || null,
          justified
        }]);

      if (error) throw error;

      // Reset form
      setSelectedStudent('');
      setAbsenceDate(new Date().toISOString().split('T')[0]);
      setReason('');
      setJustified(false);
      
      refetchAbsences();

      toast({
        title: "Sucesso",
        description: "Falta registrada com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao registrar falta:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar falta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAbsence = async (absenceId: string) => {
    try {
      const { error } = await supabase
        .from('absences')
        .delete()
        .eq('id', absenceId);

      if (error) throw error;

      refetchAbsences();

      toast({
        title: "Sucesso",
        description: "Falta removida com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao remover falta:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover falta",
        variant: "destructive"
      });
    }
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-red-50 to-rose-100 rounded-lg">
        <div className="max-w-md mx-auto">
          <UserX className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-800 text-lg font-semibold mb-2">Nenhum aluno cadastrado</p>
          <p className="text-red-600">Cadastre alunos primeiro na aba "Alunos".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Gestão de Faltas Diárias</h2>
        <p className="text-muted-foreground">Registre faltas dos alunos por dia</p>
      </div>
      
      <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <UserX className="w-5 h-5" />
            Registrar Falta do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student" className="text-red-700 font-medium">Aluno</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="bg-white border-red-200 focus:border-red-400">
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-red-200">
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date" className="text-red-700 font-medium">Data da Falta</Label>
                <Input
                  id="date"
                  type="date"
                  value={absenceDate}
                  onChange={(e) => setAbsenceDate(e.target.value)}
                  className="bg-white border-red-200 focus:border-red-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason" className="text-red-700 font-medium">Motivo da Falta (Opcional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o motivo da falta..."
                rows={3}
                className="bg-white border-red-200 focus:border-red-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="justified"
                checked={justified}
                onCheckedChange={(checked) => setJustified(checked as boolean)}
              />
              <Label htmlFor="justified" className="text-red-700 font-medium">
                Falta justificada
              </Label>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Falta'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">Faltas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {absences.length === 0 ? (
            <div className="text-center py-8">
              <UserX className="w-12 h-12 text-red-300 mx-auto mb-4" />
              <p className="text-red-600">Nenhuma falta registrada.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {absences.map((absence: any) => (
                <div key={absence.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200 shadow-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-800">
                        {format(new Date(absence.absence_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                      <Badge variant={absence.justified ? "default" : "destructive"}>
                        {absence.justified ? 'Justificada' : 'Não Justificada'}
                      </Badge>
                    </div>
                    <p className="text-red-800 font-medium text-lg">{absence.student?.name}</p>
                    {absence.reason && (
                      <p className="text-sm text-red-600 mt-1">
                        <strong>Motivo:</strong> {absence.reason}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAbsence(absence.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AbsenceManager;
