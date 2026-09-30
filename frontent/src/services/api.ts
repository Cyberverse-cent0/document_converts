import axios, { AxiosInstance, AxiosResponse } from 'axios';
import appConfig from '../config/appConfig.js';
import { errorHandler } from '../utils/errorHandler';
import { ApiError } from '../types';

const api: AxiosInstance = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    if ((appConfig as any).debug) {
      (config as any).metadata = { startTime: new Date() };
    }
    
    return config;
  },
  (error) => {
    errorHandler.logError(error, { context: 'request_interceptor' });
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time in debug mode
    if ((appConfig as any).debug && (response.config as any).metadata) {
      const duration = new Date().getTime() - (response.config as any).metadata.startTime.getTime();
      console.log(`API Request completed in ${duration}ms`, {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
      });
    }
    return response;
  },
  (error: ApiError) => {
    // Log error for debugging
    if (appConfig.errors.enableLogging) {
      errorHandler.logError(error, { context: 'response_interceptor' });
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Add user-friendly error message
    if (error.response?.data) {
      error.userMessage = errorHandler.handleApiError(error);
    }

    return Promise.reject(error);
  }
);

export default api;
