import React, { useState, useEffect } from 'react';
import ProgressBar from '../FileUpload/ProgressBar';

const ProgressTracker = ({ 
  progress = 0, 
  status = 'processing', 
  currentStep = '', 
  totalSteps = 0,
  currentStepIndex = 0,
  estimatedTime = 0,
  onCancel,
  showSteps = true,
  compact = false
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);

  useEffect(() => {
    let interval;
    if (status === 'processing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        if (estimatedTime > 0) {
          const remaining = Math.max(0, estimatedTime - timeElapsed);
          setTimeRemaining(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, estimatedTime, timeElapsed]);

  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'primary';
      case 'completed':
        return 'success';
      case 'error':
        return 'error';
      case 'cancelled':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3">
        <div className="text-primary-600 dark:text-primary-400">
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <ProgressBar
            progress={progress}
            size="small"
            color={getStatusColor()}
            showPercentage={false}
            animated={status === 'processing'}
          />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {Math.round(progress)}%
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`text-${getStatusColor()}-600 dark:text-${getStatusColor()}-400`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {status}
            </h3>
            {currentStep && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStep}
              </p>
            )}
          </div>
        </div>
        {status === 'processing' && onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div>
        <ProgressBar
          progress={progress}
          size="medium"
          color={getStatusColor()}
          showPercentage={true}
          animated={status === 'processing'}
        />
      </div>

      {/* Time Information */}
      {(timeElapsed > 0 || timeRemaining > 0) && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Elapsed: {formatTime(timeElapsed)}</span>
          {timeRemaining > 0 && (
            <span>Remaining: {formatTime(timeRemaining)}</span>
          )}
        </div>
      )}

      {/* Step Progress */}
      {showSteps && totalSteps > 0 && (
        <div className="pt-2">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
            <span>{Math.round((currentStepIndex + 1) / totalSteps * 100)}% complete</span>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`
                  h-1 flex-1 rounded-full transition-all duration-300
                  ${index < currentStepIndex
                    ? 'bg-primary-500'
                    : index === currentStepIndex
                    ? 'bg-primary-300'
                    : 'bg-gray-300 dark:bg-gray-600'
                  }
                `}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;