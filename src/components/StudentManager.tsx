
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Student } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const StudentManager = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alunos",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do aluno é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (editingStudent) {
        const { error } = await supabase
          .from('students')
          .update(formData)
          .eq('id', editingStudent.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Aluno atualizado com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('students')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Aluno cadastrado com sucesso!"
        });
      }

      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar aluno",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setEditingStudent(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email || '',
      phone: student.phone || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aluno removido com sucesso!"
      });
      
      fetchStudents();
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover aluno",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Gestão de Alunos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">
                {editingStudent ? 'Editar Aluno' : 'Novo Aluno'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-card-foreground">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo do aluno"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-card-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-card-foreground">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Salvando...' : (editingStudent ? 'Atualizar' : 'Cadastrar')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">{student.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {student.email && <p className="text-sm text-muted-foreground">{student.email}</p>}
              {student.phone && <p className="text-sm text-muted-foreground">{student.phone}</p>}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(student)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(student.id)}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Nenhum aluno cadastrado ainda.</p>
          <p className="text-muted-foreground">Clique em "Novo Aluno" para começar.</p>
        </div>
      )}
    </div>
  );
};

export default StudentManager;
