
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import StudentManager from '@/components/StudentManager';
import SubjectManager from '@/components/SubjectManager';
import ClassRegistry from '@/components/ClassRegistry';
import AttendanceHistory from '@/components/AttendanceHistory';
import AbsenceManager from '@/components/AbsenceManager';
import ReportGenerator from '@/components/ReportGenerator';
import VisualReportGenerator from '@/components/VisualReportGenerator';

const Index = () => {
  const [activeTab, setActiveTab] = useState('students');

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
        return <StudentManager />;
      case 'subjects':
        return <SubjectManager />;
      case 'registry':
        return <ClassRegistry />;
      case 'absences':
        return <AbsenceManager />;
      case 'history':
        return <AttendanceHistory />;
      case 'reports':
        return <ReportGenerator />;
      case 'visual-reports':
        return <VisualReportGenerator />;
      default:
        return <StudentManager />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      students: 'Gerenciamento de Alunos',
      subjects: 'Gerenciamento de Matérias',
      registry: 'Registro de Aulas',
      absences: 'Controle de Faltas',
      history: 'Histórico de Presenças',
      reports: 'Relatórios do Sistema',
      'visual-reports': 'Relatórios Visuais'
    };
    return titles[activeTab as keyof typeof titles] || 'Sistema Acadêmico';
  };

  const getPageDescription = () => {
    const descriptions = {
      students: 'Cadastre e gerencie informações dos alunos',
      subjects: 'Organize e controle as matérias do curso',
      registry: 'Registre aulas e controle de presença',
      absences: 'Gerencie faltas e justificativas',
      history: 'Visualize o histórico completo de presenças',
      reports: 'Gere relatórios detalhados do sistema',
      'visual-reports': 'Crie relatórios visuais personalizados'
    };
    return descriptions[activeTab as keyof typeof descriptions] || 'Gestão acadêmica inteligente';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 glow-text">
              {getPageTitle()}
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
              {getPageDescription()}
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-white/50 to-transparent mx-auto rounded-full"></div>
          </div>

          {/* Content Card */}
          <Card className="glass-card glow-border animate-scale-in">
            <CardContent className="p-6 md:p-8">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default Index;
