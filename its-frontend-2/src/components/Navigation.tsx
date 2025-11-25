import { useState, useRef, useEffect } from 'react';
import { BookOpen, User, LogOut, ChevronDown } from 'lucide-react';

interface NavigationProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: 'STUDENT' | 'INSTRUCTOR' | null;
  };
  currentPage: string;
  onNavigate: (page: any) => void;
  onLogout: () => void;
}

export function Navigation({ user, currentPage, onNavigate, onLogout }: NavigationProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
      if (!user?.firstName || !user?.lastName) return '';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-900">
              Intelligent Tutoring System
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'dashboard'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('content')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'content' || currentPage === 'create-content' || currentPage === 'edit-content'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Content
            </button>
          </div>

          {/* User Avatar & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white">
                {getInitials()}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-500">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    // Profile action
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
