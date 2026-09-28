import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '',
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 }
}) => {
  const buttonVariants = {
    primary: 'btn-primary',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonVariants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      whileHover={disabled ? {} : whileHover}
      whileTap={disabled ? {} : whileTap}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;