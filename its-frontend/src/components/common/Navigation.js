import React, { useState, useRef, useEffect } from 'react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!isAuthenticated) {
    return null; // Don't show navigation for non-authenticated users
  }

  const canCreateContent = user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN');
  
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

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

        <div className="nav-user" ref={dropdownRef}>
          {user && (
            <div className="user-menu-wrapper">
              <button className="user-menu-btn" onClick={toggleDropdown}>
                <div className="user-avatar">
                  {getInitials()}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.firstName || user.email}</span>
                  <span className="user-role-badge">{user.role}</span>
                </div>
                <svg 
                  className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="currentColor"
                >
                  <path d="M6 9L1 4h10L6 9z"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user-info">
                      <strong>{user.firstName} {user.lastName}</strong>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 2c-3.866 0-7 2.015-7 4.5V16h14v-1.5c0-2.485-3.134-4.5-7-4.5z"/>
                    </svg>
                    <span>View Profile</span>
                  </Link>
                  
                  <Link 
                    to="/dashboard" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1l7 7-1.5 1.5L8 4 2.5 9.5 1 8l7-7z"/>
                      <path d="M3 9v5a1 1 0 001 1h8a1 1 0 001-1V9l-5-5-5 5z"/>
                    </svg>
                    <span>Dashboard</span>
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3m5 4l3 3m0 0l-3 3m3-3H6"/>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;