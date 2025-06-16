
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Student, Subject, ClassSession, AttendanceRecord } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

const ClassRegistry = () => {
  const [students] = useLocalStorage<Student[]>('students', []);
  const [subjects] = useLocalStorage<Subject[]>('subjects', []);
  const [classSessions, setClassSessions] = useLocalStorage<ClassSession[]>('classSessions', []);
  
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [classDate, setClassDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [classTopic, setClassTopic] = useState<string>('');
  const [attendance, setAttendance] = useState<Record<string, { present: boolean; notes: string }>>({});

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    // Reset attendance when changing subject
    const newAttendance: Record<string, { present: boolean; notes: string }> = {};
    students.forEach(student => {
      newAttendance[student.id] = { present: true, notes: '' };
    });
    setAttendance(newAttendance);
  };

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        present
      }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    const attendanceRecords: AttendanceRecord[] = Object.entries(attendance).map(([studentId, data]) => ({
      id: `${Date.now()}-${studentId}`,
      studentId,
      subjectId: selectedSubject,
      date: new Date(classDate),
      present: data.present,
      notes: data.notes
    }));

    const newClassSession: ClassSession = {
      id: Date.now().toString(),
      subjectId: selectedSubject,
      date: new Date(classDate),
      topic: classTopic,
      attendanceRecords,
      createdAt: new Date()
    };

    setClassSessions(prev => [...prev, newClassSession]);

    // Reset form
    setClassTopic('');
    setClassDate(new Date().toISOString().split('T')[0]);
    const newAttendance: Record<string, { present: boolean; notes: string }> = {};
    students.forEach(student => {
      newAttendance[student.id] = { present: true, notes: '' };
    });
    setAttendance(newAttendance);

    toast({
      title: "Sucesso",
      description: "Registro de aula salvo com sucesso!"
    });
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum aluno cadastrado.</p>
        <p className="text-gray-400">Cadastre alunos primeiro na aba "Alunos".</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma matéria cadastrada.</p>
        <p className="text-gray-400">Cadastre matérias primeiro na aba "Matérias".</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Registro de Aulas</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Nova Aula
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="subject">Matéria</Label>
                <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Data da Aula</Label>
                <Input
                  id="date"
                  type="date"
                  value={classDate}
                  onChange={(e) => setClassDate(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="topic">Tópico da Aula</Label>
                <Input
                  id="topic"
                  value={classTopic}
                  onChange={(e) => setClassTopic(e.target.value)}
                  placeholder="Ex: Equações do 2º grau"
                />
              </div>
            </div>

            {selectedSubject && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lista de Presença</h3>
                
                <div className="grid gap-4">
                  {students.map((student) => (
                    <Card key={student.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center space-x-2 mt-1">
                          <Checkbox
                            id={`present-${student.id}`}
                            checked={attendance[student.id]?.present ?? true}
                            onCheckedChange={(checked) => 
                              handleAttendanceChange(student.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`present-${student.id}`}
                            className="font-medium"
                          >
                            Presente
                          </Label>
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                        
                        <div className="flex-1">
                          <Label htmlFor={`notes-${student.id}`} className="text-sm">
                            Observações
                          </Label>
                          <Input
                            id={`notes-${student.id}`}
                            value={attendance[student.id]?.notes ?? ''}
                            onChange={(e) => handleNotesChange(student.id, e.target.value)}
                            placeholder="Observações sobre o aluno..."
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedSubject && (
              <Button type="submit" className="w-full" size="lg">
                Salvar Registro de Aula
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassRegistry;
