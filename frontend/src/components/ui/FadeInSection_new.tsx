import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Animation directions
type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

// Create keyframes for each animation direction
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

interface FadeInSectionProps extends BoxProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  threshold?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

// Styled container for the animations
const AnimatedBox = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'visible' && 
    prop !== 'animDirection' && 
    prop !== 'animDuration' && 
    prop !== 'animDelay' &&
    prop !== 'animDistance'
})<{ 
  visible: boolean; 
  animDirection: AnimationDirection; 
  animDuration: number;
  animDelay: number;
  animDistance: number;
}>(({ visible, animDirection, animDuration, animDelay, animDistance, theme }) => ({
  opacity: 0,
  transform: 
    animDirection === 'up' ? `translateY(${animDistance}px)` :
    animDirection === 'down' ? `translateY(-${animDistance}px)` :
    animDirection === 'left' ? `translateX(${animDistance}px)` :
    animDirection === 'right' ? `translateX(-${animDistance}px)` :
    animDirection === 'scale' ? 'scale(0.95)' : 'none',
  
  ...(visible && {
    opacity: 1,
    transform: 'none',
    animation: `${
      animDirection === 'up' ? fadeInUp :
      animDirection === 'down' ? fadeInDown :
      animDirection === 'left' ? fadeInLeft :
      animDirection === 'right' ? fadeInRight :
      animDirection === 'scale' ? zoomIn : fadeIn
    } ${animDuration}s ease-out forwards`,
    animationDelay: `${animDelay}ms`,
  }),
  
  // Adding some base transition for smoother feel
  transition: `opacity ${animDuration}s ease-out, transform ${animDuration}s ease-out`,
  transitionDelay: `${animDelay}ms`,
}));

/**
 * A component that animates its children when they enter the viewport.
 * Great for creating scroll animations throughout the app.
 * This version uses MUI styling instead of react-spring for better compatibility
 */
const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  direction = 'up',
  delay = 0,
  threshold = 0.2,
  duration = 0.6,
  distance = 50,
  once = true,
  sx,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && domRef.current) {
              observer.unobserve(domRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold }
    );

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [once, threshold]);

  return (
    <AnimatedBox
      ref={domRef}
      visible={isVisible}
      animDirection={direction}
      animDuration={duration}
      animDelay={delay}
      animDistance={distance}
      sx={sx}
      {...props}
    >
      {children}
    </AnimatedBox>
  );
};

export default FadeInSection;
