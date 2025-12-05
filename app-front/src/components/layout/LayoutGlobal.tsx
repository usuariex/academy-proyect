import { Sidebar } from '@/components';
import { Outlet } from 'react-router-dom';
import styles from './LayoutGlobal.module.css';

const Layout = () => {

  return (
    <div className={styles.appLayout}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>
      <main className={styles.main__content}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
