
-- Modificar a tabela de faltas para remover a obrigatoriedade da matéria
-- e permitir registro de faltas por dia
ALTER TABLE absences 
ALTER COLUMN subject_id DROP NOT NULL;

-- Adicionar comentário para esclarecer que subject_id agora é opcional
COMMENT ON COLUMN absences.subject_id IS 'Optional - can be null for general daily absences';
