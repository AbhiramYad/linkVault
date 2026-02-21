import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/auth.js';
import '../styles/layout.css';

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h2>LinkVault</h2>
          </div>

          <div className="navbar-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/analytics" className="nav-link">Analytics</Link>
          </div>

          <div className="navbar-user">
            <span className="user-email">{user?.email}</span>
            <button className="btn btn-small" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2026 LinkVault. Smart Link Sharing Platform.</p>
      </footer>
    </div>
  );
}
