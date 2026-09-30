import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS, searchTools } from '../../config/tools';

const EnhancedSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const popularSearches = [
    'merge pdf', 'split pdf', 'compress pdf', 'pdf to word', 
    'word to pdf', 'jpg to pdf', 'rotate pdf', 'protect pdf'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save recent searches to localStorage
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      setRecentSearches(prev => {
        const filtered = prev.filter(s => s.toLowerCase() !== searchQuery.toLowerCase());
        return [searchQuery, ...filtered].slice(0, 5);
      });

      // Navigate to tools page with search query
      navigate('/tools', { state: { searchQuery } });
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 0) {
      const results = searchTools(value);
      setSuggestions(results.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="max-w-2xl mx-auto relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for PDF tools..."
          className="w-full px-6 py-4 pr-12 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all shadow-lg"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {query.length > 0 && suggestions.length > 0 ? (
            <div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Suggestions
                </span>
              </div>
              {suggestions.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => navigate(tool.route)}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {tool.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {tool.description}
                    </div>
                  </div>
                  {tool.isPremium && (
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                      PRO
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : query.length === 0 ? (
            <div>
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-900 dark:text-white">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Popular Searches
                </span>
              </div>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-gray-900 dark:text-white">{search}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🔍</div>
              <p>No tools found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;