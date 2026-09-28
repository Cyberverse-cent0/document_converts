/**
 * Error handling utilities for the application
 */
import { ApiError, AppError } from '../types';

export const errorHandler = {
  /**
   * Handle API errors and return user-friendly messages
   */
  handleApiError: (error: any): string => {
    if (!error) {
      return 'An unknown error occurred';
    }

    // Network errors
    if (!error.response) {
      if (error.message === 'Network Error') {
        return 'Network error. Please check your internet connection and try again.';
      }
      return error.message || 'Network error. Please try again.';
    }

    // HTTP status errors
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.message || 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Session expired. Please log in again.';
      case 403:
        return data?.message || 'You do not have permission to perform this action.';
      case 404:
        return data?.message || 'The requested resource was not found.';
      case 413:
        return 'File too large. Please upload a smaller file.';
      case 415:
        return 'Unsupported file type. Please upload a valid file.';
      case 429:
        return data?.message || 'Too many requests. Please wait and try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return data?.message || `Error ${status}: Something went wrong.`;
    }
  },

  /**
   * Handle file upload errors
   */
  handleFileError: (error: any): string => {
    if (!error) {
      return 'File upload failed';
    }

    if (error.name === 'FileTooLarge') {
      return `File is too large. Maximum size is ${error.maxSize}.`;
    }

    if (error.name === 'InvalidFileType') {
      return `Invalid file type. Accepted types: ${error.acceptedTypes.join(', ')}.`;
    }

    if (error.name === 'TooManyFiles') {
      return `Too many files. Maximum is ${error.maxFiles} files.`;
    }

    return error.message || 'File upload failed. Please try again.';
  },

  /**
   * Handle conversion errors
   */
  handleConversionError: (error: any): string => {
    if (!error) {
      return 'Conversion failed';
    }

    if (error.response?.data?.error_code) {
      const errorCode = error.response.data.error_code;
      
      switch (errorCode) {
        case 'CORRUPTED_FILE':
          return 'The file appears to be corrupted and cannot be processed.';
        case 'ENCRYPTED_FILE':
          return 'The file is encrypted. Please decrypt it first.';
        case 'UNSUPPORTED_FORMAT':
          return 'This file format is not supported for conversion.';
        case 'INSUFFICIENT_QUOTA':
          return 'You have exceeded your conversion quota. Please upgrade your plan.';
        case 'PROCESSING_TIMEOUT':
          return 'Processing timed out. Please try with a smaller file.';
        default:
          return error.response.data.message || 'Conversion failed. Please try again.';
      }
    }

    return errorHandler.handleApiError(error);
  },

  /**
   * Log error for debugging
   */
  logError: (error: any, context: Record<string, any> = {}): void => {
    console.error('Error occurred:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      context,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Create error object with context
   */
  createError: (message: string, code?: string, details: Record<string, any> = {}): AppError => {
    const error = new Error(message) as AppError;
    error.code = code;
    error.details = details;
    error.timestamp = new Date().toISOString();
    return error;
  },
};