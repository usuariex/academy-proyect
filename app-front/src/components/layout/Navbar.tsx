import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="logo">Academy</div>
      <input type="text" placeholder="Search..." />
      <div className="actions">
        <button>🔔</button> {/* Notifications */}
        <span>{user?.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
