import React, { useState } from 'react';
import MultiFileUpload from '../../components/FileUpload/MultiFileUpload';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { conversionService } from '../../services/conversion';

const AddPageNumbers = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [position, setPosition] = useState('bottom-right'); // 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'
  const [startFrom, setStartFrom] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [fontColor, setFontColor] = useState('#000000');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');

  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [optionsRef, optionsVisible] = useScrollAnimation(0.1);

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const handleAddNumbers = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      const file = files[0].file || files[0];
      
      // Build format string from prefix and suffix
      let format = '1';
      if (prefix && suffix) {
        format = `${prefix}{n}${suffix}`;
      } else if (prefix) {
        format = `${prefix}{n}`;
      } else if (suffix) {
        format = `{n}${suffix}`;
      }

      const options = {
        position: position,
        startNumber: startFrom,
        format: format,
        fontSize: fontSize,
        color: fontColor,
      };

      // Simulate progress for better UX since backend returns immediately
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await conversionService.addPageNumbers(file, options);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (response.job_id) {
        setJobId(response.job_id);
        setDownloadUrl(`/api/download/${response.job_id}`);
      } else if (response.output_file) {
        setDownloadUrl(`/api/download/${response.job_id || 'temp'}`);
      }
      
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.message || 'Failed to add page numbers. Please try again.');
      console.error('Page numbers error:', err);
    }
  };

  const handleDownload = () => {
    if (jobId) {
      conversionService.downloadFile(jobId, 'numbered.pdf');
    } else if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'numbered.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setProcessing(false);
    setProgress(0);
    setError(null);
    setJobId(null);
    setDownloadUrl(null);
  };

  const positions = [
    { id: 'top-left', label: 'Top Left', icon: '↖️' },
    { id: 'top-center', label: 'Top Center', icon: '⬆️' },
    { id: 'top-right', label: 'Top Right', icon: '↗️' },
    { id: 'bottom-left', label: 'Bottom Left', icon: '↙️' },
    { id: 'bottom-center', label: 'Bottom Center', icon: '⬇️' },
    { id: 'bottom-right', label: 'Bottom Right', icon: '↘️' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Add Page Numbers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.
        </p>
      </div>

      <div 
        ref={uploadRef}
        className={`card transition-all duration-700 transform ${uploadVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <MultiFileUpload
          onFilesSelect={handleFilesSelect}
          maxFiles={10}
          acceptedTypes={['application/pdf']}
        />

        {files.length > 0 && (
          <div className="mt-6 space-y-6">
            {/* Page Number Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Page Number Options
              </h3>

              {/* Position Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Position
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {positions.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setPosition(pos.id)}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200
                        ${position === pos.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">{pos.icon}</div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          {pos.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Numbering Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start From
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startFrom}
                    onChange={(e) => setStartFrom(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size (pt)
                  </label>
                  <input
                    type="number"
                    min="8"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Text Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prefix (optional)
                  </label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="e.g., Page "
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suffix (optional)
                  </label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="e.g., of 10"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Font Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <div className="flex space-x-2">
                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setFontColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          fontColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Preview: <span className="font-semibold" style={{ color: fontColor, fontSize: `${fontSize}pt` }}>
                    {prefix}{startFrom}{suffix}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!downloadUrl ? (
              <button
                onClick={handleAddNumbers}
                disabled={processing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Adding page numbers... {progress}%</span>
                  </span>
                ) : (
                  `Add Page Numbers to ${files.length} PDF${files.length > 1 ? 's' : ''}`
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full btn-primary"
                >
                  Download Numbered PDF
                </button>
                <button
                  onClick={handleReset}
                  className="w-full btn-secondary"
                >
                  Add Numbers to Another PDF
                </button>
              </div>
            )}

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
            <span>Use larger font sizes (12-14pt) for better readability</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Choose a position that doesn't overlap with content</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Use prefixes/suffixes for custom numbering formats</span>
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

export default AddPageNumbers;
