import React from 'react';
import { Box, CircularProgress, Typography, useTheme, alpha } from '@mui/material';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

// Pulse animation for the background
const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 0.9; }
  100% { opacity: 0.6; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const growShrink = keyframes`
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(0.95); }
`;

// Styled container for the loader
const LoaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  backdropFilter: 'blur(10px)',
  animation: `${pulse} 2s infinite ease-in-out`,
  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

// Glowing background element
const GlowingBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '150%',
  height: '150%',
  top: '-25%',
  left: '-25%',
  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.background.paper, 0)} 70%)`,
  animation: `${growShrink} 3s infinite ease-in-out`,
  zIndex: -1,
}));

// Custom styled progress indicator
const StyledProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
  filter: `drop-shadow(0 0 10px ${alpha(theme.palette.primary.main, 0.5)})`,
}));

// Progress dot animation
const LoadingDots = styled(Box)(() => ({
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '10px',
}));

const Dot = styled(Box)<{ delay: string }>(({ theme, delay }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  animation: `${pulse} 1.5s infinite ease-in-out`,
  animationDelay: delay,
}));

interface PageLoaderProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading...', 
  size = 60,
  fullScreen = false 
}) => {
  const theme = useTheme();
  
  const container = (
    <LoaderContainer
      sx={{
        minWidth: fullScreen ? '100%' : '300px',
        minHeight: fullScreen ? '60vh' : '200px',
      }}
    >
      <GlowingBackground />
      <StyledProgress size={size} thickness={4} />
      <Typography 
        variant="h6" 
        color="primary" 
        sx={{ 
          mt: 3, 
          fontWeight: 500,
          textShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      >
        {message}
      </Typography>
      <LoadingDots>
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </LoadingDots>
    </LoaderContainer>
  );

  if (fullScreen) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
          p: 2
        }}
      >
        {container}
      </Box>
    );
  }

  return container;
};

export default PageLoader;
