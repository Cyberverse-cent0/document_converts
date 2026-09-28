import React from 'react';

const ProgressBar = ({ progress, size = 'medium', color = 'primary', showPercentage = true, animated = true }) => {
  const sizeClasses = {
    small: 'h-1',
    medium: 'h-2.5',
    large: 'h-4'
  };

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    error: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  };

  const bgClasses = {
    primary: 'bg-gray-200 dark:bg-gray-700',
    success: 'bg-gray-200 dark:bg-gray-700',
    warning: 'bg-gray-200 dark:bg-gray-700',
    error: 'bg-gray-200 dark:bg-gray-700',
    purple: 'bg-gray-200 dark:bg-gray-700'
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;
  const currentColor = colorClasses[color] || colorClasses.primary;
  const currentBg = bgClasses[color] || bgClasses.primary;

  return (
    <div className="w-full">
      <div className={`w-full ${currentBg} rounded-full overflow-hidden`}>
        <div
          className={`
            ${currentColor} 
            ${currentSize} 
            rounded-full 
            transition-all duration-300 
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;