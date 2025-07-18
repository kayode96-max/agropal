import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  AlertProps, 
  AlertTitle, 
  Box, 
  IconButton, 
  Collapse,
  Typography 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close, CheckCircle, Warning, Info, Error } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Animation for slide in
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Animation for slide out
const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
`;

// Animation for glow
const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.2);
  }
  50% {
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.2);
  }
`;

// Styled Alert component
const StyledAlert = styled(Alert)<{ animating?: string; variant: string }>(
  ({ theme, animating, variant }) => ({
    borderRadius: theme.shape.borderRadius * 1.5,
    padding: theme.spacing(1, 2),
    backgroundColor: 
      variant === 'filled' 
        ? theme.palette.background.paper 
        : 'transparent',
    border: 
      variant === 'outlined'
        ? `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey[300]}`
        : 'none',
    animation: animating === 'in' 
      ? `${slideIn} 0.3s forwards` 
      : animating === 'out' 
        ? `${slideOut} 0.3s forwards` 
        : 'none',
    display: 'flex',
    alignItems: 'center',
    '&.MuiAlert-standardSuccess, &.MuiAlert-outlinedSuccess': {
      borderLeft: `4px solid ${theme.palette.success.main}`,
    },
    '&.MuiAlert-standardError, &.MuiAlert-outlinedError': {
      borderLeft: `4px solid ${theme.palette.error.main}`,
    },
    '&.MuiAlert-standardWarning, &.MuiAlert-outlinedWarning': {
      borderLeft: `4px solid ${theme.palette.warning.main}`,
    },
    '&.MuiAlert-standardInfo, &.MuiAlert-outlinedInfo': {
      borderLeft: `4px solid ${theme.palette.info.main}`,
    },
    '&.MuiAlert-filledSuccess': {
      background: `linear-gradient(45deg, ${theme.palette.background.paper}, ${theme.palette.success.dark}22)`,
      animation: `${glow} 2s infinite`,
      boxShadow: `0 0 10px ${theme.palette.success.main}33`,
    },
    '&.MuiAlert-filledError': {
      background: `linear-gradient(45deg, ${theme.palette.background.paper}, ${theme.palette.error.dark}22)`,
      animation: `${glow} 2s infinite`,
      boxShadow: `0 0 10px ${theme.palette.error.main}33`,
    },
    '&.MuiAlert-filledWarning': {
      background: `linear-gradient(45deg, ${theme.palette.background.paper}, ${theme.palette.warning.dark}22)`,
      animation: `${glow} 2s infinite`,
      boxShadow: `0 0 10px ${theme.palette.warning.main}33`,
    },
    '&.MuiAlert-filledInfo': {
      background: `linear-gradient(45deg, ${theme.palette.background.paper}, ${theme.palette.info.dark}22)`,
      animation: `${glow} 2s infinite`,
      boxShadow: `0 0 10px ${theme.palette.info.main}33`,
    },
  })
);

export interface BeautifulAlertProps {
  title?: string;
  content: React.ReactNode;
  onClose?: () => void;
  autoHideDuration?: number;
  icon?: React.ReactNode;
  variant?: 'standard' | 'filled' | 'outlined';
  persistent?: boolean;
  severity?: 'success' | 'info' | 'warning' | 'error';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Beautiful alert component with animations and modern styling
 */
const BeautifulAlert: React.FC<BeautifulAlertProps> = ({
  title,
  content,
  onClose,
  autoHideDuration = 0,
  icon,
  variant = 'standard',
  severity = 'info',
  persistent = false,
  className,
  style
}) => {
  const [open, setOpen] = useState(true);
  const [animating, setAnimating] = useState<'in' | 'out' | 'none'>('in');

  // Handle auto-hide
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoHideDuration > 0 && !persistent) {
      timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoHideDuration, persistent]);
  
  // Custom close handler with animation
  const handleClose = () => {
    setAnimating('out');
    
    setTimeout(() => {
      setOpen(false);
      if (onClose) onClose();
    }, 300); // Match animation duration
  };
  
  // Get the appropriate icon based on severity
  const getIcon = () => {
    if (icon) return icon;
    
    switch (severity) {
      case 'success':
        return <CheckCircle fontSize="inherit" />;
      case 'warning':
        return <Warning fontSize="inherit" />;
      case 'error':
        return <Error fontSize="inherit" />;
      case 'info':
      default:
        return <Info fontSize="inherit" />;
    }
  };
  
  return (
    <Collapse in={open}>
      <StyledAlert
        severity={severity}
        variant={variant}
        animating={animating}
        icon={getIcon()}
        className={className}
        style={style}
        action={
          !persistent && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <Close fontSize="inherit" />
            </IconButton>
          )
        }
      >
        <Box sx={{ ml: 0.5 }}>
          {title && (
            <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>{title}</AlertTitle>
          )}
          <Typography 
            variant="body2" 
            component="div" 
            sx={{ 
              opacity: 0.9,
              fontWeight: title ? 400 : 500
            }}
          >
            {content}
          </Typography>
        </Box>
      </StyledAlert>
    </Collapse>
  );
};

export default BeautifulAlert;
