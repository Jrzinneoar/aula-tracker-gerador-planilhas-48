
import React, { useState } from 'react';
import { Menu, X, Users, BookOpen, Calendar, FileText, UserX, BarChart3, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'subjects', label: 'Matérias', icon: BookOpen },
    { id: 'registry', label: 'Aulas', icon: Calendar },
    { id: 'absences', label: 'Faltas', icon: UserX },
    { id: 'history', label: 'Histórico', icon: FileText },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'visual-reports', label: 'Rel. Visuais', icon: FileImage },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white glow-text">
                  Sistema Acadêmico
                </h1>
                <p className="text-xs text-white/60">Gestão Inteligente</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onTabChange(item.id)}
                    className={`
                      brush-effect relative px-4 py-2 rounded-lg transition-all duration-300
                      ${isActive 
                        ? 'bg-white/15 text-white glow-border' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white glow-text">
                  Sistema Acadêmico
                </h1>
                <p className="text-xs text-white/60">Gestão Inteligente</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-white/10 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 glass-card border-t border-white/10">
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      mobile-nav-item flex items-center space-x-3 animate-slide-in-right
                      ${isActive 
                        ? 'bg-white/15 text-white glow-border' 
                        : 'text-white/70 hover:text-white'
                      }
                    `}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Background Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
