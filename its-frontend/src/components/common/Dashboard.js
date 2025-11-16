import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ContentDashboard from '../content/ContentDashboard';

/**
 * Dashboard Component following Single Responsibility Principle
 * Main dashboard view for authenticated users
 */
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-welcome">
          <h1>Welcome to Intelligent Tutoring System</h1>
          <p>
            Hello, {user?.firstName || user?.email}! 
            You're logged in as a <strong>{user?.role?.toLowerCase()}</strong>.
          </p>
        </div>

        <div className="dashboard-content">
          <ContentDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;