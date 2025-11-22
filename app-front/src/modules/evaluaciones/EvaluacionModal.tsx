import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import type { Evaluacion } from '../../types/Evaluacion';
import type { AlumnoEvaluacion } from '../../types/AlumnoEvaluacion'; // interfaz reducida
import './EvaluacionModal.css';
import { getAlumnosByEvaluacion, searchAlumnosByEvaluacion } from '../../api/alumnos';
import { quitarTildes } from '../../utils/text';

interface EvaluacionModalProps {
  evaluacion: Evaluacion;
  onClose: () => void;
}

const EvaluacionModal: React.FC<EvaluacionModalProps> = ({ evaluacion, onClose }) => {
  const [alumnos, setAlumnos] = useState<AlumnoEvaluacion[]>([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState<AlumnoEvaluacion[]>([]);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'sinCalificar' | 'calificados' | 'desaprobados' | 'aprobados'>('todos');
  const [activeTab, setActiveTab] = useState<'calificaciones' | 'otros'| 'evaluar'>('calificaciones');
  const [seleccionado, setSeleccionado] = useState<number | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      const data = await getAlumnosByEvaluacion(evaluacion.id);
      setAlumnos(data);
    };
    fetchData();
  }, [evaluacion.id]);




  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.trim() !== '') {
        const data = await searchAlumnosByEvaluacion(evaluacion.id, search, filtro);
        setAlumnos(data);
        setFilteredAlumnos(data);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, filtro, evaluacion.id]);



  // 🔹 Filtros en memoria
  useEffect(() => {
    let filtered = alumnos;
    if (filtro === 'sinCalificar') filtered = alumnos.filter(a => a.nota === null);
    if (filtro === 'calificados') filtered = alumnos.filter(a => a.nota !== null);
    if (filtro === 'desaprobados') filtered = alumnos.filter(a => a.nota !== null && a.nota < 11);
    if (filtro === 'aprobados') filtered = alumnos.filter(a => a.nota !== null && a.nota >= 11);
    setFilteredAlumnos(filtered);
  }, [filtro, alumnos]);




  // 🔹 Métricas calculadas en memoria
  const sinCalificar = alumnos.filter(a => a.nota === null).length;
  const calificados = alumnos.filter(a => a.nota !== null).length;
  const desaprobados = alumnos.filter(a => a.nota !== null && a.nota < 11).length;
  const aprobados = alumnos.filter(a => a.nota !== null && a.nota >= 11).length;





  const handleEditNota = async (evaluacionAlumnoId: number, nuevaNota: number) => {
    setAlumnos(prev => prev.map(a => a.evaluacion_alumno_id === evaluacionAlumnoId ? { ...a, nota: nuevaNota } : a));
    setFilteredAlumnos(prev => prev.map(a => a.evaluacion_alumno_id === evaluacionAlumnoId ? { ...a, nota: nuevaNota } : a));

    await api.put(`alumnos/${evaluacionAlumnoId}/`, { calificacion_final: nuevaNota });

    const res = await api.get(
      `evaluaciones/alumnos/?evaluacionId=${evaluacion.id}&filtro=${filtro}&page=1&limit=100`
    );
    const mapped = res.data.results.map((a: any) => ({
      evaluacion_alumno_id: a.evaluacion_alumno_id,
      evaluacion_id: a.evaluacion_id,
      alumno_id: a.alumno_id,
      nombre: a.nombre,
      apellido: a.apellido,
      celular: a.celular,
      nota: a.calificacion_final ? parseFloat(a.calificacion_final) : null,
      estado: a.estado,
    }));
    setAlumnos(mapped);
    setFilteredAlumnos(mapped);
  };





  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3>Calificaciones de {evaluacion.descripcion}</h3>

        {/* 🔹 Métricas */}
        <div className="metrics">
          <div className="sin-calificar">Sin calificar: {sinCalificar}</div>
          <div className="calificados">Calificados: {calificados}</div>
          <div className="desaprobados">Desaprobados: {desaprobados}</div>
          <div className="aprobados">Aprobados: {aprobados}</div>
        </div>



        {/* 🔹 Buscador y filtro */}
        <div className="controls">

          <div className='controls__buscador'>
            <span className="controls__icon">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                const valor = e.target.value;
                setSearch(valor);

                const searchNormalized = quitarTildes(valor.toLowerCase());

                setFilteredAlumnos(
                  alumnos.filter(a =>
                    quitarTildes(a.nombre_completo.toLowerCase()).includes(searchNormalized)
                  )
                );
              }}
              placeholder="Ingresar nombre"
            />
          </div>


          <select value={filtro} onChange={(e) => setFiltro(e.target.value as any)}>
            <option value="todos">Todos</option>
            <option value="sinCalificar">Sin calificar</option>
            <option value="calificados">Calificados</option>
            <option value="desaprobados">Desaprobados</option>
            <option value="aprobados">Aprobados</option>
          </select>
        </div>



        <div className="tabs">
          <button
            className={activeTab === 'calificaciones' ? 'active' : ''}
            onClick={() => setActiveTab('calificaciones')}
          >
            Calificaciones
          </button>

          <button
            className={activeTab === 'evaluar' ? 'active' : ''}
            onClick={() => setActiveTab('evaluar')}
          >
            Evaluar
          </button>



          <button
            className={activeTab === 'otros' ? 'active' : ''}
            onClick={() => setActiveTab('otros')}
          >
            Otros
          </button>
        </div>


        <div className="tab__calificaciones">

          {activeTab === 'calificaciones' && (
            <table className="calificaciones__lista">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Calificación</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlumnos.map((a) => (
                  <tr
                    key={a.evaluacion_alumno_id}
                    className={seleccionado === a.evaluacion_alumno_id ? 'calificaciones__fila--seleccionado' : ''}
                  /* onClick={() => handleSeleccion(a.evaluacion_alumno_id)} */
                  >
                    <td>{a.nombre_completo}</td>
                    <td>{a.nota ?? '---'}</td>
                    <td>{a.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}


          {activeTab === 'evaluar' && (
            <table className="calificaciones__lista">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Calificación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlumnos.map((a) => (
                  <tr
                    key={a.evaluacion_alumno_id}
                    className={seleccionado === a.evaluacion_alumno_id ? 'calificaciones__fila--seleccionado' : ''}
                  /* onClick={() => handleSeleccion(a.evaluacion_alumno_id)} */
                  >
                    <td>{a.nombre_completo}</td>
                    <td>{a.nota ?? '---'}</td>
                    <td>{a.estado}</td>
                    <td>
                      <div className="calificacion__accion">
                        <button
                        /*  onClick={(e) => {
                           e.stopPropagation();
                           handleEditar(a.evaluacion_alumno_id);
                         }} */
                        >
                          Evaluar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}



          {activeTab === 'otros' && (
            <div>
              <h3>Otros datos de la evaluación</h3>
              <p>Información adicional...</p>
            </div>
          )}

        </div>








      </div>
    </div>
  );
};

export default EvaluacionModal;
