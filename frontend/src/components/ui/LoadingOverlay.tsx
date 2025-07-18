import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

// Animated wave effect
const wave = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Pulse effect for the gradient background
const pulse = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled wrapper for the whole overlay
const OverlayWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(5px)',
  color: theme.palette.common.white,
}));

// Styled wrapper for the loader component
const LoaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(45deg, 
    ${theme.palette.primary.dark}80, 
    ${theme.palette.primary.main}80, 
    ${theme.palette.success.main}80
  )`,
  backgroundSize: '400% 400%',
  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2)`,
  animation: `${pulse} 3s ease infinite`,
  width: '300px',
  maxWidth: '90vw',
}));

// Styled dots for the animated ellipsis
const LoadingDot = styled(Box)<{ index: number }>(({ theme, index }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  margin: '0 3px',
  display: 'inline-block',
  animation: `${wave} 1.5s ease-in-out infinite`,
  animationDelay: `${index * 0.2}s`,
}));

// Styled circular progress with custom color
const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.success.light,
  '& .MuiCircularProgress-svg': {
    strokeLinecap: 'round',
  },
}));

interface LoadingOverlayProps {
  message?: string;
  visible: boolean;
  isFullPage?: boolean;
}

/**
 * Beautiful loading overlay with animations
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading',
  visible,
  isFullPage = true,
}) => {
  if (!visible) return null;

  return (
    <OverlayWrapper 
      sx={{
        position: isFullPage ? 'fixed' : 'absolute',
      }}
    >
      <LoaderWrapper>
        <StyledCircularProgress size={60} thickness={4} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1, 
              fontWeight: 600,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {message}
            <Box component="span" sx={{ display: 'inline-flex' }}>
              <LoadingDot index={0} />
              <LoadingDot index={1} />
              <LoadingDot index={2} />
            </Box>
          </Typography>
          
          <Typography 
            variant="body2"
            sx={{ 
              opacity: 0.8,
              maxWidth: '90%',
              mx: 'auto',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Please wait while we process your request
          </Typography>
        </Box>
      </LoaderWrapper>
    </OverlayWrapper>
  );
};

export default LoadingOverlay;
