import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">📚 BookVerse</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/books">Books</NavLink></li>
            {user && <li className="nav-item"><NavLink className="nav-link" to="/orders">My Orders</NavLink></li>}
            {isAdmin && (
              <>
                <li className="nav-item"><NavLink className="nav-link" end to="/admin">Manage Books</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/orders">Manage Orders</NavLink></li>
              </>
            )}
          </ul>
          <ul className="navbar-nav align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/cart">
                🛒 Cart {count > 0 && <span className="badge bg-warning text-dark">{count}</span>}
              </NavLink>
            </li>
            {user ? (
              <>
                <li className="nav-item"><span className="navbar-text">Hi, {user.name}</span></li>
                <li className="nav-item"><button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><Link className="btn btn-warning btn-sm" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
