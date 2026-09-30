import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS } from '../../config/tools';

const PopularTools = () => {
  const navigate = useNavigate();
  
  // Select popular tools based on common use cases
  const popularTools = [
    TOOLS.find(t => t.id === 'merge-pdf'),
    TOOLS.find(t => t.id === 'split-pdf'),
    TOOLS.find(t => t.id === 'compress-pdf'),
    TOOLS.find(t => t.id === 'pdf-to-word'),
    TOOLS.find(t => t.id === 'word-to-pdf'),
    TOOLS.find(t => t.id === 'jpg-to-pdf'),
    TOOLS.find(t => t.id === 'rotate-pdf'),
    TOOLS.find(t => t.id === 'protect-pdf'),
  ].filter(Boolean);

  return (
    <div className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Most Popular PDF Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The most used tools to convert PDF files online. Free and easy to use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(tool.route)}
              className="group p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                {tool.isPremium && (
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                    PRO
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {tool.description}
              </p>
              <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium">
                <span>Try it now</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/tools')}
            className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            View All Tools
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularTools;