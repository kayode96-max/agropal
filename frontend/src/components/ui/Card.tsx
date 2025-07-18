import React, { FC, ReactNode } from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps, 
  styled,
  CardContent,
  CardHeader,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// Shimmer effect animation
const shimmerAnimation = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Border animation
const borderAnimation = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
`;

// Types of card styles
type CardVariant = 'default' | 'outlined' | 'gradient' | 'glass' | 'flat';

// Types of hover effects
type HoverEffect = 'lift' | 'glow' | 'border' | 'scale' | 'none';

// Styled Card component with hover animations
const StyledCard = styled(MuiCard)<{ 
  elevation?: number; 
  hoverEffect?: HoverEffect;
  cardVariant?: CardVariant;
  borderHighlight?: boolean;
}>(({ theme, elevation = 1, hoverEffect = 'lift', cardVariant = 'default', borderHighlight = false }) => ({
  position: 'relative',
  borderRadius: '16px',
  backgroundImage: 'none',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  
  // Different card variants
  ...(cardVariant === 'default' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[elevation],
    border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  }),
  
  ...(cardVariant === 'outlined' && {
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: 'none',
  }),
  
  ...(cardVariant === 'gradient' && {
    background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.primary.dark, 0.05)})`,
    boxShadow: theme.shadows[3],
  }),
  
  ...(cardVariant === 'glass' && {
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
  }),
  
  ...(cardVariant === 'flat' && {
    backgroundColor: alpha(theme.palette.background.paper, 0.4),
    boxShadow: 'none',
    border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  }),

  // Different hover effects
  ...(hoverEffect === 'lift' && {
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.shadows[elevation + 3],
    },
  }),
  
  ...(hoverEffect === 'glow' && {
    '&:hover': {
      boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.35)}`,
    },
  }),
  
  ...(hoverEffect === 'border' && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
      transform: 'scaleX(0)',
      transformOrigin: 'right',
      transition: 'transform 0.3s ease',
    },
    '&:hover::before': {
      transform: 'scaleX(1)',
      transformOrigin: 'left',
    },
  }),
  
  ...(hoverEffect === 'scale' && {
    '&:hover': {
      transform: 'scale(1.03)',
    },
  }),
  
  // Animated border highlight
  ...(borderHighlight && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
      backgroundSize: '200% 100%',
      animation: `${borderAnimation} 3s linear infinite`,
    },
  }),
}));

// Loading shimmer effect
const ShimmerOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  animation: `${shimmerAnimation} 2.5s infinite linear`,
  background: `linear-gradient(90deg, 
    ${alpha(theme.palette.background.paper, 0)} 0%,
    ${alpha(theme.palette.background.default, 0.15)} 50%,
    ${alpha(theme.palette.background.paper, 0)} 100%)
  `,
  backgroundSize: '200% 100%',
  zIndex: 1,
}));

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  hoverEffect?: HoverEffect;
  variant?: CardVariant;
  isLoading?: boolean;
  borderHighlight?: boolean;
  title?: string;
  subheader?: string;
  headerAction?: React.ReactNode;
  fullHeight?: boolean;
  children: ReactNode;
}

/**
 * Enhanced Card component with various hover effects, styles and loading state
 */
const Card: FC<CardProps> = ({
  children,
  hoverEffect = 'lift',
  variant = 'default',
  isLoading = false,
  borderHighlight = false,
  title,
  subheader,
  headerAction,
  fullHeight = false,
  elevation = 1,
  sx,
  ...props
}) => {
  const theme = useTheme();
  
  return (
    <StyledCard 
      elevation={elevation}
      hoverEffect={hoverEffect}
      cardVariant={variant}
      borderHighlight={borderHighlight}
      sx={{ 
        height: fullHeight ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
      {...props}
    >
      {isLoading && <ShimmerOverlay />}
      
      {(title || subheader) && (
        <CardHeader
          title={
            title ? (
              <Typography 
                variant="h6" 
                color={variant === 'gradient' ? 'primary' : 'textPrimary'} 
                sx={{ 
                  fontWeight: 600,
                  position: 'relative',
                  zIndex: 2 
                }}
              >
                {title}
              </Typography>
            ) : undefined
          }
          subheader={
            subheader ? (
              <Typography 
                variant="body2" 
                color="textSecondary" 
                sx={{ 
                  position: 'relative', 
                  zIndex: 2,
                  opacity: 0.8
                }}
              >
                {subheader}
              </Typography>
            ) : undefined
          }
          action={headerAction ? (
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              {headerAction}
            </Box>
          ) : undefined}
          sx={{ pb: 0 }}
        />
      )}
      
      {(title || subheader) ? (
        <CardContent 
          sx={{ 
            position: 'relative', 
            zIndex: 2, 
            flexGrow: fullHeight ? 1 : 0,
            display: fullHeight ? 'flex' : 'block',
            flexDirection: 'column',
            "&:last-child": { pb: 2 }
          }}
        >
          {children}
        </CardContent>
      ) : (
        children
      )}
    </StyledCard>
  );
};

export default Card;
