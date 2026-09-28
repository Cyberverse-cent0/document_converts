import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  return (
    <Link
      to={tool.route}
      className="group block"
    >
      <div className="card h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
        <div className="flex flex-col h-full">
          {/* Icon */}
          <div className="text-5xl mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            {tool.icon}
          </div>

          {/* Tool Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {tool.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
            {tool.description}
          </p>

          {/* Premium Badge */}
          {tool.isPremium && (
            <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full mb-3">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Premium
            </div>
          )}

          {/* Features Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {tool.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
              >
                {feature}
              </span>
            ))}
            {tool.features.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                +{tool.features.length - 3}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <button className="w-full btn-primary text-sm py-2 transform transition-all duration-200 group-hover:shadow-lg">
            Get Started
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;