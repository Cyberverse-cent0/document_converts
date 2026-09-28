import React, { useState, useCallback } from 'react';

const FileUpload = ({ onFileSelect, mode, onModeChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 50 * 1024 * 1024; // Default 50MB

    if (!validTypes.includes(file.type)) {
      alert('Please select a PDF or Word document');
      return false;
    }

    if (file.size > maxSize) {
      alert(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return false;
    }

    return true;
  };

  return (
    <div className="space-y-6">
      <div className="transform transition-all duration-300 hover:scale-105">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Conversion Mode
        </label>
        <select
          value={mode}
          onChange={(e) => onModeChange(e.target.value)}
          className="input-field cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
          <option value="pdf-to-word">PDF to Word</option>
          <option value="word-to-pdf">Word to PDF</option>
        </select>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 transform ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105 shadow-lg animate-pulse-glow'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:shadow-md hover:-translate-y-1'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
        />
        <label
          htmlFor="file-upload"
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
              {isDragging ? 'Drop your file here!' : 'Drag and drop your file here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
              or click to browse
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Supports PDF, DOC, DOCX (max {((parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 52428800) / 1024 / 1024).toFixed(0)}MB)
            </p>
          </div>
        </label>
      </div>

      {selectedFile && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/30 rounded-lg p-4 transform transition-all duration-300 animate-fade-in border border-gray-200 dark:border-gray-600 hover:shadow-md">
          <div className="flex items-center justify-between">
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
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                onFileSelect(null);
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
