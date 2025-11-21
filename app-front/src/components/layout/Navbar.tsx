
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="logo">Academia</div>
      <input type="text" placeholder="Buscar..." />
      <div className="actions">
        <button>🔔</button> {/* Notificaciones */}
        <span>{user?.nombre}</span>
        <button onClick={logout}>Salir</button>
      </div>
    </header>
  );
};

export default Navbar;
