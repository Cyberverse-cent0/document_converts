import React, { useState } from 'react';
import DropzoneUpload from '../../components/FileUpload/DropzoneUpload';
import DraggableFileList from '../../components/FileUpload/DraggableFileList';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const PdfToJpg = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageRange, setPageRange] = useState('all'); // 'all', 'range', 'first'
  const [rangeInput, setRangeInput] = useState('');
  const [quality, setQuality] = useState('high'); // 'low', 'medium', 'high'
  const [extractImages, setExtractImages] = useState(false);

  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [optionsRef, optionsVisible] = useScrollAnimation(0.1);

  const handleConvert = async () => {
    if (files.length === 0) {
      alert('Please select PDF files to convert');
      return;
    }

    if (pageRange === 'range' && !rangeInput) {
      alert('Please specify a page range');
      return;
    }

    setProcessing(true);
    setProgress(0);

    // Simulate processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    setProcessing(false);
    alert('PDF files converted to JPG successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          PDF to JPG
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convert each PDF page into a JPG or extract all images contained in a PDF.
        </p>
      </div>

      <div 
        ref={uploadRef}
        className={`card transition-all duration-700 transform ${uploadVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <DropzoneUpload
          onFilesDrop={(newFiles) => {
            const remainingSlots = 10 - files.length;
            const filesToAdd = newFiles.slice(0, remainingSlots);
            
            if (newFiles.length > remainingSlots) {
              alert(`Can only add ${remainingSlots} more files (maximum 10 total)`);
            }
            
            const filesWithIds = filesToAdd.map((file, index) => ({
              ...file,
              id: `file-${Date.now()}-${files.length + index}`
            }));
            setFiles([...files, ...filesWithIds]);
          }}
          maxFiles={10}
          acceptedTypes={['application/pdf']}
        />

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <DraggableFileList
              files={files}
              onReorder={setFiles}
              onRemove={(index) => {
                const newFiles = files.filter((_, i) => i !== index);
                setFiles(newFiles);
              }}
            />
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => setFiles([])}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Clear all files
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {files.length}/10 files
              </span>
            </div>

            {/* Conversion Options */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conversion Options
              </h3>

              {/* Page Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Range
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="all"
                      checked={pageRange === 'all'}
                      onChange={(e) => setPageRange(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">All pages</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="first"
                      checked={pageRange === 'first'}
                      onChange={(e) => setPageRange(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">First page only</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="range"
                      checked={pageRange === 'range'}
                      onChange={(e) => setPageRange(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Custom range</span>
                  </label>
                </div>
              </div>

              {/* Custom Range Input */}
              {pageRange === 'range' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Range (e.g., 1-3, 5, 7-9)
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="1-3, 5, 7-9"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image Quality
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setQuality(level)}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200
                        ${quality === level
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {level}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {level === 'low' ? 'Smaller files' : level === 'medium' ? 'Balanced' : 'Best quality'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extract Images */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extractImages}
                  onChange={(e) => setExtractImages(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Extract embedded images instead of converting pages
                </span>
              </label>
            </div>

            <button
              onClick={handleConvert}
              disabled={processing}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Converting to JPG... {progress}%</span>
                </span>
              ) : (
                `Convert ${files.length} PDF${files.length > 1 ? 's' : ''} to JPG`
              )}
            </button>

            {processing && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div 
        ref={optionsRef}
        className={`card mt-6 transition-all duration-700 transform ${optionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Tips for best results
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Use high quality for images with text or graphics</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Extract embedded images to get original quality</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Use custom ranges to convert specific pages</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Maximum file size: 50MB per file</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PdfToJpg;