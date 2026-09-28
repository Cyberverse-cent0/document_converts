import React, { useState } from 'react';
import MultiFileUpload from '../../components/FileUpload/MultiFileUpload';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { conversionService } from '../../services/conversion';

const AddWatermark = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState('#FF0000');
  const [opacity, setOpacity] = useState(30);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState('center'); // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  const [imageFile, setImageFile] = useState(null);

  const [uploadRef, uploadVisible] = useScrollAnimation(0.1);
  const [optionsRef, optionsVisible] = useScrollAnimation(0.1);

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleAddWatermark = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file');
      return;
    }

    if (watermarkType === 'text' && !text.trim()) {
      setError('Please enter watermark text');
      return;
    }

    if (watermarkType === 'image' && !imageFile) {
      setError('Please upload a watermark image');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      const file = files[0].file || files[0];
      
      const options = {
        type: watermarkType,
        text: text,
        position: position,
        opacity: opacity / 100, // Convert percentage to decimal
        rotation: rotation,
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

      const response = await conversionService.addWatermark(file, options);
      
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
      setError(err.response?.data?.message || 'Failed to add watermark. Please try again.');
      console.error('Watermark error:', err);
    }
  };

  const handleDownload = () => {
    if (jobId) {
      conversionService.downloadFile(jobId, 'watermarked.pdf');
    } else if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'watermarked.pdf';
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
    setImageFile(null);
  };

  const positions = [
    { id: 'center', label: 'Center', icon: '⬜️' },
    { id: 'top-left', label: 'Top Left', icon: '↖️' },
    { id: 'top-right', label: 'Top Right', icon: '↗️' },
    { id: 'bottom-left', label: 'Bottom Left', icon: '↙️' },
    { id: 'bottom-right', label: 'Bottom Right', icon: '↘️' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Add Watermark
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stamp an image or text over your PDF in seconds. Choose typography, transparency.
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
            {/* Watermark Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Watermark Options
              </h3>

              {/* Watermark Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Watermark Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="text"
                      checked={watermarkType === 'text'}
                      onChange={(e) => setWatermarkType(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Text</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="image"
                      checked={watermarkType === 'image'}
                      onChange={(e) => setWatermarkType(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Image</span>
                  </label>
                </div>
              </div>

              {/* Text Watermark Options */}
              {watermarkType === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter watermark text"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Font Size (pt)
                      </label>
                      <input
                        type="number"
                        min="12"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rotation (degrees)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

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
                        {['#FF0000', '#000000', '#0000FF', '#00FF00', '#FFA500'].map((color) => (
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
                </div>
              )}

              {/* Image Watermark Options */}
              {watermarkType === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Watermark Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    {imageFile && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {imageFile.name}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Common Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opacity: {opacity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                {watermarkType === 'text' ? (
                  <div 
                    className="text-center py-8"
                    style={{ 
                      color: fontColor, 
                      fontSize: `${fontSize * 0.5}pt`,
                      opacity: opacity / 100,
                      transform: `rotate(${rotation}deg)`,
                    }}
                  >
                    {text}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {imageFile ? 'Image preview' : 'No image selected'}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!downloadUrl ? (
              <button
                onClick={handleAddWatermark}
                disabled={processing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Adding watermark... {progress}%</span>
                  </span>
                ) : (
                  `Add Watermark to ${files.length} PDF${files.length > 1 ? 's' : ''}`
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full btn-primary"
                >
                  Download Watermarked PDF
                </button>
                <button
                  onClick={handleReset}
                  className="w-full btn-secondary"
                >
                  Add Watermark to Another PDF
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
            <span>Use 30-50% opacity for subtle watermarks</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Rotate text 45° for diagonal watermarks</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Use PNG images with transparency for best results</span>
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

export default AddWatermark;
