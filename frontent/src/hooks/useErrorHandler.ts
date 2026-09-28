/**
 * React hook for error handling
 */
import { useState, useCallback } from 'react';
import { errorHandler } from '../utils/errorHandler';

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleError = useCallback((err: any) => {
    errorHandler.logError(err);
    setError(errorHandler.handleApiError(err));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeAsync = useCallback(async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      clearError();
      return await asyncFn();
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);

  return {
    error,
    loading,
    handleError,
    clearError,
    executeAsync,
  };
};