import React from 'react';

const StepProgress = ({ 
  steps = [], 
  currentStep = 0, 
  vertical = false,
  showLabels = true,
  showDescriptions = false,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: {
      circle: 'w-6 h-6 text-xs',
      line: 'h-0.5',
      label: 'text-xs'
    },
    medium: {
      circle: 'w-8 h-8 text-sm',
      line: 'h-1',
      label: 'text-sm'
    },
    large: {
      circle: 'w-10 h-10 text-base',
      line: 'h-1.5',
      label: 'text-base'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white border-green-500';
      case 'active':
        return 'bg-primary-500 text-white border-primary-500';
      case 'pending':
        return 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600';
    }
  };

  const getLineColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-primary-500';
      case 'pending':
        return 'bg-gray-300 dark:bg-gray-600';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  if (vertical) {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-start space-x-4">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    ${currentSize.circle} 
                    rounded-full 
                    border-2 
                    flex items-center justify-center 
                    font-semibold 
                    transition-all duration-300
                    ${getStepColor(status)}
                  `}
                >
                  {status === 'completed' ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {/* Vertical Line */}
                {!isLast && (
                  <div
                    className={`
                      ${currentSize.line} 
                      w-0.5 
                      mt-2 
                      transition-all duration-300
                      ${getLineColor(status)}
                    `}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-1">
                {showLabels && (
                  <h4 className={`
                    ${currentSize.label} 
                    font-semibold 
                    ${status === 'active' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}
                  `}>
                    {step.label || `Step ${index + 1}`}
                  </h4>
                )}
                {showDescriptions && step.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`
                  ${currentSize.circle} 
                  rounded-full 
                  border-2 
                  flex items-center justify-center 
                  font-semibold 
                  transition-all duration-300
                  ${getStepColor(status)}
                `}
              >
                {status === 'completed' ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Horizontal Line */}
              {!isLast && (
                <div
                  className={`
                    ${currentSize.line} 
                    flex-1 
                    mx-2 
                    transition-all duration-300
                    ${getLineColor(status)}
                  `}
                />
              )}

              {/* Step Label */}
              {showLabels && (
                <div className={`
                  ${currentSize.label} 
                  font-semibold 
                  ${status === 'active' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}
                  ${!isLast ? 'hidden sm:block' : ''}
                `}>
                  {step.label || `Step ${index + 1}`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Step Description */}
      {showDescriptions && steps[currentStep]?.description && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {steps[currentStep].description}
          </p>
        </div>
      )}
    </div>
  );
};

export default StepProgress;