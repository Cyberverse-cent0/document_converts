import React, { useState } from 'react';
import FileUpload from '../components/FileUpload/FileUpload';
import ConversionStatus from '../components/Conversion/ConversionStatus';
import DownloadButton from '../components/Conversion/DownloadButton';
import RateLimitDisplay from '../components/Security/RateLimitDisplay';
import FileScanStatus from '../components/Security/FileScanStatus';
import EncryptionStatus from '../components/Security/EncryptionStatus';
import { conversionService } from '../services/conversion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Home = () => {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('pdf-to-word');
  const [conversion, setConversion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [securityRef, securityVisible] = useScrollAnimation(0.1);

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setConversion(null);

    try {
      const result = await conversionService.convertFile(file, mode);
      setConversion({
        jobId: result.job_id,
        status: result.status,
        output_file: result.output_file,
        scan_status: result.scan_status,
        is_encrypted: result.is_encrypted,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div 
        ref={heroRef}
        className={`mb-8 transition-all duration-700 transform ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Document Converter
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Convert PDF to Word and Word to PDF with enterprise-grade security features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div 
            ref={uploadRef}
            className={`card transition-all duration-700 transform ${uploadVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <FileUpload
              onFileSelect={setFile}
              mode={mode}
              onModeChange={setMode}
            />

            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-fade-in">
                {error}
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={!file || loading}
              className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Converting...</span>
                </span>
              ) : 'Convert Document'}
            </button>
          </div>

          {conversion && (
            <div className="card animate-fade-in">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Conversion Result
              </h3>
              
              <div className="space-y-4">
                <ConversionStatus
                  status={conversion.status}
                  message="Document converted successfully"
                />

                <div className="flex flex-wrap gap-2">
                  <FileScanStatus scanStatus={conversion.scan_status} />
                  <EncryptionStatus isEncrypted={conversion.is_encrypted} />
                </div>

                {conversion.status === 'completed' && (
                  <DownloadButton
                    jobId={conversion.jobId}
                    fileName={conversion.output_file}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div 
            ref={securityRef}
            className={`card transition-all duration-700 transform ${securityVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Security Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 transform transition-all duration-300 hover:scale-105">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Malware scanning</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 transform transition-all duration-300 hover:scale-105">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Server-side encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 transform transition-all duration-300 hover:scale-105">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Rate limiting</span>
              </div>
            </div>
          </div>

          <RateLimitDisplay />
        </div>
      </div>
    </div>
  );
};

export default Home;
