
-- Criar tabela específica para registro de faltas
CREATE TABLE public.absences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  absence_date DATE NOT NULL,
  reason TEXT,
  justified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remover a coluna present da tabela attendance_records pois agora será apenas para registro de aulas
ALTER TABLE public.attendance_records DROP COLUMN IF EXISTS present;

-- Habilitar RLS na nova tabela
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso público (temporário para desenvolvimento)
CREATE POLICY "Allow all operations on absences" ON public.absences FOR ALL USING (true);

-- Adicionar índices para melhor performance
CREATE INDEX idx_absences_student_date ON public.absences(student_id, absence_date);
CREATE INDEX idx_absences_subject_date ON public.absences(subject_id, absence_date);
