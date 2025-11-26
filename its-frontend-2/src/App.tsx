
import { Navigation } from './components/Navigation';
import StudentDashboard from './components/student/Dashboard';
import StudentContentPage from './components/student/ContentPage';
import InstructorDashboard from './components/instructor/Dashboard';
import InstructorContentPage from './components/instructor/ContentPage';
import ContentForm from './components/instructor/ContentForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Toaster } from './components/ui/sonner';
import { useState, useEffect } from 'react';

type UserRole = 'STUDENT' | 'INSTRUCTOR' | null;
type Page = 'dashboard' | 'content' | 'create-content' | 'edit-content' | 'login' | 'register';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  token: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return (localStorage.getItem('currentPage') as Page) || 'login';
  });
  const [user, setUser] = useState<User | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
      localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    useEffect(() => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user"); // nếu bạn lưu user info
      const savedPage = (localStorage.getItem('currentPage') as Page) || 'dashboard';


      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setCurrentPage(savedPage);
      } else {
        setCurrentPage('login');
      }
      setIsInitializing(false);
    }, []);

    useEffect(() => {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'token' && !event.newValue) {
          setUser(null);
          setCurrentPage('login');
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, []);


    const handleLogin = (userData: User) => {
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData)); // lưu luôn user info

      setUser(userData);
      setCurrentPage("dashboard");
    };
  const handleRegister = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setCurrentPage("login");
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

    if (isInitializing) {
      return null;
    }

    if (!user) {
      return (
        <Login
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      );
    }

  return (
    <div className="min-h-screen bg-gray-50">
        {user && (
          <Navigation
            user={user}
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
          />
        )}
      
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