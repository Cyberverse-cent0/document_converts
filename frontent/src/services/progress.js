import api from './api';

export const progressService = {
  // Subscribe to job progress updates (WebSocket or polling)
  subscribeToJob: (jobId, callbacks) => {
    // For now, implement polling. In production, use WebSocket
    let intervalId;
    let isSubscribed = true;

    const pollProgress = async () => {
      if (!isSubscribed) return;

      try {
        const response = await api.get(`/api/jobs/${jobId}/progress`);
        const progressData = response.data;

        if (callbacks.onProgress) {
          callbacks.onProgress(progressData);
        }

        // Stop polling if job is complete
        if (progressData.status === 'completed' || progressData.status === 'failed') {
          if (callbacks.onComplete) {
            callbacks.onComplete(progressData);
          }
          unsubscribe();
        }
      } catch (error) {
        if (callbacks.onError) {
          callbacks.onError(error);
        }
        if (isSubscribed) {
          unsubscribe();
        }
      }
    };

    // Start polling
    intervalId = setInterval(pollProgress, 1000); // Poll every second

    // Initial poll
    pollProgress();

    const unsubscribe = () => {
      isSubscribed = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

    return unsubscribe;
  },

  // Get current progress for a job
  getProgress: async (jobId) => {
    const response = await api.get(`/api/jobs/${jobId}/progress`);
    return response.data;
  },

  // Calculate estimated time remaining
  calculateETR: (progress, startTime) => {
    if (!progress || progress === 0) return null;
    
    const elapsed = Date.now() - startTime;
    const remaining = (elapsed / progress) * (100 - progress);
    
    return Math.round(remaining / 1000); // Return in seconds
  },

  // Format time display
  formatTime: (seconds) => {
    if (!seconds || seconds < 0) return 'Calculating...';
    
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.round(seconds / 60);
      return `${minutes}m`;
    } else {
      const hours = Math.round(seconds / 3600);
      return `${hours}h`;
    }
  },

  // Get step progress info
  getStepProgress: (currentStep, totalSteps) => {
    const stepProgress = (currentStep / totalSteps) * 100;
    return {
      currentStep,
      totalSteps,
      stepProgress,
      isComplete: currentStep === totalSteps,
    };
  },
};