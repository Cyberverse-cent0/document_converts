import React, { useState } from 'react';

const FileComparison = ({ originalFiles = [], processedFiles = [] }) => {
  const [activeTab, setActiveTab] = useState('size'); // 'size', 'quality', 'pages'

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const calculateSavings = (original, processed) => {
    if (!original || !processed || original.size === 0) return 0;
    return Math.round(((original.size - processed.size) / original.size) * 100);
  };

  const getSavingsColor = (savings) => {
    if (savings >= 50) return 'text-green-600 dark:text-green-400';
    if (savings >= 20) return 'text-blue-600 dark:text-blue-400';
    if (savings >= 0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('size')}
            className={`
              px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'size'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            Size Comparison
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`
              px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'quality'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            Quality Metrics
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`
              px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'pages'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            Page Count
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'size' && (
          <div className="space-y-4">
            {originalFiles.map((original, index) => {
              const processed = processedFiles[index];
              if (!processed) return null;

              const savings = calculateSavings(original, processed);

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                      {original.name}
                    </span>
                    <span className={`font-semibold ${getSavingsColor(savings)}`}>
                      {savings >= 0 ? `${savings}% smaller` : `${Math.abs(savings)}% larger`}
                    </span>
                  </div>

                  {/* Size Comparison Bar */}
                  <div className="relative h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {/* Original Size Bar */}
                    <div
                      className="absolute left-0 top-0 h-full bg-red-200 dark:bg-red-900/30"
                      style={{ width: '100%' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-red-700 dark:text-red-400 font-medium">
                        {formatFileSize(original.size)}
                      </div>
                    </div>

                    {/* Processed Size Bar */}
                    <div
                      className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${100 - savings}%` }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                        {formatFileSize(processed.size)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-4">
            {originalFiles.map((original, index) => {
              const processed = processedFiles[index];
              if (!processed) return null;

              return (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {original.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      DPI: {original.dpi || 'Unknown'}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Processed</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {processed.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      DPI: {processed.dpi || 'Unknown'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-4">
            {originalFiles.map((original, index) => {
              const processed = processedFiles[index];
              if (!processed) return null;

              return (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {original.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {original.pages || '?'} pages
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {processed.pages || '?'} pages
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      after processing
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total files compared: {Math.min(originalFiles.length, processedFiles.length)}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Average savings: {Math.round(
              originalFiles.reduce((sum, original, index) => {
                const processed = processedFiles[index];
                return sum + (processed ? calculateSavings(original, processed) : 0);
              }, 0) / Math.min(originalFiles.length, processedFiles.length)
            )}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileComparison;