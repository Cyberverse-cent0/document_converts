import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EnhancedSearch from './EnhancedSearch';

const HeroSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('file-upload').click();
  };

  const handleFileUpload = (file) => {
    // Detect file type and navigate to appropriate tool
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    // Simple routing logic based on file type
    if (fileExtension === 'pdf') {
      navigate('/tools');
    } else if (['doc', 'docx'].includes(fileExtension)) {
      navigate('/tools/word-to-pdf');
    } else if (['xls', 'xlsx'].includes(fileExtension)) {
      navigate('/tools/excel-to-pdf');
    } else if (['ppt', 'pptx'].includes(fileExtension)) {
      navigate('/tools/powerpoint-to-pdf');
    } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      navigate('/tools/jpg-to-pdf');
    } else {
      navigate('/tools');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.5) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Every tool you need to work with{' '}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              PDFs
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            All tools are easy to use, free, and secure. Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
          
          {/* Enhanced Search */}
          <EnhancedSearch />
        </div>

        {/* Drag and Drop Upload Area */}
        <div 
          className={`max-w-3xl mx-auto transition-all duration-300 ${
            isDragging 
              ? 'scale-105 border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            />
            <label 
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-6 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
                  📄
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select PDF file
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  or drop PDF here
                </p>
                <div className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg cursor-pointer">
                  Select PDF file
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Quick Access Tools */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: '🔗', name: 'Merge PDF', route: '/tools/merge-pdf' },
            { icon: '✂️', name: 'Split PDF', route: '/tools/split-pdf' },
            { icon: '📦', name: 'Compress', route: '/tools/compress-pdf' },
            { icon: '📝', name: 'PDF to Word', route: '/tools/pdf-to-word' },
            { icon: '🔄', name: 'Rotate PDF', route: '/tools/rotate-pdf' },
            { icon: '🔒', name: 'Protect PDF', route: '/tools/protect-pdf' },
          ].map((tool) => (
            <button
              key={tool.name}
              onClick={() => navigate(tool.route)}
              className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-gray-200 dark:border-gray-700"
            >
              <span className="text-3xl mb-2">{tool.icon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;