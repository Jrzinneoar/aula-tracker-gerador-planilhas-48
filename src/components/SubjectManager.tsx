
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Subject } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const SubjectManager = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher: ''
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar matérias:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar matérias",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.teacher.trim()) {
      toast({
        title: "Erro",
        description: "Nome da matéria e professor são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (editingSubject) {
        const { error } = await supabase
          .from('subjects')
          .update(formData)
          .eq('id', editingSubject.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Matéria atualizada com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('subjects')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Matéria cadastrada com sucesso!"
        });
      }

      resetForm();
      fetchSubjects();
    } catch (error) {
      console.error('Erro ao salvar matéria:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar matéria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', teacher: '' });
    setEditingSubject(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || '',
      teacher: subject.teacher
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Matéria removida com sucesso!"
      });
      
      fetchSubjects();
    } catch (error) {
      console.error('Erro ao deletar matéria:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover matéria",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Gestão de Matérias</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Nova Matéria
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">
                {editingSubject ? 'Editar Matéria' : 'Nova Matéria'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-card-foreground">Nome da Matéria</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Matemática, Português..."
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="teacher" className="text-card-foreground">Professor</Label>
                <Input
                  id="teacher"
                  value={formData.teacher}
                  onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                  placeholder="Nome do professor"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-card-foreground">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da matéria (opcional)"
                  rows={3}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Salvando...' : (editingSubject ? 'Atualizar' : 'Cadastrar')}
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
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Professor: {subject.teacher}</p>
              {subject.description && (
                <p className="text-sm text-muted-foreground">{subject.description}</p>
              )}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(subject)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(subject.id)}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Nenhuma matéria cadastrada ainda.</p>
          <p className="text-muted-foreground">Clique em "Nova Matéria" para começar.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectManager;
