import api from './api';

export const dashboardService = {
  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/api/user/stats');
    return response.data;
  },

  // Get recent files
  getRecentFiles: async (limit = 10) => {
    const response = await api.get(`/api/user/recent-files?limit=${limit}`);
    return response.data;
  },

  // Get storage usage
  getStorageUsage: async () => {
    const response = await api.get('/api/user/storage');
    return response.data;
  },

  // Get activity timeline
  getActivityTimeline: async (limit = 20) => {
    const response = await api.get(`/api/user/activity?limit=${limit}`);
    return response.data;
  },

  // Get user quota information
  getUserQuota: async () => {
    const response = await api.get('/api/user/quota');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/user/profile', profileData);
    return response.data;
  },

  // Get conversion history
  getConversionHistory: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/api/user/history?${queryParams}`);
    return response.data;
  },

  // Delete file from history
  deleteFile: async (fileId) => {
    const response = await api.delete(`/api/user/files/${fileId}`);
    return response.data;
  },

  // Get file details
  getFileDetails: async (fileId) => {
    const response = await api.get(`/api/user/files/${fileId}`);
    return response.data;
  },

  // Re-download converted file
  redownloadFile: async (fileId) => {
    const response = await api.get(`/api/user/files/${fileId}/download`, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `file_${fileId}`);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Share file
  shareFile: async (fileId, options = {}) => {
    const response = await api.post(`/api/user/files/${fileId}/share`, options);
    return response.data;
  },

  // Get shared files
  getSharedFiles: async () => {
    const response = await api.get('/api/user/shared-files');
    return response.data;
  },
};