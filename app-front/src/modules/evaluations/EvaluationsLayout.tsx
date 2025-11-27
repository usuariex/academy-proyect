// EvaluationsLayout.tsx
import { NavLink, Outlet } from 'react-router-dom';
/* import { useAuth } from '../../context/AuthContext'; */
import './EvaluationsLayout.css';

const EvaluationsLayout = () => {
  /* const { hasPermission } = useAuth(); */

  return (
    <div className="evaluations-layout">
      <h2>Evaluaciones</h2> {/* 👈 Texto visible en español */}
      <nav className="evaluations-nav">
        <NavLink to="/evaluations" end> Lista de Evaluaciones</NavLink> {/* 👈 Texto visible en español */}
        {/*  {hasPermission('create_evaluations')  && ( */}
        <NavLink to="/evaluations/create"> Crear </NavLink> {/* 👈 Texto visible en español */}
       {/*  )} */}
      </nav>
      <div className="evaluations-content">
        <Outlet />
      </div>
    </div>
  );
};

export default EvaluationsLayout;
