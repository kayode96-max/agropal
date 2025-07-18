import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Animation directions
type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

interface FadeInSectionProps extends BoxProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  threshold?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

/**
 * A component that animates its children when they enter the viewport.
 * Great for creating scroll animations throughout the app.
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

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);

  // Define the initial and animated states based on direction
  const getAnimationStyles = () => {
    const baseStyles = {
      opacity: 0,
      transform: 'none',
      transition: `transform ${duration}s ease-out ${delay}s, opacity ${duration}s ease-out ${delay}s`,
    };

    const visibleStyle = {
      opacity: 1,
      transform: 'none',
    };

    switch (direction) {
      case 'up':
        return {
          initial: { ...baseStyles, transform: `translateY(${distance}px)` },
          visible: visibleStyle,
        };
      case 'down':
        return {
          initial: { ...baseStyles, transform: `translateY(-${distance}px)` },
          visible: visibleStyle,
        };
      case 'left':
        return {
          initial: { ...baseStyles, transform: `translateX(${distance}px)` },
          visible: visibleStyle,
        };
      case 'right':
        return {
          initial: { ...baseStyles, transform: `translateX(-${distance}px)` },
          visible: visibleStyle,
        };
      case 'scale':
        return {
          initial: { ...baseStyles, transform: `scale(0.8)` },
          visible: visibleStyle,
        };
      case 'fade':
      default:
        return {
          initial: { ...baseStyles },
          visible: visibleStyle,
        };
    }
  };

  const { initial, visible } = getAnimationStyles();

  return (
    <Box
      ref={domRef}
      sx={{
        ...initial,
        ...(isVisible ? visible : {}),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default FadeInSection;
