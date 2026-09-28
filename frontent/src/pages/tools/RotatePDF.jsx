import React, { useState } from 'react';
import MultiFileUpload from '../../components/FileUpload/MultiFileUpload';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { conversionService } from '../../services/conversion';

const RotatePDF = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(90); // 90, 180, 270
  const [rotationDirection, setRotationDirection] = useState('right'); // 'right' or 'left'

  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [optionsRef, optionsVisible] = useScrollAnimation(0.1);

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const handleRotate = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to rotate');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      const file = files[0].file || files[0];
      const actualRotation = getActualRotation();
      
      const options = {
        rotation: actualRotation,
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

      const response = await conversionService.rotatePDF(file, options);
      
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
      setError(err.response?.data?.message || 'Failed to rotate PDF. Please try again.');
      console.error('Rotation error:', err);
    }
  };

  const handleDownload = () => {
    if (jobId) {
      conversionService.downloadFile(jobId, 'rotated.pdf');
    } else if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'rotated.pdf';
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

  const getActualRotation = () => {
    if (rotationDirection === 'right') {
      return rotationAngle;
    }
    return 360 - rotationAngle;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Rotate PDF
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!
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
            {/* Rotation Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Rotation Options
              </h3>

              {/* Rotation Direction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rotation Direction
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="right"
                      checked={rotationDirection === 'right'}
                      onChange={(e) => setRotationDirection(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Right (Clockwise)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="left"
                      checked={rotationDirection === 'left'}
                      onChange={(e) => setRotationDirection(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Left (Counter-clockwise)</span>
                  </label>
                </div>
              </div>

              {/* Rotation Angle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rotation Angle
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[90, 180, 270].map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setRotationAngle(angle)}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200
                        ${rotationAngle === angle
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">🔄</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {angle}°
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Files will be rotated <span className="font-semibold text-primary-600 dark:text-primary-400">{getActualRotation()}° {rotationDirection}</span>
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
                onClick={handleRotate}
                disabled={processing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Rotating PDFs... {progress}%</span>
                  </span>
                ) : (
                  `Rotate ${files.length} PDF${files.length > 1 ? 's' : ''}`
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full btn-primary"
                >
                  Download Rotated PDF
                </button>
                <button
                  onClick={handleReset}
                  className="w-full btn-secondary"
                >
                  Rotate Another PDF
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
            <span>Use 90° for standard portrait/landscape switching</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Use 180° to flip documents upside down</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Multiple files will be rotated with the same settings</span>
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

export default RotatePDF;
