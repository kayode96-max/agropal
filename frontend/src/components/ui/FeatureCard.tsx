import React from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps,
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  IconButton,
  CardActions,
  Button as MuiButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

// Card hover animation
const cardHover = keyframes`
  0% {
    transform: translateY(0);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: translateY(-5px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  }
`;

// Shine animation for the hover effect
const shine = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

interface FeatureCardProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  imageHeight?: number | string;
  actions?: React.ReactNode;
  variant?: 'default' | 'featured' | 'minimal';
  onClick?: () => void;
  showControls?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Styled Card component
const StyledCard = styled(MuiCard)<{ cardVariant: string }>(({ theme, cardVariant }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  
  ...(cardVariant === 'featured' && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(45deg, transparent, ${theme.palette.primary.main}22, transparent)`,
      backgroundSize: '200% 100%',
      pointerEvents: 'none',
    },
    
    '&:hover': {
      '&::before': {
        animation: `${shine} 1.5s infinite`,
      }
    }
  }),
  
  ...(cardVariant === 'minimal' && {
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
  }),
  
  '&:hover': {
    animation: `${cardHover} 0.3s forwards ease-out`,
    
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    }
  },
}));

// Styled card media with zoom effect
const StyledCardMedia = styled(CardMedia)({
  transition: 'transform 0.5s ease',
  transformOrigin: 'center',
});

// Styled card content
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

// Styled action button
const ActionButton = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: '50%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'skewX(-15deg)',
    transition: 'all 0.5s ease',
    opacity: 0,
  },
  
  '&:hover': {
    '&::before': {
      left: 150,
      opacity: 1,
    },
    '& .MuiSvgIcon-root': {
      transform: 'translateX(4px)',
    }
  },
  
  '& .MuiSvgIcon-root': {
    marginLeft: theme.spacing(1),
    transition: 'transform 0.3s ease',
  }
}));

// Card icon styling
const CardIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  background: theme.palette.background.paper,
  borderRadius: '50%',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  zIndex: 2,
  color: theme.palette.primary.main,
}));

/**
 * Beautiful Feature Card with animations and modern styling
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  image,
  imageAlt = 'Featured image',
  imageHeight = 200,
  actions,
  variant = 'default',
  onClick,
  showControls = false,
  icon,
  className,
  style
}) => {
  return (
    <StyledCard 
      cardVariant={variant} 
      onClick={onClick}
      variant="outlined"
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
      className={className}
    >
      {icon && (
        <CardIcon>{icon}</CardIcon>
      )}
      
      {image && (
        <StyledCardMedia
          sx={{
            height: imageHeight,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          title={imageAlt}
        />
      )}
      
      <StyledCardContent>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            position: 'relative',
            display: 'inline-block',
            ...(variant === 'featured' && {
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: '40px',
                height: '3px',
                backgroundColor: 'primary.main',
                borderRadius: '3px',
              }
            })
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            lineHeight: 1.6,
            mt: variant === 'featured' ? 2 : 0
          }}
        >
          {description}
        </Typography>
      </StyledCardContent>
      
      {(actions || showControls) && (
        <CardActions sx={{ padding: 2, pt: 0, justifyContent: 'space-between' }}>
          {actions || (
            <>
              <Box>
                <IconButton size="small" aria-label="add to favorites">
                  <FavoriteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="share">
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <ActionButton 
                size="small" 
                variant="text" 
                color="primary"
                endIcon={<ArrowForwardIcon />}
              >
                Learn More
              </ActionButton>
            </>
          )}
        </CardActions>
      )}
    </StyledCard>
  );
};

export default FeatureCard;
