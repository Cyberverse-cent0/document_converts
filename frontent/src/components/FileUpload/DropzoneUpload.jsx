import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const DropzoneUpload = ({ onFilesDrop, maxFiles = 10, maxSize = 50 * 1024 * 1024, acceptedTypes }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => {
        const error = file.errors[0];
        if (error.code === 'file-too-large') {
          return `${file.file.name}: File too large (max ${maxSize / 1024 / 1024}MB)`;
        } else if (error.code === 'file-invalid-type') {
          return `${file.file.name}: Invalid file type`;
        }
        return `${file.file.name}: ${error.message}`;
      });
      alert(errors.join('\n'));
      return;
    }

    if (onFilesDrop) {
      onFilesDrop(acceptedFiles);
    }
  }, [onFilesDrop, maxSize]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedTypes ? acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {}) : undefined,
    multiple: maxFiles > 1
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
        ${isDragActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105 shadow-lg animate-pulse-glow'
          : isDragReject
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:shadow-md hover:-translate-y-1'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <svg
          className={`w-16 h-16 mb-4 transition-all duration-300 ${
            isDragActive 
              ? 'text-primary-600 scale-110 animate-bounce' 
              : isDragReject 
              ? 'text-red-500' 
              : 'text-gray-400 hover:text-primary-500'
          }`}
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
        <p className={`text-lg mb-2 transition-colors duration-300 ${
          isDragActive 
            ? 'text-primary-600 font-semibold' 
            : isDragReject 
            ? 'text-red-600 font-semibold' 
            : 'text-gray-600 dark:text-gray-400'
        }`}>
          {isDragActive 
            ? 'Drop your files here!' 
            : isDragReject 
            ? 'File type not supported' 
            : 'Drag and drop your files here'
          }
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
          or click to browse
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          Maximum {maxFiles} files (max {maxSize / 1024 / 1024}MB each)
        </p>
      </div>
    </div>
  );
};

export default DropzoneUpload;