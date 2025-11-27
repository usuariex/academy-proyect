import { Outlet, NavLink } from "react-router-dom";
import { StudentsUIProvider } from "../../../../context/StudentsUIContext";
import styles from "./StudentsLayout.module.css";

const StudentsLayout = () => {
  return (
    <StudentsUIProvider>
      <div className={styles.studentsLayout}>
        <h2 className={styles.studentsLayout__title}>Estudiantes</h2>
        <nav className={styles.studentsLayout__nav}>
          <NavLink
            to="/students"
            end
            className={({ isActive }) =>
              isActive
                ? `${styles.studentsLayout__navLink} ${styles["studentsLayout__navLink--active"]}`
                : styles.studentsLayout__navLink
            }
          >
            Listar alumnos
          </NavLink>
          <NavLink
            to="/students/create"
            className={({ isActive }) =>
              isActive
                ? `${styles.studentsLayout__navLink} ${styles["studentsLayout__navLink--active"]}`
                : styles.studentsLayout__navLink
            }
          >
            Crear
          </NavLink>
        </nav>
        <div className={styles.studentsLayout__content}>
          <Outlet />
        </div>
      </div>
    </StudentsUIProvider>
  );
};

export default StudentsLayout;


