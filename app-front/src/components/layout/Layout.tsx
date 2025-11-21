import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import './layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main">
        <Sidebar />
        <div className="content">
          <Outlet /> {/* Aquí se renderiza EvaluacionList, AlumnoList, etc */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
