import { Sidebar } from '@/components/layout';
import { Outlet } from 'react-router-dom';
import styles from './LayoutGlobal.module.css';

export const LayoutGlobal = () => {

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
