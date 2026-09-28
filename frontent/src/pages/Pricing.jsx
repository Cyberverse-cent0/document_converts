import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [plansRef, plansVisible] = useScrollAnimation(0.1);
  const [featuresRef, featuresVisible] = useScrollAnimation(0.1);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for trying out our tools',
      features: [
        '5 conversions per day',
        'Basic PDF tools',
        'Max 10MB file size',
        'Standard processing',
        'No watermarks'
      ],
      cta: 'Current Plan',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: annual ? 9.99 : 12.99,
      monthlyPrice: 12.99,
      description: 'For power users and professionals',
      features: [
        'Unlimited conversions',
        'All PDF tools',
        'Max 100MB file size',
        'Priority processing',
        'No watermarks',
        'Batch processing',
        '10GB cloud storage',
        'Email support'
      ],
      cta: 'Upgrade to Premium',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: annual ? 29.99 : 39.99,
      monthlyPrice: 39.99,
      description: 'For teams and businesses',
      features: [
        'Everything in Premium',
        'Unlimited file size',
        'API access',
        'Custom branding',
        'Priority support',
        'Team collaboration',
        'Unlimited cloud storage',
        'Advanced analytics',
        'SSO integration',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div 
        ref={headerRef}
        className={`text-center mb-12 transition-all duration-700 transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Choose the perfect plan for your PDF processing needs
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className={`text-sm ${!annual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-8 rounded-full transition-colors ${annual ? 'bg-primary-500' : 'bg-gray-300'}`}
          >
            <motion.div
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
              animate={{ left: annual ? 'auto' : '4px', right: annual ? '4px' : 'auto' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm ${annual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
            Annual
            <span className="ml-1 text-xs text-green-500 font-semibold">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div 
        ref={plansRef}
        className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 transition-all duration-700 transform ${plansVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative ${
              plan.popular 
                ? 'scale-105' 
                : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className={`card h-full ${
              plan.popular 
                ? 'border-2 border-primary-500 shadow-xl' 
                : ''
            }`}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    /month
                  </span>
                </div>
                {annual && plan.id !== 'free' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Billed annually (${(plan.price * 12).toFixed(2)}/year)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                    : plan.id === 'free'
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white cursor-default'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.cta}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features Comparison */}
      <div 
        ref={featuresRef}
        className={`card transition-all duration-700 transform ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Feature
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Free
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-primary-600 dark:text-primary-400">
                  Premium
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Daily Conversions', free: '5', premium: 'Unlimited', enterprise: 'Unlimited' },
                { feature: 'File Size Limit', free: '10MB', premium: '100MB', enterprise: 'Unlimited' },
                { feature: 'PDF Tools', free: 'Basic', premium: 'All', enterprise: 'All + Custom' },
                { feature: 'Processing Speed', free: 'Standard', premium: 'Priority', enterprise: 'Priority' },
                { feature: 'Batch Processing', free: '❌', premium: '✅', enterprise: '✅' },
                { feature: 'Cloud Storage', free: '❌', premium: '10GB', enterprise: 'Unlimited' },
                { feature: 'API Access', free: '❌', premium: '❌', enterprise: '✅' },
                { feature: 'Support', free: 'Community', premium: 'Email', enterprise: 'Priority + Dedicated' }
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-600 dark:text-gray-400">
                    {row.free}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900 dark:text-white font-medium">
                    {row.premium}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900 dark:text-white font-medium">
                    {row.enterprise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I change plans anytime?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Is there a free trial?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes, we offer a 14-day free trial for Premium and Enterprise plans with full feature access.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I cancel my subscription?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes, you can cancel anytime. You'll continue to have access until the end of your billing period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;