import Sidebar from './Sidebar';

import { Outlet } from 'react-router-dom';
import './layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <div className="main">
        <Sidebar />
        <div className="content">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default Layout;
