import React, { useState, useCallback } from 'react';

const MultiFileUpload = ({ onFilesSelect, maxFiles = 10, acceptedTypes }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [maxFiles, acceptedTypes]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => validateFile(file));
    
    if (selectedFiles.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    onFilesSelect(newFiles);
  };

  const validateFile = (file) => {
    if (acceptedTypes && !acceptedTypes.includes(file.type)) {
      alert(`File type ${file.type} not supported`);
      return false;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert(`File size must be less than 50MB`);
      return false;
    }

    return true;
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelect(newFiles);
  };

  const clearAll = () => {
    setSelectedFiles([]);
    onFilesSelect([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 transform
          ${isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105 shadow-lg animate-pulse-glow'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:shadow-md hover:-translate-y-1'
          }
        `}
      >
        <input
          type="file"
          id="multi-file-upload"
          className="hidden"
          multiple
          accept={acceptedTypes?.join(',')}
          onChange={handleFileSelect}
        />
        <label
          htmlFor="multi-file-upload"
          className="cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <svg
              className={`w-16 h-16 mb-4 transition-all duration-300 ${isDragging ? 'text-primary-600 scale-110 animate-bounce' : 'text-gray-400 hover:text-primary-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className={`text-lg mb-2 transition-colors duration-300 ${isDragging ? 'text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
              {isDragging ? 'Drop your files here!' : 'Drag and drop your files here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
              or click to browse
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Maximum {maxFiles} files (max 50MB each)
            </p>
          </div>
        </label>
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Selected Files ({selectedFiles.length}/{maxFiles})
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/30 rounded-lg p-4 transform transition-all duration-300 animate-fade-in border border-gray-200 dark:border-gray-600 hover:shadow-md flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <svg
                      className="w-10 h-10 text-primary-600 transform transition-transform duration-300 hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;