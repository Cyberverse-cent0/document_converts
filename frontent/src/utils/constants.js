export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5280';

export const FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const CONVERSION_MODES = {
  PDF_TO_WORD: 'pdf-to-word',
  WORD_TO_PDF: 'word-to-pdf',
};

export const SCAN_STATUS = {
  PENDING: 'pending',
  SCANNING: 'scanning',
  CLEAN: 'clean',
  INFECTED: 'infected',
  FAILED: 'failed',
};

export const JOB_STATUS = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};
