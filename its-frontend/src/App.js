import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import Navigation from './components/common/Navigation';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/common/Dashboard';
import ContentDashboard from './components/content/ContentDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/App.css';

/**
 * Main App Component following React best practices
 * Handles routing and context providers
 */
function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <div className="App">
            <Navigation />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/content" element={
                  <ProtectedRoute>
                    <ContentDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/content/manage" element={
                  <ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}>
                    <ContentDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Unauthorized access page */}
                <Route path="/unauthorized" element={
                  <div className="unauthorized">
                    <h2>Access Denied</h2>
                    <p>You don't have permission to access this page.</p>
                  </div>
                } />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* 404 page */}
                <Route path="*" element={
                  <div className="not-found">
                    <h2>Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;