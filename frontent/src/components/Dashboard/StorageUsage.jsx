import React from 'react';

const StorageUsage = ({ used = 0, limit = 100 * 1024 * 1024, percentage = 0 }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getStorageColor = (percentage) => {
    if (percentage >= 90) return 'from-red-500 to-red-600';
    if (percentage >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getStorageStatus = (percentage) => {
    if (percentage >= 90) return { text: 'Critical', color: 'text-red-600 dark:text-red-400' };
    if (percentage >= 70) return { text: 'Warning', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'Good', color: 'text-green-600 dark:text-green-400' };
  };

  const status = getStorageStatus(percentage);

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Storage Usage
      </h2>

      {/* Storage Visualization */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">
            {formatFileSize(used)} used
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {formatFileSize(limit)} total
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getStorageColor(percentage)} transition-all duration-500`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>

        {/* Percentage */}
        <div className="text-center mt-2">
          <span className={`text-2xl font-bold ${status.color}`}>
            {percentage.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            ({status.text})
          </span>
        </div>
      </div>

      {/* Storage Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-gray-700 dark:text-gray-300">PDFs</span>
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            {formatFileSize(used * 0.6)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-gray-700 dark:text-gray-300">Documents</span>
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            {formatFileSize(used * 0.3)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span className="text-gray-700 dark:text-gray-300">Images</span>
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            {formatFileSize(used * 0.1)}
          </span>
        </div>
      </div>

      {/* Upgrade Prompt */}
      {percentage >= 70 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            ⚠️ You're using {percentage.toFixed(0)}% of your storage. 
            <button className="ml-2 font-semibold hover:underline">
              Upgrade for more space
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default StorageUsage;