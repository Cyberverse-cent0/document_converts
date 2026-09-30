import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  return (
    <Link
      to={tool.route}
      className="group block"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer">
        <div className="p-6">
          {/* Header with Icon and Premium Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              {tool.icon}
            </div>
            {tool.isPremium && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-md">
                PRO
              </span>
            )}
          </div>

          {/* Tool Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {tool.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {tool.description}
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {tool.features.slice(0, 4).map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400"
              >
                <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium group-hover:underline">
              Try it now
            </span>
            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;