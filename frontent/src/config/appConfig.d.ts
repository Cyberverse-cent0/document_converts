declare const appConfig: {
  api: {
    baseUrl: string;
    timeout: number;
    endpoints: {
      auth: {
        login: string;
        register: string;
        logout: string;
        me: string;
      };
      conversion: {
        convert: string;
        download: string;
        jobs: string;
      };
      pdf: {
        merge: string;
        split: string;
        compress: string;
        rotate: string;
        protect: string;
        unlock: string;
        addPageNumbers: string;
        addWatermark: string;
        toWord: string;
        toExcel: string;
        toJpg: string;
        toPowerPoint: string;
      };
      word: {
        toPdf: string;
      };
      excel: {
        toPdf: string;
      };
      jpg: {
        toPdf: string;
      };
      powerpoint: {
        toPdf: string;
      };
      user: {
        stats: string;
        recentFiles: string;
        storage: string;
        activity: string;
        quota: string;
        profile: string;
        history: string;
        files: string;
        sharedFiles: string;
      };
    };
  };
  upload: {
    maxFileSize: number;
    maxFilesPerBatch: number;
    allowedFileTypes: string[];
    chunkSize: number;
    timeout: number;
  };
  rateLimit: {
    requests: number;
    window: number;
  };
  features: {
    dashboard: boolean;
    history: boolean;
    sharing: boolean;
    premiumFeatures: boolean;
    dragAndDrop: boolean;
    progressTracking: boolean;
    errorRecovery: boolean;
  };
  storage: {
    defaultLimit: number;
    warningThreshold: number;
    cleanupInterval: number;
  };
  ui: {
    theme: {
      default: string;
      supported: string[];
    };
    animation: {
      duration: number;
      easing: string;
    };
    pagination: {
      defaultPageSize: number;
      pageSizeOptions: number[];
    };
  };
  performance: {
    enableCaching: boolean;
    cacheTimeout: number;
    lazyLoadComponents: boolean;
    debounceDelay: number;
    throttleDelay: number;
  };
  debug: boolean;
  errors: {
    maxRetries: number;
    retryDelay: number;
    enableLogging: boolean;
  };
  validation: {
    email: RegExp;
    password: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    filename: {
      maxLength: number;
      forbiddenChars: RegExp;
    };
  };
  processing: {
    pollInterval: number;
    maxPollTime: number;
    progressUpdateInterval: number;
  };
  tools: {
    [key: string]: {
      maxFiles: number;
      maxSizePerFile: number;
      [key: string]: any;
    };
  };
};

export default appConfig;