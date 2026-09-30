import React from 'react';

const TrustIndicators = () => {
  const stats = [
    { value: '100M+', label: 'Files Processed', icon: '📄' },
    { value: '50M+', label: 'Happy Users', icon: '👥' },
    { value: '27', label: 'PDF Tools', icon: '🔧' },
    { value: '99.9%', label: 'Uptime', icon: '⚡' },
  ];

  const securityFeatures = [
    { icon: '🔒', title: 'End-to-End Encryption', description: 'Your files are encrypted during transfer and storage' },
    { icon: '🛡️', title: 'Secure Processing', description: 'Files are processed in secure, isolated environments' },
    { icon: '🗑️', title: 'Auto-Deletion', description: 'Files are automatically deleted after processing' },
    { icon: '✅', title: 'No Data Storage', description: 'We don\'t store your files on our servers' },
  ];

  return (
    <div className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Files Are Safe with Us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We take your privacy seriously. All files are processed securely and automatically deleted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;