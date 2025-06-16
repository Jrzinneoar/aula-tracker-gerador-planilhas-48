
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student, Subject } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

const ClassRegistry = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [classDate, setClassDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [classTopic, setClassTopic] = useState<string>('');
  const [classNotes, setClassNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar matérias:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSubject) {
      toast({
        title: "Erro",
        description: "Selecione uma matéria",
        variant: "destructive"
      });
      return;
    }

    if (!classTopic.trim()) {
      toast({
        title: "Erro",
        description: "Informe o tópico da aula",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Criar sessão de aula
      const { data: classSession, error: classError } = await supabase
        .from('class_sessions')
        .insert([{
          subject_id: selectedSubject,
          date: classDate,
          topic: classTopic,
          notes: classNotes
        }])
        .select()
        .single();

      if (classError) throw classError;

      // Criar registros de participação para todos os alunos (apenas para registro)
      const attendanceRecords = students.map(student => ({
        class_session_id: classSession.id,
        student_id: student.id,
        notes: '' // Apenas para registro de participação
      }));

      const { error: attendanceError } = await supabase
        .from('attendance_records')
        .insert(attendanceRecords);

      if (attendanceError) throw attendanceError;

      // Reset form
      setClassTopic('');
      setClassNotes('');
      setClassDate(new Date().toISOString().split('T')[0]);

      toast({
        title: "Sucesso",
        description: "Registro de aula salvo com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar registro de aula",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
      <h2 className="text-2xl font-bold text-foreground">Registro de Aulas</h2>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Calendar className="w-5 h-5" />
            Nova Aula
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div>
                <Label htmlFor="date" className="text-card-foreground">Data da Aula</Label>
                <Input
                  id="date"
                  type="date"
                  value={classDate}
                  onChange={(e) => setClassDate(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="topic" className="text-card-foreground">Tópico da Aula</Label>
              <Input
                id="topic"
                value={classTopic}
                onChange={(e) => setClassTopic(e.target.value)}
                placeholder="Ex: Equações do 2º grau"
                className="bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-card-foreground">Observações da Aula</Label>
              <Textarea
                id="notes"
                value={classNotes}
                onChange={(e) => setClassNotes(e.target.value)}
                placeholder="Descreva o que aconteceu na aula, exercícios aplicados, etc..."
                rows={4}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Nota:</strong> Este formulário é apenas para registrar o que aconteceu na aula. 
                Para registrar faltas, utilize a aba "Gestão de Faltas".
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Registro de Aula'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassRegistry;
