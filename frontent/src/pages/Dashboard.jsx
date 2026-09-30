import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import RecentFiles from '../components/Dashboard/RecentFiles';
import StorageUsage from '../components/Dashboard/StorageUsage';
import ActivityTimeline from '../components/Dashboard/ActivityTimeline';
import { dashboardService } from '../services/dashboard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalConversions: 0,
    totalFilesProcessed: 0,
    storageUsed: 0,
    storageLimit: 100 * 1024 * 1024, // 100MB default
    favoriteTools: []
  });

  const [recentFiles, setRecentFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [statsRef, statsVisible] = useScrollAnimation(0.1);
  const [contentRef, contentVisible] = useScrollAnimation(0.1);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Set default data first
      const defaultStats = {
        totalConversions: 0,
        totalFilesProcessed: 0,
        storageUsed: 0,
        storageLimit: 100 * 1024 * 1024,
        favoriteTools: []
      };

      // Try to fetch data from API, but use defaults if endpoints don't exist
      try {
        const userStats = await dashboardService.getUserStats();
        setStats(typeof userStats === 'object' && userStats !== null ? userStats : defaultStats);
      } catch (statsErr) {
        console.log('Stats endpoint not available, using defaults');
        setStats(defaultStats);
      }

      try {
        const recentFilesData = await dashboardService.getRecentFiles(10);
        setRecentFiles(Array.isArray(recentFilesData) ? recentFilesData : []);
      } catch (filesErr) {
        console.log('Recent files endpoint not available, using defaults');
        setRecentFiles([]);
      }

      try {
        const activityData = await dashboardService.getActivityTimeline(20);
        setActivities(Array.isArray(activityData) ? activityData : []);
      } catch (activityErr) {
        console.log('Activity endpoint not available, using defaults');
        setActivities([]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Set default data on error
      setStats({
        totalConversions: 0,
        totalFilesProcessed: 0,
        storageUsed: 0,
        storageLimit: 100 * 1024 * 1024,
        favoriteTools: []
      });
      setRecentFiles([]);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const storagePercentage = stats.storageLimit > 0 ? (stats.storageUsed / stats.storageLimit) * 100 : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="w-12 h-12 animate-spin mx-auto text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div 
        ref={headerRef}
        className={`mb-8 transition-all duration-700 transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your documents
        </p>
      </div>

      {/* Stats Grid */}
      <div 
        ref={statsRef}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-700 transform ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* Total Conversions */}
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Conversions</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalConversions}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        {/* Files Processed */}
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Files Processed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.totalFilesProcessed}
              </p>
            </div>
            <div className="text-4xl">📁</div>
          </div>
        </div>

        {/* Storage Used */}
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Storage Used</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatFileSize(stats.storageUsed)}
              </p>
            </div>
            <div className="text-4xl">💾</div>
          </div>
        </div>

        {/* Favorite Tools */}
        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Favorite Tools</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.favoriteTools?.length || 0}
              </p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={contentRef}
        className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* Recent Files */}
        <div className="lg:col-span-2">
          <RecentFiles files={recentFiles} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Storage Usage */}
          <StorageUsage 
            used={stats.storageUsed} 
            limit={stats.storageLimit}
            percentage={storagePercentage}
          />

          {/* Activity Timeline */}
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;