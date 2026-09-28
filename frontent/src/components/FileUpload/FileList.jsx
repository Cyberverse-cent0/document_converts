import React from 'react';
import FilePreview from './FilePreview';

const FileList = ({ files, onRemove, onReorder, reorderable = false }) => {
  const handleDragStart = (e, index) => {
    if (!reorderable) return;
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    if (!reorderable) return;
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    if (!reorderable) return;
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== dropIndex && onReorder) {
      onReorder(dragIndex, dropIndex);
    }
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selected Files ({files.length})
        </h3>
        {reorderable && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag to reorder
          </p>
        )}
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            draggable={reorderable}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              transition-all duration-200
              ${reorderable ? 'cursor-move hover:scale-105' : ''}
            `}
          >
            <FilePreview
              file={file}
              onRemove={onRemove}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* List View Alternative */}
      <div className="hidden">
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              draggable={reorderable}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`
                bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/30 
                rounded-lg p-4 transform transition-all duration-300 
                border border-gray-200 dark:border-gray-600 hover:shadow-md 
                flex items-center justify-between
                ${reorderable ? 'cursor-move' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                  {index + 1}
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
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileList;