import React, { useState } from 'react';
import DropzoneUpload from '../../components/FileUpload/DropzoneUpload';
import DraggableFileList from '../../components/FileUpload/DraggableFileList';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const UnlockPdf = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState({}); // Store passwords for individual files

  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [optionsRef, optionsVisible] = useScrollAnimation(0.1);

  const handleUnlock = async () => {
    if (files.length === 0) {
      alert('Please select PDF files to unlock');
      return;
    }

    // Check if all password-protected files have passwords
    const missingPasswords = files.filter(file => 
      file.passwordRequired && !passwords[file.id]
    );

    if (missingPasswords.length > 0) {
      alert('Please enter passwords for all password-protected files');
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
    alert('PDF files unlocked successfully!');
  };

  const handlePasswordChange = (fileId, value) => {
    setPasswords(prev => ({
      ...prev,
      [fileId]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Unlock PDF
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Remove PDF password security, giving you the freedom to use your PDFs.
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
              id: `file-${Date.now()}-${files.length + index}`,
              passwordRequired: Math.random() > 0.5 // Simulate password requirement
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

            {/* Password Input for Protected Files */}
            {files.some(file => file.passwordRequired) && (
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Passwords for Protected Files
                </h3>
                {files.filter(file => file.passwordRequired).map((file) => (
                  <div key={file.id} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {file.name}
                      </label>
                      <input
                        type="password"
                        value={passwords[file.id] || ''}
                        onChange={(e) => handlePasswordChange(file.id, e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Global Password (optional) */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Global Password (optional - applies to all files)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password if all files use the same password"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={handleUnlock}
              disabled={processing}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Unlocking PDFs... {progress}%</span>
                </span>
              ) : (
                `Unlock ${files.length} PDF${files.length > 1 ? 's' : ''}`
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
          Important Information
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>You must have the original password to unlock PDF files</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Only unlock PDFs that you own or have permission to access</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Unlocked PDFs will no longer have password protection</span>
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

export default UnlockPdf;