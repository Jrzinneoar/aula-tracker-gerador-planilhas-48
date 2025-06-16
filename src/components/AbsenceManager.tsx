
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Student, Subject, Absence } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Calendar, UserX, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AbsenceManager = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
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

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Subject[];
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

    if (!selectedStudent || !selectedSubject) {
      toast({
        title: "Erro",
        description: "Selecione um aluno e uma matéria",
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
          subject_id: selectedSubject,
          absence_date: absenceDate,
          reason: reason.trim() || null,
          justified
        }]);

      if (error) throw error;

      // Reset form
      setSelectedStudent('');
      setSelectedSubject('');
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
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Nenhum aluno cadastrado.</p>
        <p className="text-muted-foreground">Cadastre alunos primeiro na aba "Alunos".</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Nenhuma matéria cadastrada.</p>
        <p className="text-muted-foreground">Cadastre matérias primeiro na aba "Matérias".</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Gestão de Faltas</h2>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <UserX className="w-5 h-5" />
            Registrar Falta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student" className="text-card-foreground">Aluno</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id} className="text-popover-foreground">
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="subject" className="text-card-foreground">Matéria</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id} className="text-popover-foreground">
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="date" className="text-card-foreground">Data da Falta</Label>
              <Input
                id="date"
                type="date"
                value={absenceDate}
                onChange={(e) => setAbsenceDate(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="reason" className="text-card-foreground">Motivo da Falta</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o motivo da falta..."
                rows={3}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="justified"
                checked={justified}
                onCheckedChange={(checked) => setJustified(checked as boolean)}
              />
              <Label htmlFor="justified" className="text-card-foreground">
                Falta justificada
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Falta'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Faltas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {absences.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma falta registrada.</p>
          ) : (
            <div className="space-y-4">
              {absences.map((absence: any) => (
                <div key={absence.id} className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {format(new Date(absence.absence_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                      <Badge variant={absence.justified ? "default" : "destructive"}>
                        {absence.justified ? 'Justificada' : 'Não Justificada'}
                      </Badge>
                    </div>
                    <p className="text-foreground font-medium">{absence.student?.name}</p>
                    <p className="text-sm text-muted-foreground">{absence.subject?.name}</p>
                    {absence.reason && (
                      <p className="text-sm text-muted-foreground mt-1">
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
