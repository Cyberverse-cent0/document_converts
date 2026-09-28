import api from './api';

// PDF Processing API Functions

export const pdfApi = {
  // Merge PDFs
  mergePDFs: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post('/api/pdf/merge', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Split PDF
  splitPDF: async (file, pageRanges = ['1']) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('page_ranges', pageRanges.join(','));

    const response = await api.post('/api/pdf/split', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Compress PDF
  compressPDF: async (file, compressionLevel = 'medium') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('compression_level', compressionLevel);

    const response = await api.post('/api/pdf/compress', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Rotate PDF
  rotatePDF: async (file, rotation = 90) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('rotation', rotation.toString());

    const response = await api.post('/api/pdf/rotate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Add Page Numbers
  addPageNumbers: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Default options
    const defaultOptions = {
      position: 'bottom-right',
      start_number: 1,
      format: '1',
      font_size: 12,
      color: '#000000',
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    formData.append('position', mergedOptions.position);
    formData.append('start_number', mergedOptions.start_number.toString());
    formData.append('format', mergedOptions.format);
    formData.append('font_size', mergedOptions.font_size.toString());
    formData.append('color', mergedOptions.color);

    const response = await api.post('/api/pdf/page-numbers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Add Watermark
  addWatermark: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Default options
    const defaultOptions = {
      type: 'text',
      text: 'CONFIDENTIAL',
      position: 'center',
      opacity: 0.5,
      rotation: 45,
      font_size: 48,
      color: '#CCCCCC',
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    formData.append('type', mergedOptions.type);
    formData.append('text', mergedOptions.text);
    formData.append('position', mergedOptions.position);
    formData.append('opacity', mergedOptions.opacity.toString());
    formData.append('rotation', mergedOptions.rotation.toString());
    formData.append('font_size', mergedOptions.font_size.toString());
    formData.append('color', mergedOptions.color);

    const response = await api.post('/api/pdf/watermark', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download file
  downloadFile: async (jobId) => {
    const response = await api.get(`/api/download/${jobId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get job status
  getJobStatus: async (jobId) => {
    const response = await api.get(`/api/jobs`);
    const jobs = response.data;
    return jobs.find(job => job.id === jobId);
  },

  // List all jobs
  listJobs: async () => {
    const response = await api.get('/api/jobs');
    return response.data;
  },
};

export default pdfApi;
