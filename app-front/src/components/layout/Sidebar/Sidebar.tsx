import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Sidebar.module.css';

import {
  faUserGraduate,
  faClipboardList,
  faMoneyBill,
  faCog,
  faCalendarCheck,
  faUser,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setCollapsed(true), 10000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <button
        className={styles.toggleBtn}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FontAwesomeIcon icon={collapsed ? faBars : faTimes} />
      </button>
      <nav>
        <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : ''}>
          <FontAwesomeIcon icon={faUser} />
          {!collapsed && <span>Perfil</span>}
        </NavLink>

        <NavLink to="/students" className={({ isActive }) => isActive ? styles.active : ''}>
          <FontAwesomeIcon icon={faUserGraduate} />
          {!collapsed && <span>Alumnos</span>}
        </NavLink>

        <NavLink to="/evaluations" className={({ isActive }) => isActive ? styles.active : ''}>
          <FontAwesomeIcon icon={faClipboardList} />
          {!collapsed && <span>Evaluaciones</span>}
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => isActive ? styles.active : ''}>
          <FontAwesomeIcon icon={faCog} />
          {!collapsed && <span>Configuraciones</span>}
        </NavLink>

        <NavLink to="/attendance" className={({ isActive }) => isActive ? styles.active : ''}>
          <FontAwesomeIcon icon={faCalendarCheck} />
          {!collapsed && <span>Asistencia</span>}
        </NavLink>

        <NavLink to="/payments" className={({ isActive }) => isActive ? styles.active : ''}>
          <FontAwesomeIcon icon={faMoneyBill} />
          {!collapsed && <span>Pagos</span>}
        </NavLink>
      </nav>
    </div>
  );
};
