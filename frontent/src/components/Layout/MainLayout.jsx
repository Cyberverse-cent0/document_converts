import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    const checkSidebarState = () => {
      const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      setIsSidebarCollapsed(collapsed);
    };

    window.addEventListener('storage', checkSidebarState);
    const interval = setInterval(checkSidebarState, 100);

    return () => {
      window.removeEventListener('storage', checkSidebarState);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-56'}`}>
        <div className="container mx-auto px-4 py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;


