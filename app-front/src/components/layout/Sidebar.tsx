import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Sidebar.css';
import { 
  faUserGraduate, 
  faClipboardList, 
  faMoneyBill, 
  faCog, 
  faCalendarCheck, 
  faUser,
  faBars 
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { hasPermission } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button onClick={() => setCollapsed(!collapsed)}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <nav>
        <Link to="/perfil">
          <FontAwesomeIcon icon={faUser} />
          {!collapsed && <span>Perfil</span>}
        </Link>
        {hasPermission('configuracion') && (
          <Link to="/configuracion">
            <FontAwesomeIcon icon={faCog} />
            {!collapsed && <span>Configuración</span>}
          </Link>
        )}

        {hasPermission('ver_evaluaciones') && (
          <Link to="/evaluaciones">
            <FontAwesomeIcon icon={faClipboardList} />
            {!collapsed && <span>Evaluaciones</span>}
          </Link>
        )}
        
        {hasPermission('ver_asistencia') && (
          <Link to="/asistencia">
            <FontAwesomeIcon icon={faCalendarCheck} />
            {!collapsed && <span>Asistencia</span>}
          </Link>
        )}
        {hasPermission('ver_pagos') && (
          <Link to="/pagos">
            <FontAwesomeIcon icon={faMoneyBill} />
            {!collapsed && <span>Pagos</span>}
          </Link>
        )}
        {hasPermission('ver_alumnos') && (
          <Link to="/alumnos">
            <FontAwesomeIcon icon={faUserGraduate} />
            {!collapsed && <span>Alumnos</span>}
          </Link>
        )}
        
      </nav>
    </aside>
  );
};

export default Sidebar;
