// Animation utilities for the application

import { keyframes, Keyframes } from '@emotion/react';

// Keyframe animations
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const slideInRight = keyframes`
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const slideInLeft = keyframes`
  from { transform: translateX(-30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const slideInUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Animation timing functions
export const timings = {
  fast: '0.2s',
  normal: '0.4s',
  slow: '0.6s',
};

// Easing functions
export const easings = {
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
};

// Animation presets
export const animationPresets = {
  fadeIn: `${fadeIn} ${timings.normal} ${easings.standard} forwards`,
  fadeOut: `${fadeOut} ${timings.normal} ${easings.standard} forwards`,
  slideInRight: `${slideInRight} ${timings.normal} ${easings.decelerate} forwards`,
  slideInLeft: `${slideInLeft} ${timings.normal} ${easings.decelerate} forwards`,
  slideInUp: `${slideInUp} ${timings.normal} ${easings.decelerate} forwards`,
  pulse: `${pulse} ${timings.slow} ${easings.standard} infinite`,
  rotate: `${rotate} 2s linear infinite`,
  shimmer: `${shimmer} 2.5s ${easings.standard} infinite`,
};

// Staggered animation helpers
export function getStaggerDelay(index: number, baseDelay: number = 0.1): string {
  return `${baseDelay * index}s`;
}

// Page transition variants for Framer Motion (if used)
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.decelerate,
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: easings.accelerate,
    },
  },
};

// Card/element hover animations
export const hoverStyles = {
  card: {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
    },
  },
  button: {
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(76, 175, 80, 0.25)',
    },
  },
  icon: {
    transition: 'transform 0.2s ease, color 0.2s ease',
    '&:hover': {
      transform: 'scale(1.15)',
      color: '#4CAF50',
    },
  },
};
