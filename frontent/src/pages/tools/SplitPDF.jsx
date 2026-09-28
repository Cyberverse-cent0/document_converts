import React, { useState } from 'react';
import MultiFileUpload from '../../components/FileUpload/MultiFileUpload';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { conversionService } from '../../services/conversion';
import { progressService } from '../../services/progress';

const SplitPDF = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [splitMode, setSplitMode] = useState('range'); // 'range' or 'every'
  const [pageRange, setPageRange] = useState('');
  const [splitEvery, setSplitEvery] = useState(1);

  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [optionsRef, optionsVisible] = useScrollAnimation(0.1);

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const handleSplit = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to split');
      return;
    }

    if (splitMode === 'range' && !pageRange) {
      setError('Please specify a page range');
      return;
    }

    if (splitMode === 'every' && splitEvery < 1) {
      setError('Please specify a valid number of pages');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      const file = files[0].file || files[0];
      
      const options = {
        split_mode: splitMode,
        page_range: splitMode === 'range' ? pageRange : undefined,
        split_every: splitMode === 'every' ? splitEvery : undefined,
      };

      const response = await conversionService.splitPDF(file, options);
      
      if (response.job_id) {
        setJobId(response.job_id);
        
        const unsubscribe = progressService.subscribeToJob(response.job_id, {
          onProgress: (progressData) => {
            setProgress(progressData.progress || 0);
          },
          onComplete: (result) => {
            setProcessing(false);
            setProgress(100);
            if (result.download_url) {
              setDownloadUrl(result.download_url);
            }
          },
          onError: (err) => {
            setProcessing(false);
            setError('Failed to split PDF. Please try again.');
            console.error('Split error:', err);
          }
        });
      } else if (response.download_url) {
        setProcessing(false);
        setProgress(100);
        setDownloadUrl(response.download_url);
      }
    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.message || 'Failed to split PDF. Please try again.');
      console.error('Split error:', err);
    }
  };

  const handleDownload = () => {
    if (jobId) {
      conversionService.downloadFile(jobId, 'split_pdfs.zip');
    } else if (downloadUrl) {
      window.open(downloadUrl, '_blank');
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Split PDF
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Separate one page or a whole set for easy conversion into independent PDF files.
        </p>
      </div>

      <div 
        ref={uploadRef}
        className={`card transition-all duration-700 transform ${uploadVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <MultiFileUpload
          onFilesSelect={handleFilesSelect}
          maxFiles={1}
          acceptedTypes={['application/pdf']}
        />

        {files.length > 0 && (
          <div className="mt-6 space-y-6">
            {/* Split Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Split Options
              </h3>

              {/* Split Mode Selection */}
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="range"
                    checked={splitMode === 'range'}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Page Range</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="every"
                    checked={splitMode === 'every'}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Every N Pages</span>
                </label>
              </div>

              {/* Page Range Input */}
              {splitMode === 'range' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Range (e.g., 1-3, 5, 7-9)
                  </label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="1-3, 5, 7-9"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}

              {/* Split Every Input */}
              {splitMode === 'every' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Split Every N Pages
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={splitEvery}
                    onChange={(e) => setSplitEvery(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!downloadUrl ? (
              <button
                onClick={handleSplit}
                disabled={processing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Splitting PDF... {progress}%</span>
                  </span>
                ) : (
                  'Split PDF'
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full btn-primary"
                >
                  Download Split PDFs
                </button>
                <button
                  onClick={handleReset}
                  className="w-full btn-secondary"
                >
                  Split Another PDF
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
            <span>Use page ranges like "1-3" to extract specific pages</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Separate multiple ranges with commas: "1-3, 5, 7-9"</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Use "Every N Pages" to split document into equal parts</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Maximum file size: 50MB</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SplitPDF;