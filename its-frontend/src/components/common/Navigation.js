import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './navigation.css';

/**
 * Navigation Component following Single Responsibility Principle
 * Handles application navigation and user menu
 */
const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null; // Don't show navigation for non-authenticated users
  }

  const canCreateContent = user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN');

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard" className="brand-link">
            📚 ITS
          </Link>
        </div>

        <div className="nav-menu">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/content" className="nav-link">
            Content
          </Link>
          {canCreateContent && (
            <Link to="/content/manage" className="nav-link">
              Manage Content
            </Link>
          )}
        </div>

        <div className="nav-user">
          {user && (
            <div className="user-menu">
              <span className="user-greeting">
                Hello, {user.firstName || user.email}
              </span>
              <span className="user-role">({user.role})</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;