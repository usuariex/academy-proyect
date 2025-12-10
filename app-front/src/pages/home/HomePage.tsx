
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <h1 className={styles.homePage__title}>Bienvenido 👋</h1>
      <p className={styles.homePage__description}>
        Selecciona una sección desde el sidebar o usa los accesos rápidos:
      </p>
      <ul className={styles.homePage__links}>
        <li>
          <Link to="/evaluations">Ir a Evaluaciones</Link>
        </li>
        <li>
          <Link to="/students">Ir a Estudiantes</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
