/**
 * Application configuration
 * Centralized configuration management for the frontend application
 */

const appConfig = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5280',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    endpoints: {
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        logout: '/api/auth/logout',
        me: '/api/auth/me',
      },
      conversion: {
        convert: '/api/convert',
        download: '/api/download',
        jobs: '/api/jobs',
      },
      pdf: {
        merge: '/api/pdf/merge',
        split: '/api/pdf/split',
        compress: '/api/pdf/compress',
        rotate: '/api/pdf/rotate',
        protect: '/api/pdf/protect',
        unlock: '/api/pdf/unlock',
        addPageNumbers: '/api/pdf/page-numbers',
        addWatermark: '/api/pdf/watermark',
        toWord: '/api/pdf/to-word',
        toExcel: '/api/pdf/to-excel',
        toJpg: '/api/pdf/to-jpg',
        toPowerPoint: '/api/pdf/to-powerpoint',
      },
      word: {
        toPdf: '/api/word/to-pdf',
      },
      excel: {
        toPdf: '/api/excel/to-pdf',
      },
      jpg: {
        toPdf: '/api/jpg/to-pdf',
      },
      powerpoint: {
        toPdf: '/api/powerpoint/to-pdf',
      },
      user: {
        stats: '/api/user/stats',
        recentFiles: '/api/user/recent-files',
        storage: '/api/user/storage',
        activity: '/api/user/activity',
        quota: '/api/user/quota',
        profile: '/api/user/profile',
        history: '/api/user/history',
        files: '/api/user/files',
        sharedFiles: '/api/user/shared-files',
      },
    },
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 52428800, // 50MB default
    maxFilesPerBatch: parseInt(import.meta.env.VITE_MAX_FILES_PER_BATCH) || 10,
    allowedFileTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'
    ],
    chunkSize: 5242880, // 5MB chunks for large files
    timeout: 60000, // 60 seconds for upload
  },

  // Rate Limiting
  rateLimit: {
    requests: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS) || 100,
    window: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW) || 60000, // 60 seconds
  },

  // Feature Flags
  features: {
    dashboard: import.meta.env.VITE_ENABLE_DASHBOARD !== 'false',
    history: import.meta.env.VITE_ENABLE_HISTORY !== 'false',
    sharing: import.meta.env.VITE_ENABLE_SHARING !== 'false',
    premiumFeatures: import.meta.env.VITE_ENABLE_PREMIUM_FEATURES !== 'false',
    dragAndDrop: true,
    progressTracking: true,
    errorRecovery: true,
  },

  // Storage Configuration
  storage: {
    defaultLimit: parseInt(import.meta.env.VITE_DEFAULT_STORAGE_LIMIT) || 104857600, // 100MB
    warningThreshold: parseFloat(import.meta.env.VITE_STORAGE_WARNING_THRESHOLD) || 0.8, // 80%
    cleanupInterval: 86400000, // 24 hours
  },

  // UI Configuration
  ui: {
    theme: {
      default: 'light',
      supported: ['light', 'dark'],
    },
    animation: {
      duration: 300,
      easing: 'ease-in-out',
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
    },
  },

  // Performance Configuration
  performance: {
    enableCaching: true,
    cacheTimeout: 300000, // 5 minutes
    lazyLoadComponents: true,
    debounceDelay: 300,
    throttleDelay: 100,
  },

  // Debug Configuration
  debug: import.meta.env.VITE_DEBUG === 'true',

  // Error Handling
  errors: {
    maxRetries: 3,
    retryDelay: 1000,
    enableLogging: true,
  },

  // Validation Rules
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
    filename: {
      maxLength: 255,
      forbiddenChars: /[<>:"/\\|?*]/,
    },
  },

  // Processing Configuration
  processing: {
    pollInterval: 1000, // 1 second
    maxPollTime: 300000, // 5 minutes
    progressUpdateInterval: 500, // 500ms
  },

  // Tool Configuration
  tools: {
    mergePDF: {
      maxFiles: 10,
      maxSizePerFile: 52428800, // 50MB
    },
    splitPDF: {
      maxFiles: 1,
      maxSizePerFile: 52428800,
    },
    compressPDF: {
      maxFiles: 10,
      maxSizePerFile: 52428800,
      compressionLevels: ['low', 'medium', 'high'],
    },
    pdfToWord: {
      maxFiles: 10,
      maxSizePerFile: 52428800,
      outputFormats: ['docx', 'doc'],
    },
    wordToPDF: {
      maxFiles: 10,
      maxSizePerFile: 52428800,
      pageSizes: ['a4', 'letter', 'legal'],
      orientations: ['auto', 'portrait', 'landscape'],
    },
    rotatePDF: {
      maxFiles: 10,
      maxSizePerFile: 52428800,
      angles: [90, 180, 270],
      directions: ['right', 'left'],
    },
  },
};

/**
 * Get configuration value by path
 * @param {string} path - Dot notation path (e.g., 'api.baseUrl')
 * @returns {*} Configuration value
 */
export const getConfig = (path) => {
  const keys = path.split('.');
  let value = appConfig;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};

/**
 * Check if a feature is enabled
 * @param {string} featureName - Name of the feature
 * @returns {boolean} Feature enabled status
 */
export const isFeatureEnabled = (featureName) => {
  return appConfig.features[featureName] === true;
};

/**
 * Get tool configuration
 * @param {string} toolName - Name of the tool
 * @returns {object} Tool configuration
 */
export const getToolConfig = (toolName) => {
  return appConfig.tools[toolName] || {};
};

export default appConfig;
