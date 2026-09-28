import api from './api';
import appConfig from '../config/appConfig';
import { errorHandler } from '../utils/errorHandler';
import { ApiResponse, ConversionOptions, ConversionService } from '../types';

export const conversionService: ConversionService = {
  // Generic file conversion
  convertFile: async (file: File, mode: string = 'pdf-to-word', options: ConversionOptions = {}): Promise<ApiResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', mode);
      
      // Add any additional options
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });

      const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: appConfig.upload.timeout,
      });
      return response.data;
    } catch (error) {
      error.userMessage = errorHandler.handleConversionError(error);
      throw error;
    }
  },

  // Merge PDFs
  mergePDFs: async (files, options = {}) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });

      const response = await api.post(appConfig.api.endpoints.pdf.merge, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: appConfig.upload.timeout,
      });
      return response.data;
    } catch (error) {
      error.userMessage = errorHandler.handleConversionError(error);
      throw error;
    }
  },

  // Split PDF
  splitPDF: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add page_ranges if provided
      if (options.pageRanges) {
        formData.append('page_ranges', options.pageRanges.join(','));
      }
      
      Object.keys(options).forEach(key => {
        if (key !== 'pageRanges') {
          formData.append(key, options[key]);
        }
      });

      const response = await api.post(appConfig.api.endpoints.pdf.split, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: appConfig.upload.timeout,
      });
      return response.data;
    } catch (error) {
      error.userMessage = errorHandler.handleConversionError(error);
      throw error;
    }
  },

  // Compress PDF
  compressPDF: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add compression_level if provided
      if (options.compressionLevel) {
        formData.append('compression_level', options.compressionLevel);
      }
      
      Object.keys(options).forEach(key => {
        if (key !== 'compressionLevel') {
          formData.append(key, options[key]);
        }
      });

      const response = await api.post(appConfig.api.endpoints.pdf.compress, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: appConfig.upload.timeout,
      });
      return response.data;
    } catch (error) {
      error.userMessage = errorHandler.handleConversionError(error);
      throw error;
    }
  },

  // PDF to Word
  pdfToWord: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', 'pdf-to-word');
      
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });

      const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: appConfig.upload.timeout,
      });
      return response.data;
    } catch (error) {
      error.userMessage = errorHandler.handleConversionError(error);
      throw error;
    }
  },

  // Word to PDF
  wordToPDF: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', 'word-to-pdf');
      
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });

      const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: appConfig.upload.timeout,
      });
      return response.data;
    } catch (error) {
      error.userMessage = errorHandler.handleConversionError(error);
      throw error;
    }
  },

  // Rotate PDF
  rotatePDF: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add rotation if provided
      if (options.rotation) {
        formData.append('rotation', options.rotation.toString());
      }
      
      Object.keys(options).forEach(key => {
        if (key !== 'rotation') {
          formData.append(key, options[key]);
        }
      });

      const response = await api.post(appConfig.api.endpoints.pdf.rotate, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: appConfig.upload.timeout,
      });
      return response.data;
    } catch (error) {
      error.userMessage = errorHandler.handleConversionError(error);
      throw error;
    }
  },

  // Add Page Numbers - updated to use correct backend endpoint
  addPageNumbers: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add page number options
    if (options.position) formData.append('position', options.position);
    if (options.startNumber) formData.append('start_number', options.startNumber.toString());
    if (options.format) formData.append('format', options.format);
    if (options.fontSize) formData.append('font_size', options.fontSize.toString());
    if (options.color) formData.append('color', options.color);
    
    Object.keys(options).forEach(key => {
      if (!['position', 'startNumber', 'format', 'fontSize', 'color'].includes(key)) {
        formData.append(key, options[key]);
      }
    });

    const response = await api.post(appConfig.api.endpoints.pdf.addPageNumbers, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Add Watermark - updated to use correct backend endpoint
  addWatermark: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add watermark options
    if (options.type) formData.append('type', options.type);
    if (options.text) formData.append('text', options.text);
    if (options.position) formData.append('position', options.position);
    if (options.opacity) formData.append('opacity', options.opacity.toString());
    if (options.rotation) formData.append('rotation', options.rotation.toString());
    if (options.fontSize) formData.append('font_size', options.fontSize.toString());
    if (options.color) formData.append('color', options.color);
    
    Object.keys(options).forEach(key => {
      if (!['type', 'text', 'position', 'opacity', 'rotation', 'fontSize', 'color'].includes(key)) {
        formData.append(key, options[key]);
      }
    });

    const response = await api.post(appConfig.api.endpoints.pdf.addWatermark, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // PDF to Excel - placeholder for future implementation
  pdfToExcel: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'pdf-to-excel');
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Excel to PDF - placeholder for future implementation
  excelToPDF: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'excel-to-pdf');
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // PDF to JPG - placeholder for future implementation
  pdfToJPG: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'pdf-to-jpg');
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // JPG to PDF - placeholder for future implementation
  jpgToPDF: async (files, options = {}) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('mode', 'jpg-to-pdf');
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // PDF to PowerPoint - placeholder for future implementation
  pdfToPowerPoint: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'pdf-to-powerpoint');
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // PowerPoint to PDF - placeholder for future implementation
  powerPointToPDF: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'powerpoint-to-pdf');
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Protect PDF - placeholder for future implementation
  protectPDF: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'protect-pdf');
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Unlock PDF - placeholder for future implementation
  unlockPDF: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'unlock-pdf');
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await api.post(appConfig.api.endpoints.conversion.convert, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download file
  downloadFile: async (jobId, filename = `converted_file_${jobId}`) => {
    const response = await api.get(`${appConfig.api.endpoints.conversion.download}/${jobId}`, {
      responseType: 'blob',
    });
    
    // Create a blob from the response
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    
    // Create a link and click it programmatically
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Get job status
  getJobStatus: async (jobId) => {
    const response = await api.get('/api/jobs');
    const jobs = response.data;
    return jobs.find(job => job.id === jobId);
  },

  // Get all jobs
  getJobs: async () => {
    const response = await api.get('/api/jobs');
    return response.data;
  },

  // Cancel job - placeholder for future implementation
  cancelJob: async (jobId) => {
    // This endpoint needs to be implemented in the backend
    const response = await api.post(`/api/jobs/${jobId}/cancel`);
    return response.data;
  },

  // Delete job - placeholder for future implementation
  deleteJob: async (jobId) => {
    // This endpoint needs to be implemented in the backend
    const response = await api.delete(`/api/jobs/${jobId}`);
    return response.data;
  },
};
