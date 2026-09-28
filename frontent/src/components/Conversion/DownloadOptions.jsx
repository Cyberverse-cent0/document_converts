import React, { useState } from 'react';

const DownloadOptions = ({ 
  results = [], 
  selectedFiles = [],
  onDownload,
  onShare,
  onSaveToCloud
}) => {
  const [downloadMode, setDownloadMode] = useState('individual'); // 'individual' or 'zip'
  const [showShareModal, setShowShareModal] = useState(false);

  const handleDownloadIndividual = () => {
    const filesToDownload = selectedFiles.length > 0 
      ? results.filter(r => selectedFiles.includes(r.id || results.indexOf(r)))
      : results;
    
    filesToDownload.forEach(file => {
      if (onDownload) {
        onDownload(file, 'individual');
      }
    });
  };

  const handleDownloadZip = () => {
    const filesToDownload = selectedFiles.length > 0 
      ? results.filter(r => selectedFiles.includes(r.id || results.indexOf(r)))
      : results;
    
    if (onDownload) {
      onDownload(filesToDownload, 'zip');
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(selectedFiles.length > 0 ? selectedFiles : results.map(r => r.id || results.indexOf(r)));
    }
    setShowShareModal(false);
  };

  const handleSaveToCloud = () => {
    if (onSaveToCloud) {
      onSaveToCloud(selectedFiles.length > 0 ? selectedFiles : results.map(r => r.id || results.indexOf(r)));
    }
  };

  const hasFiles = results.length > 0;
  const hasSelection = selectedFiles.length > 0;

  return (
    <div className="space-y-4">
      {/* Download Mode Selection */}
      {hasFiles && (
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="individual"
              checked={downloadMode === 'individual'}
              onChange={(e) => setDownloadMode(e.target.value)}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Individual files</span>
          </label>
          {results.length > 1 && (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="zip"
                checked={downloadMode === 'zip'}
                onChange={(e) => setDownloadMode(e.target.value)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">ZIP archive</span>
            </label>
          )}
        </div>
      )}

      {/* Download Buttons */}
      <div className="flex flex-wrap gap-3">
        {downloadMode === 'individual' ? (
          <button
            onClick={handleDownloadIndividual}
            disabled={!hasFiles}
            className="flex-1 min-w-[200px] btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>
                Download {hasSelection ? `${selectedFiles.length} selected` : `${results.length} file${results.length !== 1 ? 's' : ''}`}
              </span>
            </span>
          </button>
        ) : (
          <button
            onClick={handleDownloadZip}
            disabled={!hasFiles}
            className="flex-1 min-w-[200px] btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>
                Download as ZIP
              </span>
            </span>
          </button>
        )}

        {onShare && (
          <button
            onClick={handleShare}
            disabled={!hasFiles}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </span>
          </button>
        )}

        {onSaveToCloud && (
          <button
            onClick={handleSaveToCloud}
            disabled={!hasFiles}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Save to Cloud</span>
            </span>
          </button>
        )}
      </div>

      {/* Download Info */}
      {hasFiles && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {downloadMode === 'individual' ? (
            <p>
              {hasSelection 
                ? `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} will be downloaded individually`
                : `${results.length} file${results.length !== 1 ? 's' : ''} will be downloaded individually`
              }
            </p>
          ) : (
            <p>
              {hasSelection 
                ? `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} will be downloaded as a single ZIP archive`
                : `All ${results.length} file${results.length !== 1 ? 's' : ''} will be downloaded as a single ZIP archive`
              }
            </p>
          )}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Files
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Share Link
                </label>
                <input
                  type="text"
                  readOnly
                  value="https://your-app.com/share/abc123"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText('https://your-app.com/share/abc123')}
                  className="flex-1 btn-primary"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadOptions;