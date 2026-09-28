import React from 'react';
import { TOOL_CATEGORIES, CATEGORY_INFO } from '../../config/tools';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'All Tools', icon: '🎯', color: 'from-gray-500 to-gray-600' },
    ...Object.entries(CATEGORY_INFO).map(([id, info]) => ({
      id,
      name: info.name,
      icon: id === TOOL_CATEGORIES.ORGANIZE ? '📁' :
           id === TOOL_CATEGORIES.OPTIMIZE ? '⚡' :
           id === TOOL_CATEGORIES.CONVERT_TO_PDF ? '📥' :
           id === TOOL_CATEGORIES.CONVERT_FROM_PDF ? '📤' :
           id === TOOL_CATEGORIES.EDIT ? '✏️' :
           id === TOOL_CATEGORIES.SECURITY ? '🔒' : '🤖',
      color: info.color
    }))
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200
            ${selectedCategory === category.id
              ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105'
            }
          `}
        >
          <span className="text-lg">{category.icon}</span>
          <span className="font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;