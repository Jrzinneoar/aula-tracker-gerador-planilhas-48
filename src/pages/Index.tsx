
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StudentManager from '@/components/StudentManager';
import SubjectManager from '@/components/SubjectManager';
import ClassRegistry from '@/components/ClassRegistry';
import AttendanceHistory from '@/components/AttendanceHistory';
import ReportGenerator from '@/components/ReportGenerator';
import { Users, BookOpen, Calendar, FileText, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Sistema de Controle de Presença Escolar
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerencie alunos, matérias e registre presenças de forma simples e eficiente
          </p>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-muted">
            <TabsTrigger value="students" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Users className="w-4 h-4" />
              Alunos
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2 data-[state=active]:bg-background">
              <BookOpen className="w-4 h-4" />
              Matérias
            </TabsTrigger>
            <TabsTrigger value="registry" className="flex items-center gap-2 data-[state=active]:bg-background">
              <Calendar className="w-4 h-4" />
              Registro de Aulas
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-background">
              <FileText className="w-4 h-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-background">
              <BarChart3 className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-6">
            <StudentManager />
          </TabsContent>

          <TabsContent value="subjects" className="mt-6">
            <SubjectManager />
          </TabsContent>

          <TabsContent value="registry" className="mt-6">
            <ClassRegistry />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <AttendanceHistory />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
