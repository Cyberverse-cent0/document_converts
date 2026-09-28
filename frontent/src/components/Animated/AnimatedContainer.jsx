import React from 'react';
import { motion } from 'framer-motion';

const AnimatedContainer = ({ 
  children, 
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  className = ''
}) => {
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration, delay }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] }
      }
    },
    slideDown: {
      hidden: { opacity: 0, y: -20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] }
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 20 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: -20 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] }
      }
    }
  };

  const selectedAnimation = animations[animation] || animations.fadeIn;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={selectedAnimation}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;