import React, { useState } from 'react';
import MultiFileUpload from '../../components/FileUpload/MultiFileUpload';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { conversionService } from '../../services/conversion';
import { progressService } from '../../services/progress';

const WordToPDF = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [pageOrientation, setPageOrientation] = useState('auto'); // 'auto', 'portrait', 'landscape'
  const [pageSize, setPageSize] = useState('a4'); // 'a4', 'letter', 'legal'

  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [optionsRef, optionsVisible] = useScrollAnimation(0.1);

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select a Word file to convert');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      const file = files[0].file || files[0];
      
      const options = {
        page_orientation: pageOrientation,
        page_size: pageSize,
      };

      const response = await conversionService.wordToPDF(file, options);
      
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
            setError('Failed to convert Word to PDF. Please try again.');
            console.error('Conversion error:', err);
          }
        });
      } else if (response.download_url) {
        setProcessing(false);
        setProgress(100);
        setDownloadUrl(response.download_url);
      }
    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.message || 'Failed to convert Word to PDF. Please try again.');
      console.error('Conversion error:', err);
    }
  };

  const handleDownload = () => {
    if (jobId) {
      conversionService.downloadFile(jobId, 'converted.pdf');
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
          Word to PDF
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Make DOC and DOCX files easy to read by converting them to PDF.
        </p>
      </div>

      <div 
        ref={uploadRef}
        className={`card transition-all duration-700 transform ${uploadVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <MultiFileUpload
          onFilesSelect={handleFilesSelect}
          maxFiles={10}
          acceptedTypes={[
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ]}
        />

        {files.length > 0 && (
          <div className="mt-6 space-y-6">
            {/* Conversion Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conversion Options
              </h3>

              {/* Page Orientation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Orientation
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="auto"
                      checked={pageOrientation === 'auto'}
                      onChange={(e) => setPageOrientation(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Auto</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="portrait"
                      checked={pageOrientation === 'portrait'}
                      onChange={(e) => setPageOrientation(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Portrait</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="landscape"
                      checked={pageOrientation === 'landscape'}
                      onChange={(e) => setPageOrientation(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Landscape</span>
                  </label>
                </div>
              </div>

              {/* Page Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page Size
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="letter">Letter (8.5 × 11 in)</option>
                  <option value="legal">Legal (8.5 × 14 in)</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!downloadUrl ? (
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
                    <span>Converting to PDF... {progress}%</span>
                  </span>
                ) : (
                  `Convert ${files.length} Word file${files.length > 1 ? 's' : ''} to PDF`
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full btn-primary"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleReset}
                  className="w-full btn-secondary"
                >
                  Convert Another Word File
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
            <span>Use "Auto" orientation to preserve document's original layout</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>A4 is the standard page size for most documents</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>DOCX files convert better than older DOC format</span>
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

export default WordToPDF;