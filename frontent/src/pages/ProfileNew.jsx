import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileNew = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
  });

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    navigate('/login');
  };

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update user profile
    setIsEditing(false);
    // Simulate save
    setTimeout(() => {
      alert('Profile updated successfully!');
    }, 500);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const mockStats = {
    totalConversions: 127,
    filesProcessed: 342,
    storageUsed: 52 * 1024 * 1024, // 52MB
    storageLimit: 100 * 1024 * 1024, // 100MB
    successRate: 98.5,
    favoriteTools: ['Merge PDF', 'PDF to Word', 'Compress PDF'],
  };

  const recentActivity = [
    { tool: 'Merge PDF', date: '2 hours ago', status: 'completed' },
    { tool: 'PDF to Word', date: '5 hours ago', status: 'completed' },
    { tool: 'Compress PDF', date: '1 day ago', status: 'completed' },
    { tool: 'Split PDF', date: '2 days ago', status: 'completed' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm border-4 border-white/30 shrink-0">
              {editedUser.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-1 truncate">{editedUser.name}</h1>
              <p className="text-white/80 text-sm mb-2 truncate">{editedUser.email}</p>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                  Free Plan
                </span>
                <span className="text-xs text-white/80">
                  Member since {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors text-sm shrink-0"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Account Information */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Information</h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Display Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{editedUser.name}</p>
                    </div>
                    <span className="text-gray-400">👤</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{editedUser.email}</p>
                    </div>
                    <span className="text-gray-400">📧</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Account Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">Free Plan</p>
                    </div>
                    <span className="text-gray-400">⭐</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {mockStats.totalConversions}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Conversions</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {mockStats.filesProcessed}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Files</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {mockStats.successRate}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Success</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            {/* Storage Usage */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Storage Usage</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatFileSize(mockStats.storageUsed)} of {formatFileSize(mockStats.storageLimit)}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round((mockStats.storageUsed / mockStats.storageLimit) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(mockStats.storageUsed / mockStats.storageLimit) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">📄 PDFs</span>
                  <span className="text-gray-900 dark:text-white">35 MB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">📝 Documents</span>
                  <span className="text-gray-900 dark:text-white">12 MB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">🖼️ Images</span>
                  <span className="text-gray-900 dark:text-white">5 MB</span>
                </div>
              </div>
            </div>

            {/* Favorite Tools */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Favorite Tools</h2>
              <div className="space-y-3">
                {mockStats.favoriteTools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-gray-900 dark:text-white">{tool}</span>
                    <span className="text-gray-400">⭐</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center text-sm">
                        🔧
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{activity.tool}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Dark Mode</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Toggle dark theme</p>
                </div>
                <button className="w-12 h-6 bg-primary-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Email Notifications</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Receive email updates</p>
                </div>
                <button className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Auto-delete Files</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Automatically delete processed files</p>
                </div>
                <button className="w-12 h-6 bg-primary-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <>
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security Settings</h2>
              <div className="space-y-3">
                <button className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Change Password</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Update your password</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                <button className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Add extra security</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                <button className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Login History</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">View recent logins</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Actions</h2>
              <div className="space-y-3">
                <button className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="font-medium text-sm">Export Data</span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium text-sm">{loading ? 'Logging out...' : 'Logout'}</span>
                  </div>
                </button>
                <button className="w-full p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="font-medium text-sm">Delete Account</span>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileNew;