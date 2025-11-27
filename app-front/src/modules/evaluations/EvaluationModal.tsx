import { useState, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import api from '../../api/axiosConfig';
import type { EvaluationResponse, StudentEvaluation } from '../../types/';
import { getStudentsByEvaluation, searchStudentsByEvaluation } from '../../api/';
import { removeAccents } from '../../utils/Text';
import { ActionButton } from '../../components/buttons/ActionButton';
import './EvaluationModal.css';
import { SearchInput } from '../../components/search/SearchInput'

interface EvaluationModalProps {
  evaluation: EvaluationResponse;
  onClose: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ evaluation, onClose }) => {
  const queryClient = useQueryClient();

  // 🔹 Estados básicos
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ungraded' | 'graded' | 'failed' | 'passed'>('all');
  const [activeTab, setActiveTab] = useState<'grades' | 'others' | 'evaluate'>('grades');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // 🔹 Estado para acumular todas las páginas cargadas automáticamente
  const [allStudents, setAllStudents] = useState<StudentEvaluation[]>([]);
  const [page, setPage] = useState(1);

  // 🔹 Carga inicial automática en bloques de 100 cada 3 segundos
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;

    const fetchPage = async (p: number) => {
      try {
        const { results, next } = await getStudentsByEvaluation(evaluation.id, p, 20);

        // siempre actualiza allStudents
        setAllStudents(prev => {
          const ids = new Set(prev.map(s => s.studentEvaluationId));
          const nuevos = results.filter(s => !ids.has(s.studentEvaluationId));
          return [...prev, ...nuevos];
        });

        if (results.length === 0 || !next) {
          clearInterval(interval);
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Error al traer alumnos:", err);
      }
    };


    fetchPage(1);

    interval = setInterval(() => {
      setPage(prev => {
        const next = prev + 1;
        fetchPage(next);
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [evaluation.id]);










  // 🔹 Normalizador de texto (acentos, espacios, minúsculas)
  const normalize = (str: string) =>
    removeAccents(str.toLowerCase().trim().replace(/\s+/g, ' '));

  // 🔹 Tokens de búsqueda
  const searchTokens = normalize(search).split(' ').filter(Boolean);

  // 🔹 Coincidencia por tokens en cualquier parte de las palabras
  const matchesAnywhere = (fullName: string, tokens: string[]) => {
    if (tokens.length === 0) return true; // sin búsqueda => todos
    const nameTokens = normalize(fullName).split(' ').filter(Boolean);
    // cada token debe aparecer en alguna palabra del nombre (prefijo o dentro)
    return tokens.every(token =>
      nameTokens.some(nameWord => nameWord.includes(token))
    );
  };

  // 🔹 Query al servidor: solo cuando el último token tiene "contenido"
  //    - Evita llamar al backend justo al escribir un espacio
  const lastToken = searchTokens[searchTokens.length - 1] ?? '';
  const shouldQueryServer = searchTokens.length > 0 && lastToken.length >= 2;



  // 🔹 Query de búsqueda (solo se activa si hay texto)
  const { data: searchedStudents, isError, error } = useQuery<StudentEvaluation[]>({
    queryKey: ['searchStudents', evaluation.id, search, filter],
    queryFn: () => searchStudentsByEvaluation(evaluation.id, search, filter),
    enabled: shouldQueryServer,
  });






  // 🔹 Búsqueda inmediata con debounce (sin invalidar cuando termina en espacio)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      // Evita invalidar si termina en espacio: el filtro local ya cubre ese caso
      const endsWithSpace = /\s$/.test(value);
      if (!endsWithSpace && value.trim() !== '' && lastToken.length >= 2) {
        queryClient.invalidateQueries({
          queryKey: ['searchStudents', evaluation.id, normalize(value), filter],
        });
      }
    }, 400);

    setTypingTimeout(timeout);
  };

  // 🔹 Data efectiva: filtrar SIEMPRE en cliente sobre allStudents
  //     - Opcional: si el servidor devuelve resultados, los puedes fusionar/usar para ampliar
  const baseStudents = allStudents;
  // Si quieres fusionar resultados del server para ampliar el universo:
  const mergedStudents = searchedStudents
    ? [
      ...baseStudents,
      ...searchedStudents.filter(
        s => !baseStudents.some(b => b.studentEvaluationId === s.studentEvaluationId)
      ),
    ]
    : baseStudents;

  // 🔹 Filtrado final (maneja espacios, acentos y coincidencias dentro de palabras)
  const filteredStudents = mergedStudents.filter(s => {
    const matchesSearch = matchesAnywhere(s.fullName, searchTokens);

    if (filter === 'ungraded') return matchesSearch && s.finalGrade === null;
    if (filter === 'graded') return matchesSearch && s.finalGrade !== null;
    if (filter === 'failed') return matchesSearch && s.finalGrade !== null && s.finalGrade < 11;
    if (filter === 'passed') return matchesSearch && s.finalGrade !== null && s.finalGrade >= 11;
    return matchesSearch;
  });



  // 🔹 Botón o Enter para búsqueda inmediata (usa texto normalizado)
  /* const handleSearchSubmit = () => {
    if (search.trim() === '') return;
    queryClient.invalidateQueries({
      queryKey: ['searchStudents', evaluation.id, normalize(search), filter],
    });
  };
   */




  // 🔹 Métricas SIEMPRE sobre toda la data acumulada
  const ungraded = allStudents.filter(s => s.finalGrade === null).length;
  const graded = allStudents.filter(s => s.finalGrade !== null).length;
  const failed = allStudents.filter(s => s.finalGrade !== null && s.finalGrade < 11).length;
  const passed = allStudents.filter(s => s.finalGrade !== null && s.finalGrade >= 11).length;




  // 🔹 Mutations para editar y calificar
  const editGradeMutation = useMutation({
    mutationFn: async ({ studentEvaluationId, newGrade }: { studentEvaluationId: number; newGrade: number }) =>
      api.put(`students/${studentEvaluationId}/`, { finalGrade: newGrade }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentsByEvaluation', evaluation.id] });
    },
  });

  const gradeMutation = useMutation({
    mutationFn: async ({ studentEvaluationId, grade }: { studentEvaluationId: number; grade: number }) =>
      api.post(`/alumnos/${studentEvaluationId}/calificaciones`, { finalGrade: grade }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentsByEvaluation', evaluation.id] });
    },
  });


  
  const calculateGradeFromSheets = (sheets: number): number => {
    const grade = (sheets / 50) * 15;
    return Math.min(Math.round(grade * 100) / 100, 20);
  };

  const handleEditGrade = (studentEvaluationId: number, newGrade: number) => {
    editGradeMutation.mutate({ studentEvaluationId, newGrade });
  };

  const handleGrade = (studentEvaluationId: number, grade: number) => {
    gradeMutation.mutate({ studentEvaluationId, grade });
    setIsTyping(false);
  };

  const openEditModal = (studentEvaluationId: number) => {
    console.log("Abrir modal de edición para:", studentEvaluationId);
  };


  // ✅ Feedback de carga inicial
  if (allStudents.length === 0 && page === 1) {
    return (
      <div className="modal">
        <div className="modal-content">
          <p>⏳ Cargando alumnos...</p>
        </div>
      </div>
    );
  }

  // ✅ Feedback de error en búsqueda
  if (isError) {
    return (
      <div className="modal">
        <div className="modal-content-eval">
          <p>❌ Error al buscar alumnos: {String(error)}</p>
        </div>
      </div>
    );
  }



  return (


    <div className="modal">
      <div className="modal-content-eval">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3>Evaluación de alumnos: {evaluation.description}</h3> {/* 👈 texto visible en español */}

        {/* Metrics */}
        <div className="metrics">
          <div className="ungraded">
            <span className="icon">📝</span>
            <span>Sin calificar</span>
            <strong>{ungraded}</strong>
          </div>
          <div className="graded">
            <span className="icon">✅</span>
            <span>Calificados</span>
            <strong>{graded}</strong>
          </div>
          <div className="failed">
            <span className="icon">❌</span>
            <span>Desaprobados</span>
            <strong>{failed}</strong>
          </div>
          <div className="passed">
            <span className="icon">🎉</span>
            <span>Aprobados</span>
            <strong>{passed}</strong>
          </div>
        </div>


        {/* Controls */}
        <div className="controls">
          <div className="controls__search">
            <SearchInput
              value={search}
              onChange={(val) => handleSearchChange({ target: { value: val } } as any)} 
              onClear={() => {
                setSearch('');
                queryClient.invalidateQueries({
                  queryKey: ['searchStudents', evaluation.id, '', filter],
                });
              }}
              onSubmit={() => {
                queryClient.invalidateQueries({
                  queryKey: ['searchStudents', evaluation.id, search, filter],
                });
              }}
              placeholder="Ingresar nombre"
            />
          </div>




          <div className="controls__filter">
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="all">Todos</option>
              <option value="ungraded">Sin calificar</option>
              <option value="graded">Calificados</option>
              <option value="failed">Desaprobados</option>
              <option value="passed">Aprobados</option>
            </select>
          </div>
        </div>


        {/* Tabs */}
        <div className="tabs">
          <span className={activeTab === 'grades' ? 'active' : ''} onClick={() => setActiveTab('grades')}>
            Calificaciones
          </span>
          <span className={activeTab === 'evaluate' ? 'active' : ''} onClick={() => setActiveTab('evaluate')}>
            Evaluar
          </span>
          <span className={activeTab === 'others' ? 'active' : ''} onClick={() => setActiveTab('others')}>
            Otros
          </span>
        </div>
        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div className='grades'>
            <table className="grades__table table">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Calificación</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.studentEvaluationId}>
                    <td>{s.fullName}</td>
                    <td>{s.finalGrade ?? '---'}</td>
                    <td>
                      <span className={`status ${s.status?.toString().toLowerCase()}`}>
                        {s.status ?? 'Sin estado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grades__aside">
              <h4>📘 Detalles de la evaluación</h4>
              <ul>
                <li><span className="icon">📝</span> {evaluation.description}</li>
                <li><span className="icon">📅</span> {evaluation.plannedDate}</li>
                <li><span className="icon">🏷️</span> {evaluation.typeName}</li>
                <li><span className="icon">⚡</span> {evaluation.statusName}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Evaluate Tab */}
        {activeTab === 'evaluate' && (
          <div className='evaluate'>
            <table className="evaluate__table table">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Estado</th>
                  <th>Calificación</th>
                  <th>Planchas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.studentEvaluationId}>
                    <td>{s.fullName}</td>
                    <td>
                      <span className={`status ${s.status?.toString().toLowerCase()}`}>
                        {s.status ?? 'Sin estado'}
                      </span>
                    </td>
                    <td>{s.finalGrade}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        placeholder="Ej. 50"
                        onChange={(e) => {
                          const sheets = parseInt(e.target.value);
                          const grade = calculateGradeFromSheets(sheets);

                          // validamos rango (ejemplo: entre 0 y 20)
                          if (grade >= 0 && grade <= 20) {
                            handleEditGrade(s.studentEvaluationId, grade);
                            setIsTyping(true);
                          } else {
                            setIsTyping(false);
                          }
                        }}
                      />
                    </td>
                    <td>
                      <div className="grade__action">
                        {s.status === 'ungraded' ? (
                          <ActionButton
                            type="save"
                            onClick={() => handleGrade(s.studentEvaluationId, s.finalGrade ?? 0)}
                            disabled={!isTyping} // 🔑 deshabilitado si no está escribiendo o nota inválida
                          />
                        ) : (
                          <ActionButton
                            type="edit"
                            onClick={() => openEditModal(s.studentEvaluationId)} // 🔑 abre modal
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Others Tab */}
        {activeTab === 'others' && (
          <div>
            <h3>Otros datos de la evaluación</h3>
            <p>Información adicional...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationModal;
