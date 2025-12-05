// src/components/evaluations/EvaluationModal/EvaluationModal.tsx
import { useState } from 'react';
import type { FC } from 'react';
import { Modal, Tabs, MetricsPanel } from '@components';
import { useStudentsByEvaluation } from '@/hooks/useStudentsByEvaluation';
import TheoreticalEvaluationPanel from './components/TheoreticalPanel/TheoreticalEvaluationPanel';
import PhysicalEvaluationPanel from './components/PhysicalPanel/PhysicalEvaluationPanel';
import { useEvaluationSummary } from '@/pages/evaluations/hooks/useEvaluationSummary';
/* import { useStudentMutations } from '@/hooks/useStudentMutations';
*/import type { EvaluationResponse, StudentEvaluation } from '@/models';
import StudentsTable from './components/StudentsTable/StudentsTable'




type TabKey = 'grades' | 'evaluate' | 'others';

interface Props {
  evaluation: EvaluationResponse;
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluationModal: FC<Props> = ({ evaluation, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('grades');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ungraded' | 'graded' | 'failed' | 'passed'>('all');

  // Data hooks
  const { data: studentsdata, isLoading: studentsLoading, error: studentsError } =
    useStudentsByEvaluation(evaluation.id, isOpen, 1);

  const { data: metrics, isLoading: metricsLoading, error: metricsError } =
    useEvaluationSummary(evaluation.id);



  /* const { gradeMutation} = useStudentMutations(evaluation.evalCode) */;

  // --- FIX: studentsdata puede venir con un tipo genérico; casteamos a StudentsPage | undefined
  // studentsdata ya es StudentEvaluation[] directamente
  const students: StudentEvaluation[] = studentsdata ?? [];


  // Delegated handlers
  const handleOpenEdit = (/* student: StudentEvaluation */) => {

    // implement opening edit modal in parent or pass handler down
  };

  /*  const handleQuickGrade = (studentEvaluationId: number, grade: number) => {
     gradeMutation.mutate({ studentEvaluationId, finalGrade: grade });
   }; */

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={evaluation.name} width="normal">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Tabs
          items={[
            { key: 'grades', label: 'Calificaciones' },
            { key: 'evaluate', label: 'Evaluar' },
            { key: 'others', label: 'Otros' },
          ]}
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as TabKey)}
        />



        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Search student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />


          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="ungraded">Sin calificar</option>
            <option value="graded">calificados</option>
            <option value="failed">Desaprovados</option>
            <option value="passed">Aprovados</option>
          </select>
        </div>



        {activeTab === 'grades' && (
          <>
            {metricsLoading && <div>Cargando métricas...</div>}
            {metricsError && (
              <div style={{ color: 'red' }}>Error al cargar métricas: {metricsError.message}</div>
            )}
            {metrics && <MetricsPanel metrics={metrics} />}




            {studentsLoading && <div>Cargando alumnos...</div>}
            {studentsError && (
              <div style={{ color: 'red' }}>Error al cargar alumnos: {studentsError.message}</div>
            )}
            {!studentsLoading && !studentsError && (
              <StudentsTable students={students ?? []} onOpenEdit={handleOpenEdit} />
            )}
          </>
        )}


        {activeTab === 'evaluate' && (
          <>
            {evaluation.typeName === 'Fisica' && (
              <PhysicalEvaluationPanel
                students={students}
                evalCode={evaluation.evalCode}
                onOpenEdit={handleOpenEdit}
              />
            )}

            {evaluation.typeName === 'Teorica' && metrics && (
              <TheoreticalEvaluationPanel
                students={students}
                evalCode={evaluation.evalCode}
                onOpenEdit={handleOpenEdit}
              />
            )}
          </>
        )}


        {activeTab === 'others' && <div>Other information</div>}
      </div>
    </Modal>
  );
};

export default EvaluationModal;
