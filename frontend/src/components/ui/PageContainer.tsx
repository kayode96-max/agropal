import React, { FC, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Box component with animation
const AnimatedContainer = styled(Box)<{ delay?: string }>(({ theme, delay }) => ({
  animation: `${fadeIn} 0.5s ease-out ${delay || '0s'} forwards`,
  opacity: 0,
  width: '100%',
}));

interface PageContainerProps extends BoxProps {
  children: ReactNode;
  delay?: string;
  animation?: 'fadeIn' | 'slideUp' | 'none';
  className?: string;
}

/**
 * PageContainer - A container component that adds entrance animations to pages
 * Use this to wrap each page's content for consistent animation and spacing
 */
const PageContainer: FC<PageContainerProps> = ({
  children,
  delay = '0s',
  animation = 'fadeIn',
  className = '',
  ...props
}) => {
  return (
    <AnimatedContainer
      delay={delay}
      className={`page-container ${className}`}
      {...props}
    >
      {children}
    </AnimatedContainer>
  );
};

export default PageContainer;
