/**
 * File type constants
 */
export const FILE_TYPES = {
  PDF: 'application/pdf',
  JPG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  WORD: 'application/msword',
  WORDX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  EXCEL: 'application/vnd.ms-excel',
  EXCELX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  POWERPOINT: 'application/vnd.ms-powerpoint',
  POWERPOINTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  HTML: 'text/html',
  TEXT: 'text/plain'
};

/**
 * File size limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
  SMALL: 5 * 1024 * 1024,      // 5MB
  MEDIUM: 25 * 1024 * 1024,    // 25MB
  LARGE: 50 * 1024 * 1024,     // 50MB
  EXTRA_LARGE: 100 * 1024 * 1024 // 100MB
};

/**
 * Accepted file types by tool
 */
export const ACCEPTED_TYPES_BY_TOOL = {
  'merge-pdf': [FILE_TYPES.PDF],
  'split-pdf': [FILE_TYPES.PDF],
  'compress-pdf': [FILE_TYPES.PDF],
  'pdf-to-word': [FILE_TYPES.PDF],
  'word-to-pdf': [FILE_TYPES.WORD, FILE_TYPES.WORDX],
  'pdf-to-excel': [FILE_TYPES.PDF],
  'excel-to-pdf': [FILE_TYPES.EXCEL, FILE_TYPES.EXCELX],
  'pdf-to-powerpoint': [FILE_TYPES.PDF],
  'powerpoint-to-pdf': [FILE_TYPES.POWERPOINT, FILE_TYPES.POWERPOINTX],
  'jpg-to-pdf': [FILE_TYPES.JPG, FILE_TYPES.PNG, FILE_TYPES.GIF],
  'pdf-to-jpg': [FILE_TYPES.PDF],
  'html-to-pdf': [FILE_TYPES.HTML],
  'ocr-pdf': [FILE_TYPES.PDF, FILE_TYPES.JPG, FILE_TYPES.PNG]
};

/**
 * Validate file type
 */
export const validateFileType = (file, acceptedTypes) => {
  if (!acceptedTypes || acceptedTypes.length === 0) {
    return { valid: true };
  }

  const isValid = acceptedTypes.includes(file.type);
  return {
    valid: isValid,
    error: isValid ? null : `File type ${file.type} is not supported. Accepted types: ${acceptedTypes.join(', ')}`
  };
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSize = FILE_SIZE_LIMITS.LARGE) => {
  const isValid = file.size <= maxSize;
  const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0);
  
  return {
    valid: isValid,
    error: isValid ? null : `File size must be less than ${maxSizeMB}MB`
  };
};

/**
 * Validate file name
 */
export const validateFileName = (file) => {
  const name = file.name;
  const isValid = name.length > 0 && name.length <= 255;
  
  return {
    valid: isValid,
    error: isValid ? null : 'File name must be between 1 and 255 characters'
  };
};

/**
 * Validate file extension
 */
export const validateFileExtension = (file, allowedExtensions = []) => {
  if (allowedExtensions.length === 0) {
    return { valid: true };
  }

  const extension = name.substring(name.lastIndexOf('.')).toLowerCase();
  const isValid = allowedExtensions.includes(extension);
  
  return {
    valid: isValid,
    error: isValid ? null : `File extension ${extension} is not allowed`
  };
};

/**
 * Comprehensive file validation
 */
export const validateFile = (file, options = {}) => {
  const {
    acceptedTypes = [],
    maxSize = FILE_SIZE_LIMITS.LARGE,
    allowedExtensions = [],
    checkFileName = true
  } = options;

  const errors = [];

  // Validate file type
  if (acceptedTypes.length > 0) {
    const typeValidation = validateFileType(file, acceptedTypes);
    if (!typeValidation.valid) {
      errors.push(typeValidation.error);
    }
  }

  // Validate file size
  const sizeValidation = validateFileSize(file, maxSize);
  if (!sizeValidation.valid) {
    errors.push(sizeValidation.error);
  }

  // Validate file name
  if (checkFileName) {
    const nameValidation = validateFileName(file);
    if (!nameValidation.valid) {
      errors.push(nameValidation.error);
    }
  }

  // Validate file extension
  if (allowedExtensions.length > 0) {
    const extValidation = validateFileExtension(file, allowedExtensions);
    if (!extValidation.valid) {
      errors.push(extValidation.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate multiple files
 */
export const validateFiles = (files, options = {}) => {
  const {
    maxFiles = 10,
    ...validationOptions
  } = options;

  const errors = [];
  const validFiles = [];

  // Check file count
  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed`);
    return {
      valid: false,
      errors,
      validFiles: []
    };
  }

  // Validate each file
  files.forEach((file, index) => {
    const validation = validateFile(file, validationOptions);
    if (validation.valid) {
      validFiles.push(file);
    } else {
      errors.push(`${file.name}: ${validation.errors.join(', ')}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    validFiles
  };
};

/**
 * Get file type from MIME type
 */
export const getFileType = (mimeType) => {
  const typeMap = {
    [FILE_TYPES.PDF]: 'PDF',
    [FILE_TYPES.JPG]: 'Image',
    [FILE_TYPES.PNG]: 'Image',
    [FILE_TYPES.GIF]: 'Image',
    [FILE_TYPES.WORD]: 'Word',
    [FILE_TYPES.WORDX]: 'Word',
    [FILE_TYPES.EXCEL]: 'Excel',
    [FILE_TYPES.EXCELX]: 'Excel',
    [FILE_TYPES.POWERPOINT]: 'PowerPoint',
    [FILE_TYPES.POWERPOINTX]: 'PowerPoint',
    [FILE_TYPES.HTML]: 'HTML',
    [FILE_TYPES.TEXT]: 'Text'
  };

  return typeMap[mimeType] || 'Unknown';
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get file icon based on type
 */
export const getFileIcon = (file) => {
  const type = file.type;
  
  if (type === FILE_TYPES.PDF) return '📄';
  if (type.startsWith('image/')) return '🖼️';
  if (type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return '📝';
  if (type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) return '📈';
  if (type.includes('powerpoint') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) return '📊';
  if (type === FILE_TYPES.HTML) return '🌐';
  
  return '📁';
};

/**
 * Check if file is empty
 */
export const isFileEmpty = (file) => {
  return file.size === 0;
};

/**
 * Sanitize file name
 */
export const sanitizeFileName = (fileName) => {
  // Remove special characters and replace with underscores
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .trim();
};