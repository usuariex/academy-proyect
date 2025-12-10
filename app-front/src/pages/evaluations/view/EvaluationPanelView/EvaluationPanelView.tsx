
import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Modal } from '@/components/modals';
import { MetricsPanel } from '@/components/data-display';
import { Tabs } from '@/components/layout';
import { useStudentsByEvaluation } from '@/hooks/students';
import type { StudentEvaluation } from '@/models/student';
import type { Evaluation, StatusGrade, } from '@/models/evaluation';
import type { SelectOption } from '@/models/ui';
import { classifyGradeStatus } from '@/utilities/evaluation';
import { SearchInput, SelectField } from '@/components/forms';
import styles from './EvaluationPanelView.module.css';
import { useEvaluationSummary } from '@evaluations/hooks';

import { PhysicalEvaluationPanel, TheoreticalEvaluationPanel } from '@evaluations/view';
import { StudentsByEvaluationTable } from '@evaluations/components';


type TabKey = 'grades' | 'evaluate' | 'others';

interface Props {
  evaluation: Evaluation;
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluationPanelView: FC<Props> = ({ evaluation, isOpen, onClose }) => {

  const [activeTab, setActiveTab] = useState<TabKey>('grades');

  const [resultFilter, setResultFilter] = useState<'all' | StatusGrade>('all');
  const [gradedFilter, setGradedFilter] = useState<'all' | 'graded' | 'not_graded'>('all');
  const [search, setSearch] = useState('');

  // Data hooks
  const { data, isLoading: studentsLoading, error: studentsError/* , refetch  */ } = useStudentsByEvaluation(evaluation.code, 1, 20);
  const students = data?.items ?? [];



  // Filtrado memoizado
  const filteredStudents = useMemo(() => {
    return students.filter((s: StudentEvaluation) => {
      const normalized = classifyGradeStatus(s.status ?? (s.grade == null ? 'Sin calificar' : 'Desaprobado'));

      // Resultado (approved/failed/ungraded)
      if (resultFilter !== 'all' && normalized !== resultFilter) return false;

      // Calificado / Sin calificar
      const isGraded = s.grade !== null && s.grade !== undefined;
      if (gradedFilter === 'graded' && !isGraded) return false;
      if (gradedFilter === 'not_graded' && isGraded) return false;

      // Búsqueda por nombre o uuid (opcional)
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const name = (s.studentFullName ?? '').toLowerCase();
        const uuid = (s.studentUuid ?? '').toLowerCase();
        if (!name.includes(q) && !uuid.includes(q)) return false;
      }

      return true;
    });
  }, [students, resultFilter, gradedFilter, search]);



  const resultOptions: SelectOption[] = [
    { label: 'Todos los resultados', value: 'all' },
    { label: 'Aprobados', value: 'approved' },
    { label: 'Desaprobados', value: 'failed' },
    { label: 'Sin calificar', value: 'ungraded' },
  ];

  const gradedOptions: SelectOption[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Calificados', value: 'graded' },
    { label: 'Sin calificar', value: 'not_graded' },
  ];


  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useEvaluationSummary(evaluation.code);


  const handleOpenEdit = () => {
  };

  const handleSearchSubmit = () => {
    //petición al servidor
  };


  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.header}>
        <h4 className={styles.title}>
          {evaluation.name}
        </h4>
        <div className={styles.meta}>
          <span className={styles.type}>{evaluation.name}</span>
          {evaluation.plannedDate && (
            <time className={styles.date} dateTime={evaluation.plannedDate}>
              {evaluation.plannedDate}
            </time>
          )}
          <span className={styles.status}>{evaluation.statusName}</span>
        </div>
      </header>

      <div className={styles.container}>
        <Tabs
          items={[
            { key: 'grades', label: 'Calificaciones' },
            { key: 'evaluate', label: 'Evaluar' },
            { key: 'others', label: 'Otros' },
          ]}
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as TabKey)}
        />

        {activeTab === 'grades' && (
          <>
            {metricsLoading && <div>Cargando métricas...</div>}
            {metricsError && (
              <div style={{ color: 'red' }}>Error al cargar métricas: {metricsError.message}</div>)}


            {metrics &&
              <MetricsPanel
                metrics={metrics} />}
          </>
        )}


        {activeTab === 'grades' && (
          <div className={styles.section__filters}>
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              onSubmit={handleSearchSubmit}
              placeholder="Search student"
            />


            <div className={styles.filters__selects}>
              <SelectField
                id="result"
                label="Resultado"
                value={resultFilter}
                options={resultOptions}
                onChange={(e) => setResultFilter(e.target.value as 'all' | StatusGrade)}
              />

              <SelectField
                id="graded"
                label="Estado de calificación"
                value={gradedFilter}
                options={gradedOptions}
                onChange={(e) => setGradedFilter(e.target.value as 'all' | 'graded' | 'not_graded')}
              />
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <>
            {studentsLoading && <div>Cargando alumnos...</div>}
            {studentsError && (
              <div style={{ color: 'red' }}>Error al cargar alumnos: {studentsError.message}</div>
            )}



            {!studentsLoading && !studentsError && (
              <StudentsByEvaluationTable students={filteredStudents ?? []} onOpenEdit={handleOpenEdit} />
            )}
          </>
        )}


        {activeTab === 'evaluate' && (
          <>
            {evaluation.typeName === 'Fisica' && (
              <PhysicalEvaluationPanel
                students={students}
                evalCode={evaluation.code}
                onOpenEdit={handleOpenEdit}
              />
            )}

            {evaluation.typeName === 'Teorica' && metrics && (
              <TheoreticalEvaluationPanel
                students={students}
              /*  evaluationCode={evaluation.code} */
              />
            )}
          </>
        )}


        {activeTab === 'others' && <div>Other information</div>}
      </div>
    </Modal>
  );
};

