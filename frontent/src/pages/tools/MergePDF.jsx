import React, { useState } from 'react';
import DropzoneUpload from '../../components/FileUpload/DropzoneUpload';
import DraggableFileList from '../../components/FileUpload/DraggableFileList';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { conversionService } from '../../services/conversion';

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [optionsRef, optionsVisible] = useScrollAnimation(0.1);

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 files to merge');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      // Extract actual File objects from the files array
      const fileObjects = files.map(f => f.file || f);
      
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
      
      // Call the merge API
      const response = await conversionService.mergePDFs(fileObjects);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (response.job_id) {
        setJobId(response.job_id);
        setDownloadUrl(`/api/download/${response.job_id}`);
      } else if (response.output_file) {
        // Create download URL from output file
        setDownloadUrl(`/api/download/${response.job_id || 'temp'}`);
      }
      
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.message || 'Failed to merge PDFs. Please try again.');
      console.error('Merge error:', err);
    }
  };

  const handleDownload = () => {
    if (jobId) {
      conversionService.downloadFile(jobId, 'merged.pdf');
    } else if (downloadUrl) {
      // Direct download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'merged.pdf';
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Merge PDF
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Combine PDFs in the order you want with the easiest PDF merger available.
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!downloadUrl ? (
              <button
                onClick={handleMerge}
                disabled={processing || files.length < 2}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Merging PDFs... {progress}%</span>
                  </span>
                ) : (
                  `Merge ${files.length} PDF${files.length > 1 ? 's' : ''}`
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full btn-primary"
                >
                  Download Merged PDF
                </button>
                <button
                  onClick={handleReset}
                  className="w-full btn-secondary"
                >
                  Merge Another PDF
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
            <span>Upload PDFs in the order you want them merged</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>All PDFs will be merged into a single document</span>
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

export default MergePDF;
