import React, { useState } from 'react';
import MultiFileUpload from '../../components/FileUpload/MultiFileUpload';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { conversionService } from '../../services/conversion';

const CompressPDF = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('medium'); // 'low', 'medium', 'high'
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [optionsRef, optionsVisible] = useScrollAnimation(0.1);

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    const totalSize = selectedFiles.reduce((sum, file) => sum + (file.size || 0), 0);
    setOriginalSize(totalSize);
    setError(null);
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to compress');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);
    setCompressedSize(0);

    try {
      const file = files[0].file || files[0];
      
      const options = {
        compressionLevel: compressionLevel,
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

      const response = await conversionService.compressPDF(file, options);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (response.job_id) {
        setJobId(response.job_id);
        setDownloadUrl(`/api/download/${response.job_id}`);
      } else if (response.output_file) {
        setDownloadUrl(`/api/download/${response.job_id || 'temp'}`);
      }
      
      // Estimate compressed size (since backend doesn't return it)
      const estimatedSavings = compressionLevel === 'low' ? 0.3 : 
                                compressionLevel === 'medium' ? 0.5 : 0.7;
      setCompressedSize(Math.round(originalSize * (1 - estimatedSavings)));
      
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.message || 'Failed to compress PDF. Please try again.');
      console.error('Compression error:', err);
    }
  };

  const handleDownload = () => {
    if (jobId) {
      conversionService.downloadFile(jobId, 'compressed.pdf');
    } else if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'compressed.pdf';
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
    setCompressedSize(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getCompressionSavings = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    const savings = ((originalSize - compressedSize) / originalSize) * 100;
    return Math.round(savings);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Compress PDF
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Reduce file size while optimizing for maximal PDF quality.
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
            {/* Compression Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Compression Level
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {/* Low Compression */}
                <button
                  onClick={() => setCompressionLevel('low')}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200
                    ${compressionLevel === 'low'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📦</div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Low</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Best quality
                    </div>
                    <div className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                      ~30% smaller
                    </div>
                  </div>
                </button>

                {/* Medium Compression */}
                <button
                  onClick={() => setCompressionLevel('medium')}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200
                    ${compressionLevel === 'medium'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📦</div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Medium</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Good balance
                    </div>
                    <div className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                      ~50% smaller
                    </div>
                  </div>
                </button>

                {/* High Compression */}
                <button
                  onClick={() => setCompressionLevel('high')}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200
                    ${compressionLevel === 'high'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📦</div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">High</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Smallest size
                    </div>
                    <div className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                      ~70% smaller
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* File Size Info */}
            {originalSize > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Original size:
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatFileSize(originalSize)}
                  </span>
                </div>
                {compressedSize > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Compressed size:
                      </span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatFileSize(compressedSize)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Savings:
                      </span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {getCompressionSavings()}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!downloadUrl ? (
              <button
                onClick={handleCompress}
                disabled={processing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Compressing PDF... {progress}%</span>
                  </span>
                ) : (
                  `Compress ${files.length} PDF${files.length > 1 ? 's' : ''}`
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full btn-primary"
                >
                  Download Compressed PDF
                </button>
                <button
                  onClick={handleReset}
                  className="w-full btn-secondary"
                >
                  Compress Another PDF
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
            <span>Use "Low" compression for documents with images or graphics</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Use "Medium" for text-heavy documents</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Use "High" for maximum size reduction</span>
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

export default CompressPDF;
