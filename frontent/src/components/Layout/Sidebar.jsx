import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../Theme/ThemeToggle';

const Sidebar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState);
  };

  const navItems = isAuthenticated ? [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/tools', label: 'Tools', icon: '🛠️' },
    { path: '/history', label: 'History', icon: '📜' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ] : [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/tools', label: 'Tools', icon: '🛠️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white/90 backdrop-blur-md shadow-xl dark:bg-gray-800/90 backdrop-blur-md
        transform transition-all duration-300 ease-in-out z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-56'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-2">
              <img src="/converter-icon.svg" alt="" className="h-8 w-8 shrink-0" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Document Converter
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                  ${isCollapsed ? 'justify-center' : 'space-x-3'}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
            
            {!isAuthenticated && (
              <div className="pt-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                  title={isCollapsed ? 'Login' : ''}
                >
                  <span className="text-xl">🔐</span>
                  {!isCollapsed && <span className="font-medium">Login</span>}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                  title={isCollapsed ? 'Register' : ''}
                >
                  <span className="text-xl">📝</span>
                  {!isCollapsed && <span className="font-medium">Register</span>}
                </Link>
              </div>
            )}
          </nav>

          {/* User Info & Actions */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {isAuthenticated && (
              <div className={`flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className={`w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 ${isCollapsed ? '' : 'space-x-2'}`}
                title={isCollapsed ? 'Logout' : ''}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {!isCollapsed && <span>Logout</span>}
              </button>
            )}

            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <ThemeToggle />
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isCollapsed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;