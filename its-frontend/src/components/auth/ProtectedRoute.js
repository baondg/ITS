import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protected Route Component following HOC pattern
 * Implements route-based authentication protection
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;