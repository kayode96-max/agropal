import React, { FC } from 'react';
import { Button as MuiButton, ButtonProps, styled } from '@mui/material';
import { keyframes } from '@emotion/react';

// Ripple effect animation
const rippleEffect = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

// Styled button with hover animation
const StyledButton = styled(MuiButton)<{ animate?: string; variant?: string }>(
  ({ theme, animate, variant }) => ({
    position: 'relative',
    overflow: 'hidden',
    padding: '10px 22px',
    fontSize: '0.95rem',
    fontWeight: 500,
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    textTransform: 'none',
    boxShadow: variant === 'contained' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',

    '&:hover': {
      transform: animate !== 'none' ? 'translateY(-3px)' : 'none',
      boxShadow: variant === 'contained' ? '0 8px 20px rgba(0, 0, 0, 0.2)' : 'none',
    },

    '&:active': {
      transform: 'translateY(1px)',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '50%',
      transform: 'scale(0)',
      opacity: 0,
      pointerEvents: 'none',
    },

    '&.MuiButton-containedPrimary': {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
      color: theme.palette.primary.contrastText,
    },

    '&.MuiButton-outlined': {
      borderWidth: '2px',
      '&:hover': {
        borderWidth: '2px',
      },
    },
  })
);

export interface AnimatedButtonProps extends ButtonProps {
  animate?: 'ripple' | 'hover' | 'none';
}

/**
 * Modern animated button with hover and ripple effects
 */
const Button: FC<AnimatedButtonProps> = ({ 
  children, 
  animate = 'hover',
  variant = 'contained',
  color = 'primary',
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      animate={animate}
      disableRipple={animate === 'none'}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
