
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StudentManager from '@/components/StudentManager';
import SubjectManager from '@/components/SubjectManager';
import ClassRegistry from '@/components/ClassRegistry';
import AttendanceHistory from '@/components/AttendanceHistory';
import AbsenceManager from '@/components/AbsenceManager';
import ReportGenerator from '@/components/ReportGenerator';
import VisualReportGenerator from '@/components/VisualReportGenerator';
import { Users, BookOpen, Calendar, FileText, UserX, BarChart3, FileImage } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Desenvolvimento de Sistemas
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerencie alunos, matérias, registre aulas e controle faltas de forma simples e eficiente
          </p>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-white/70 backdrop-blur-sm border border-blue-200">
            <TabsTrigger value="students" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Users className="w-4 h-4" />
              Alunos
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <BookOpen className="w-4 h-4" />
              Matérias
            </TabsTrigger>
            <TabsTrigger value="registry" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Calendar className="w-4 h-4" />
              Aulas
            </TabsTrigger>
            <TabsTrigger value="absences" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <UserX className="w-4 h-4" />
              Faltas
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <FileText className="w-4 h-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <BarChart3 className="w-4 h-4" />
              Relatório Diário
            </TabsTrigger>
            <TabsTrigger value="visual-reports" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <FileImage className="w-4 h-4" />
              Rel. Visuais
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

          <TabsContent value="absences" className="mt-6">
            <AbsenceManager />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <AttendanceHistory />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportGenerator />
          </TabsContent>

          <TabsContent value="visual-reports" className="mt-6">
            <VisualReportGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
