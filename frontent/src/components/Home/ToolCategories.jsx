import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOL_CATEGORIES, CATEGORY_INFO, getToolsByCategory } from '../../config/tools';

const ToolCategories = () => {
  const navigate = useNavigate();

  const categories = [
    TOOL_CATEGORIES.ORGANIZE,
    TOOL_CATEGORIES.OPTIMIZE,
    TOOL_CATEGORIES.CONVERT_TO_PDF,
    TOOL_CATEGORIES.CONVERT_FROM_PDF,
    TOOL_CATEGORIES.EDIT,
    TOOL_CATEGORIES.SECURITY,
  ];

  const categoryIcons = {
    [TOOL_CATEGORIES.ORGANIZE]: '📋',
    [TOOL_CATEGORIES.OPTIMIZE]: '⚡',
    [TOOL_CATEGORIES.CONVERT_TO_PDF]: '📥',
    [TOOL_CATEGORIES.CONVERT_FROM_PDF]: '📤',
    [TOOL_CATEGORIES.EDIT]: '✏️',
    [TOOL_CATEGORIES.SECURITY]: '🔒',
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PDF Tools by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find the perfect tool for your PDF needs organized by category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const info = CATEGORY_INFO[category];
            const tools = getToolsByCategory(category);
            const icon = categoryIcons[category];

            return (
              <button
                key={category}
                onClick={() => navigate('/tools')}
                className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 text-left"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {info.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tools.length} tools
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {info.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tools.slice(0, 3).map((tool) => (
                    <span
                      key={tool.id}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                    >
                      {tool.name}
                    </span>
                  ))}
                  {tools.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      +{tools.length - 3} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToolCategories;