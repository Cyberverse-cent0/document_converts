import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TOOLS, TOOL_CATEGORIES, getToolsByCategory, searchTools } from '../config/tools';
import ToolGrid from '../components/Tools/ToolGrid';
import CategoryFilter from '../components/Tools/CategoryFilter';
import ToolSearch from '../components/Tools/ToolSearch';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ToolsDashboard = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [filterRef, filterVisible] = useScrollAnimation(0.1);
  const [gridRef, gridVisible] = useScrollAnimation(0.1);

  // Handle search query from home page navigation
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  const filteredTools = useMemo(() => {
    let result = TOOLS;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = getToolsByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      result = searchTools(searchQuery).filter(tool => 
        selectedCategory === 'all' || tool.category === selectedCategory
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setLoading(true);
    // Simulate loading for better UX
    setTimeout(() => setLoading(false), 300);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className={`mb-8 transition-all duration-700 transform ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
          PDF Tools
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Every tool you need to work with PDFs in one place. All are easy to use!
        </p>
      </div>

      {/* Search and Filter Section */}
      <div 
        ref={filterRef}
        className={`mb-8 transition-all duration-700 transform ${filterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <ToolSearch onSearch={handleSearch} placeholder="Search PDF tools..." />
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
        />
      </div>

      {/* Tools Grid */}
      <div 
        ref={gridRef}
        className={`transition-all duration-700 transform ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <ToolGrid tools={filteredTools} loading={loading} />
      </div>

      {/* Results Count */}
      {filteredTools.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredTools.length} of {TOOLS.length} tools
        </div>
      )}
    </div>
  );
};

export default ToolsDashboard;