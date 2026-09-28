import React from 'react';
import { motion } from 'framer-motion';

const AnimatedProgress = ({ 
  progress = 0, 
  size = 'medium', 
  color = 'primary',
  showPercentage = true,
  animated = true 
}) => {
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

  const currentSize = sizeClasses[size] || sizeClasses.medium;
  const currentColor = colorClasses[color] || colorClasses.primary;

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${currentColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between mt-1"
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedProgress;