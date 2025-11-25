import { useState } from 'react';
import { Navigation } from './components/Navigation';
import StudentDashboard from './components/student/Dashboard';
import StudentContentPage from './components/student/ContentPage';
import InstructorDashboard from './components/instructor/Dashboard';
import InstructorContentPage from './components/instructor/ContentPage';
import ContentForm from './components/instructor/ContentForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Toaster } from './components/ui/sonner';

type UserRole = 'STUDENT' | 'INSTRUCTOR' | null;
type Page = 'dashboard' | 'content' | 'create-content' | 'edit-content' | 'login' | 'register';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  const handleLogin = (email: string, password: string, role: UserRole) => {
    // Mock login
    setUser({
      firstName: 'A',
      lastName: 'Student',
      email,
      role: role || 'STUDENT',
    });
    setCurrentPage('dashboard');
  };

  const handleRegister = (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole
  ) => {
    // Mock register
    setUser({
      firstName,
      lastName,
      email,
      role: role || 'STUDENT',
    });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleEditContent = (contentId: string) => {
    setEditingContentId(contentId);
    setCurrentPage('edit-content');
  };

  if (currentPage === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onNavigateToRegister={() => setCurrentPage('register')}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <Register
        onRegister={handleRegister}
        onNavigateToLogin={() => setCurrentPage('login')}
      />
    );
  }

  if (!user) {
    setCurrentPage('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        {currentPage === 'dashboard' && user.role === 'STUDENT' && (
          <StudentDashboard 
            userName={user.firstName} 
            onNavigateToContent={() => setCurrentPage('content')}
          />
        )}
        
        {currentPage === 'dashboard' && user.role === 'INSTRUCTOR' && (
          <InstructorDashboard
            userName={user.firstName}
            onNavigateToContent={() => setCurrentPage('content')}
          />
        )}
        
        {currentPage === 'content' && user.role === 'STUDENT' && (
          <StudentContentPage />
        )}
        
        {currentPage === 'content' && user.role === 'INSTRUCTOR' && (
          <InstructorContentPage
            onCreateContent={() => setCurrentPage('create-content')}
            onEditContent={handleEditContent}
          />
        )}
        
        {currentPage === 'create-content' && user.role === 'INSTRUCTOR' && (
          <ContentForm
            onCancel={() => setCurrentPage('content')}
            onSave={() => setCurrentPage('content')}
          />
        )}
        
        {currentPage === 'edit-content' && user.role === 'INSTRUCTOR' && (
          <ContentForm
            contentId={editingContentId}
            onCancel={() => setCurrentPage('content')}
            onSave={() => setCurrentPage('content')}
          />
        )}
      </main>
      <Toaster />
    </div>
  );
}