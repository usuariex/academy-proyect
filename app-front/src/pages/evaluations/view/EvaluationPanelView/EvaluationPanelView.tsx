
import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { Modal } from '@/components/modals';
import { MetricsPanel } from '@/components/data-display';
import { Tabs } from '@/components/layout';
import { useStudentsByEvaluation } from '@/hooks/students';
import type { StudentEvaluation } from '@/models/student';
import type { Evaluation, StatusGrade, } from '@/models/evaluation';
import { classifyGradeStatus } from '@/utilities/evaluation';
import { SearchInput, SelectField } from '@/components/forms';
import styles from './EvaluationPanelView.module.css';
import { useEvaluationSummary } from '@evaluations/hooks';

import { PhysicalEvaluationPanel, TheoreticalEvaluationPanel } from '@evaluations/view';
import { StudentsByEvaluationTable } from '@evaluations/components';
import { FilterChips } from '@/components/ui';
import { buildFilterChips } from '@/utilities';


type TabKey = 'grades' | 'evaluate' | 'others';

interface Props {
  evaluation: Evaluation;
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluationPanelView: FC<Props> = ({ evaluation, isOpen, onClose }) => {

  const [activeTab, setActiveTab] = useState<TabKey>('grades');

  const [resultFilter, setResultFilter] = useState<'Todos' | StatusGrade>('Todos');
  const [gradedFilter, setGradedFilter] = useState<'Todos' | 'Calificado' | 'No calificado'>('Todos');


  const [search, setSearch] = useState('');



  // Data hooks
  const { data, isLoading: studentsLoading, error: studentsError/* , refetch  */ } = useStudentsByEvaluation(evaluation.code, 1, 20);
  const students = data?.assigned ?? [];



  // Filtrado memoizado
  const filteredStudents = useMemo(() => {
    return students.filter((s: StudentEvaluation) => {
      const normalized = classifyGradeStatus(
        s.status ?? (s.grade == null ? 'Sin calificar' : 'Desaprobado')
      );

      // Resultado
      if (resultFilter !== 'Todos' && normalized !== resultFilter) return false;

      // Calificado / Sin calificar
      const isGraded = s.grade !== null && s.grade !== undefined;
      if (gradedFilter === 'Calificado' && !isGraded) return false;
      if (gradedFilter === 'No calificado' && isGraded) return false;

      // Búsqueda
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const name = (s.studentFullName ?? '').toLowerCase();
        const uuid = (s.studentUuid ?? '').toLowerCase();
        if (!name.includes(q) && !uuid.includes(q)) return false;
      }

      return true;
    });
  }, [students, resultFilter, gradedFilter, search]);




  const resultOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Aprobado', label: 'Aprobado' },
    { value: 'Desaprobado', label: 'Desaprobado' },
    { value: 'Sin calificar', label: 'Sin calificar' },
    { value: 'Desconocido', label: 'Desconocido' },
  ];

  const gradedOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Calificado', label: 'Calificado' },
    { value: 'No calificado', label: 'No calificado' },
  ];




  const chips = buildFilterChips([
    {
      active: resultFilter !== "Todos",
      label: `Estado: ${resultFilter}`,
      onRemove: () => setResultFilter("Todos"),
    },
    {
      active: gradedFilter !== "Todos",
      label: `Tipo: ${gradedFilter}`,
      onRemove: () => setGradedFilter("Todos"),
    },
    {
      active: !!search,
      label: `Código contiene "${search}"`,
      onRemove: () => setSearch(""),
    },
  ]);



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



        <div className={styles.section__filters}>
          <SearchInput
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            onSubmit={handleSearchSubmit}
            placeholder="Search student"
            className={styles.searchInput__custom}
          />


          <div className={styles.filters__selects}>
            <SelectField
              id="result"
              label="Resultado"
              value={resultFilter}
              options={resultOptions}
              onChange={(e) =>
                setResultFilter(e.target.value as 'Todos' | 'Aprobado' | 'Desaprobado' | 'Sin calificar')}
            />

            <SelectField
              id="graded"
              label="Estado de calificación"
              value={gradedFilter}
              options={gradedOptions}
              onChange={(e) =>
                setGradedFilter(e.target.value as 'Todos' | 'Calificado' | 'No calificado')}
            />
          </div>
        </div>


        <div className={styles.activeChips}>
          <FilterChips chips={chips} />
        </div>


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
                students={filteredStudents}
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

