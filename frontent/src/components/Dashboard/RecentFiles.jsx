import React from 'react';
import { Link } from 'react-router-dom';

const RecentFiles = ({ files = [] }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getToolIcon = (toolId) => {
    const icons = {
      'merge-pdf': '🔗',
      'split-pdf': '✂️',
      'compress-pdf': '📦',
      'pdf-to-word': '📝',
      'word-to-pdf': '📝',
      'rotate-pdf': '🔄',
      'add-page-numbers': '🔢',
      'add-watermark': '💧'
    };
    return icons[toolId] || '📄';
  };

  if (files.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Files
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📁</div>
          <p>No recent files</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recent Files
        </h2>
        <Link 
          to="/history" 
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getToolIcon(file.tool)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)} • {formatDate(file.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full">
                {file.tool}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentFiles;