import React from 'react';

const EncryptionStatus = ({ isEncrypted }) => {
  if (!isEncrypted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span className="text-sm font-medium">Encrypted</span>
    </div>
  );
};

export default EncryptionStatus;
