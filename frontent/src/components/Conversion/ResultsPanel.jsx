import React, { useState } from 'react';
import DownloadOptions from './DownloadOptions';
import FileComparison from './FileComparison';

const ResultsPanel = ({ 
  results = [], 
  originalFiles = [],
  processingStats = null,
  onDownload,
  onShare,
  onSaveToCloud,
  onRestart,
  onNewConversion
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === results.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(results.map(r => r.id));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getTotalSavings = () => {
    if (!processingStats) return 0;
    const originalSize = processingStats.originalSize || 0;
    const compressedSize = processingStats.compressedSize || 0;
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Conversion Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {results.length} file{results.length !== 1 ? 's' : ''} processed successfully
          </p>
        </div>
        <div className="flex space-x-2">
          {onRestart && (
            <button
              onClick={onRestart}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Restart
            </button>
          )}
          {onNewConversion && (
            <button
              onClick={onNewConversion}
              className="px-4 py-2 text-sm btn-primary rounded-lg"
            >
              New Conversion
            </button>
          )}
        </div>
      </div>

      {/* Processing Stats */}
      {processingStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatFileSize(processingStats.originalSize)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Original Size</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatFileSize(processingStats.compressedSize)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Final Size</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {getTotalSavings()}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Size Reduction</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {processingStats.processingTime}s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Processing Time</div>
          </div>
        </div>
      )}

      {/* File Comparison Toggle */}
      {originalFiles.length > 0 && results.length > 0 && (
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>{showComparison ? 'Hide' : 'Show'} file comparison</span>
        </button>
      )}

      {/* File Comparison */}
      {showComparison && originalFiles.length > 0 && (
        <FileComparison
          originalFiles={originalFiles}
          processedFiles={results}
        />
      )}

      {/* Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedFiles.length === results.length && results.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedFiles.length} of {results.length} selected
            </span>
          </div>
        </div>

        {results.map((result, index) => (
          <div
            key={result.id || index}
            className={`
              bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/30 
              rounded-lg p-4 border border-gray-200 dark:border-gray-600 
              hover:shadow-md transition-all duration-200
              ${selectedFiles.includes(result.id || index) ? 'ring-2 ring-primary-500' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(result.id || index)}
                  onChange={() => handleFileSelect(result.id || index)}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {result.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(result.size)} • {result.type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDownload(result)}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Download Options */}
      <DownloadOptions
        results={results}
        selectedFiles={selectedFiles}
        onDownload={onDownload}
        onShare={onShare}
        onSaveToCloud={onSaveToCloud}
      />
    </div>
  );
};

export default ResultsPanel;