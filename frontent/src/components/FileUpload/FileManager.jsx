import React, { useState } from 'react';
import FileList from './FileList';
import ProgressBar from './ProgressBar';

const FileManager = ({ 
  files, 
  onFilesChange, 
  maxFiles = 10, 
  maxFileSize = 50 * 1024 * 1024,
  acceptedTypes,
  reorderable = false,
  showProgress = false,
  uploadProgress = 0
}) => {
  const [errors, setErrors] = useState([]);

  const validateFile = (file) => {
    const validationErrors = [];

    // Check file type
    if (acceptedTypes && !acceptedTypes.includes(file.type)) {
      validationErrors.push(`File type ${file.type} not supported`);
    }

    // Check file size
    if (file.size > maxFileSize) {
      validationErrors.push(`File size must be less than ${(maxFileSize / 1024 / 1024).toFixed(0)}MB`);
    }

    return validationErrors;
  };

  const handleAddFiles = (newFiles) => {
    const validFiles = [];
    const newErrors = [];

    // Check if adding would exceed max files
    if (files.length + newFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`);
      setErrors(newErrors);
      return;
    }

    newFiles.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        newErrors.push(`${file.name}: ${fileErrors.join(', ')}`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      onFilesChange(updatedFiles);
      setErrors([]);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const handleReorder = (dragIndex, dropIndex) => {
    const updatedFiles = [...files];
    const [draggedFile] = updatedFiles.splice(dragIndex, 1);
    updatedFiles.splice(dropIndex, 0, draggedFile);
    onFilesChange(updatedFiles);
  };

  const handleClearAll = () => {
    onFilesChange([]);
    setErrors([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  return (
    <div className="space-y-4">
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Selected Files ({files.length}/{maxFiles})
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total size: {formatFileSize(getTotalSize())}
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded transition-colors"
            >
              Clear All
            </button>
          </div>

          <FileList
            files={files}
            onRemove={handleRemoveFile}
            onReorder={handleReorder}
            reorderable={reorderable}
          />

          {/* Upload Progress */}
          {showProgress && uploadProgress > 0 && (
            <div className="mt-4">
              <ProgressBar
                progress={uploadProgress}
                size="medium"
                color="primary"
                showPercentage={true}
                animated={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
            Errors
          </h4>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700 dark:text-red-300">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File Limits Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>Maximum {maxFiles} files (max {formatFileSize(maxFileSize)} each)</p>
      </div>
    </div>
  );
};

export default FileManager;