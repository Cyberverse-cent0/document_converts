import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const RateLimitDisplay = () => {
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await api.get('/api/user/quota');
        setQuota(response.data);
      } catch (error) {
        console.error('Failed to fetch quota:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuota();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading quota...</div>;
  }

  if (!quota) {
    return null;
  }

  const percentage = (quota.daily_used / quota.daily_limit) * 100;
  const isNearLimit = percentage >= 80;

  return (
    <div className={`p-4 rounded-lg ${isNearLimit ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Daily Quota
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {quota.daily_used} / {quota.daily_limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isNearLimit ? 'bg-yellow-500' : 'bg-primary-600'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Resets in: {quota.reset_in}
      </p>
    </div>
  );
};

export default RateLimitDisplay;
