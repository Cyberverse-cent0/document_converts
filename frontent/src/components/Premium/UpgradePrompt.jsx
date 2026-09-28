import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UpgradePrompt = ({ 
  type = 'inline', // 'inline', 'banner', 'modal'
  feature = 'all premium features',
  onClose,
  className = ''
}) => {
  const variants = {
    inline: {
      container: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4',
      icon: 'text-yellow-500'
    },
    banner: {
      container: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4',
      icon: 'text-white'
    },
    modal: {
      container: 'bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl',
      icon: 'text-yellow-500'
    }
  };

  const style = variants[type] || variants.inline;

  if (type === 'modal') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div className={`${style.container} max-w-md w-full text-center`}>
          <div className={`mx-auto w-16 h-16 ${style.icon} bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4`}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unlock Premium Features
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get access to {feature} and take your PDF processing to the next level.
          </p>

          <div className="space-y-3 mb-6">
            <Link 
              to="/pricing"
              className="block w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors"
            >
              View Pricing Plans
            </Link>
            <button
              onClick={onClose}
              className="block w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${style.container} ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="font-semibold">
              Upgrade to Premium for {feature}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Link 
              to="/pricing"
              className="px-4 py-2 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Upgrade
            </Link>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Inline type (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${style.container} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className={`w-5 h-5 ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Premium Feature
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Unlock {feature}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            to="/pricing"
            className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
          >
            Upgrade
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UpgradePrompt;