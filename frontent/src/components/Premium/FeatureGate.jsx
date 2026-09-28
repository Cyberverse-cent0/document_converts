import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeatureGate = ({ 
  featureName, 
  userPlan = 'free', 
  requiredPlan = 'premium',
  onUpgrade 
}) => {
  const isAvailable = userPlan === 'premium' || userPlan === 'enterprise';

  if (isAvailable) {
    return null; // Feature is available, don't show gate
  }

  const planBenefits = {
    premium: [
      'Unlimited file conversions',
      'Advanced PDF tools',
      'Priority processing',
      'No watermarks',
      'Batch processing',
      'Cloud storage (10GB)'
    ],
    enterprise: [
      'Everything in Premium',
      'Unlimited cloud storage',
      'API access',
      'Custom branding',
      'Priority support',
      'Team collaboration'
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 text-center">
        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Premium Feature
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This feature requires a {requiredPlan} plan
        </p>

        {/* Benefits */}
        <div className="text-left mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Plan Benefits:
          </h3>
          <ul className="space-y-2">
            {planBenefits[requiredPlan].map((benefit, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors"
          >
            Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
          </motion.button>
          <Link 
            to="/pricing"
            className="block w-full py-3 text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            View Pricing Plans
          </Link>
        </div>

        {/* Close Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Maybe later
        </button>
      </div>
    </motion.div>
  );
};

export default FeatureGate;