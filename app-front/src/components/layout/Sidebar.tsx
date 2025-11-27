import { useState } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button onClick={() => setCollapsed(!collapsed)}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <nav>
        <Link to="/profile">
          <FontAwesomeIcon icon={faUser} />
          {!collapsed && <span>Perfil</span>}
        </Link>

        <Link to="/students">
          <FontAwesomeIcon icon={faUserGraduate} />
          {!collapsed && <span>Alumnos</span>}
        </Link>

        <Link to="/evaluations">
          <FontAwesomeIcon icon={faClipboardList} />
          {!collapsed && <span>Evaluaciones</span>}
        </Link>

        <Link to="/settings">
          <FontAwesomeIcon icon={faCog} />
          {!collapsed && <span>Configuraciones</span>}
        </Link>

        <Link to="/attendance">
          <FontAwesomeIcon icon={faCalendarCheck} />
          {!collapsed && <span>Asistencia</span>}
        </Link>

        <Link to="/payments">
          <FontAwesomeIcon icon={faMoneyBill} />
          {!collapsed && <span>Pagos</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
