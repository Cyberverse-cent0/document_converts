import React from 'react';

const ActivityTimeline = ({ activities = [] }) => {
  // Ensure activities is always an array
  const safeActivities = Array.isArray(activities) ? activities : [];
  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case 'conversion':
        const toolIcons = {
          'merge-pdf': '🔗',
          'split-pdf': '✂️',
          'compress-pdf': '📦',
          'pdf-to-word': '📝',
          'word-to-pdf': '📝',
          'rotate-pdf': '🔄',
          'add-page-numbers': '🔢',
          'add-watermark': '💧'
        };
        return toolIcons[activity.tool] || '📄';
      case 'signup':
        return '🎉';
      case 'upload':
        return '📤';
      case 'download':
        return '📥';
      case 'share':
        return '🔗';
      default:
        return '📌';
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'conversion':
        return `Converted ${activity.files} file${activity.files > 1 ? 's' : ''} using ${activity.tool}`;
      case 'signup':
        return 'Account created';
      case 'upload':
        return `Uploaded ${activity.files} file${activity.files > 1 ? 's' : ''}`;
      case 'download':
        return `Downloaded ${activity.files} file${activity.files > 1 ? 's' : ''}`;
      case 'share':
        return `Shared ${activity.files} file${activity.files > 1 ? 's' : ''}`;
      default:
        return 'Activity';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (safeActivities.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Activity
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p>No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {safeActivities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-lg">
              {getActivityIcon(activity)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                {getActivityDescription(activity)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(activity.date)}
              </p>
            </div>

            {/* Status Indicator */}
            <div className={`flex-shrink-0 w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-sm text-primary-600 dark:text-primary-400 hover:underline">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default ActivityTimeline;