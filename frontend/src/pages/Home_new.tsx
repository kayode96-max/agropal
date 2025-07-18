import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  IconButton,
  useTheme,
  Button as MuiButton,
  useMediaQuery,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Mic,
  Forum,
  WbSunny,
  School,
  Agriculture,
  TrendingUp,
  People,
  CloudQueue,
  ArrowForward,
} from "@mui/icons-material";

// Import custom UI components
import { 
  FeatureCard, 
  Button, 
  FadeInSection,
  LoadingOverlay
} from "../components/ui";

// Import notification context
import { useNotification } from "../contexts/NotificationContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { addNotification } = useNotification();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  
  // Demonstrate loading overlay (would be controlled by actual loading state in a real app)
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Auto hide the loading overlay after 2 seconds to simulate content loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Show a welcome notification
      addNotification(
        'success',
        'Welcome to Agropal',
        'Discover all our features designed to help your farming journey!',
        8000
      );
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [addNotification]);

  const features = [
    {
      title: "AI Crop Diagnosis",
      description:
        "Upload photos of your crops to get instant AI-powered disease diagnosis and treatment recommendations.",
      icon: <Camera fontSize="large" />,
      path: "/diagnosis",
      image: "https://images.unsplash.com/photo-1592982537447-7440770faae9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "95% Accuracy",
    },
    {
      title: "Voice Assistant",
      description:
        "Ask farming questions using your voice in your local language. Perfect for farmers with limited literacy.",
      icon: <Mic fontSize="large" />,
      path: "/voice-chat",
      image: "https://images.unsplash.com/photo-1564156280315-1d42b4651629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "Multi-language",
    },
    {
      title: "Farming Community",
      description:
        "Connect with fellow farmers, share experiences, ask questions, and learn from the community.",
      icon: <People fontSize="large" />,
      path: "/community",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "1000+ Members",
    },
    {
      title: "Weather Forecast",
      description:
        "Get hyperlocal weather predictions specifically for your farm location with farming recommendations.",
      icon: <WbSunny fontSize="large" />,
      path: "/weather",
      image: "https://images.unsplash.com/photo-1569280256714-22cc13bed729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "7-day Forecast",
    },
    {
      title: "Agricultural Learning",
      description:
        "Access tailored educational content on modern farming practices, equipment, and techniques.",
      icon: <School fontSize="large" />,
      path: "/learning",
      image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "50+ Courses",
    },
    {
      title: "Crop Calendar",
      description:
        "Plan your planting and harvesting with customized schedules based on your crops and location.",
      icon: <Agriculture fontSize="large" />,
      path: "/calendar",
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "Personalized",
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleShowNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: 'Successfully completed operation!',
      error: 'An error occurred while processing your request.',
      warning: 'Please be aware of potential issues.',
      info: 'Here\'s some information you might find useful.'
    };
    
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };
    
    addNotification(
      type,
      titles[type],
      messages[type]
    );
  };

  return (
    <Box>
      {/* Demo loading overlay */}
      <LoadingOverlay visible={isLoading} message="Welcome to Agropal" />
      
      {/* Hero section with animated text */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}80, ${theme.palette.primary.main}90)`,
          borderRadius: { xs: '0 0 20px 20px', md: '0 0 50px 50px' },
          padding: { xs: '5rem 0 3rem', md: '8rem 0 5rem' },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 10px 30px -10px ${theme.palette.primary.dark}`,
          mb: 6,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={!isLoading} timeout={1000}>
            <Box>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.common.white}, ${theme.palette.secondary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Empower Your Farming
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 4,
                  color: theme.palette.common.white,
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.5rem' },
                }}
              >
                Access cutting-edge agricultural technologies to increase your yield, 
                reduce costs, and farm sustainably
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => handleNavigate('/diagnosis')}
                >
                  Start Diagnosis
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  color="secondary"
                  onClick={() => handleNavigate('/learning')}
                  sx={{ borderWidth: 2 }}
                >
                  Explore Learning
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features section */}
      <Container maxWidth="lg">
        <FadeInSection>
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{ 
              mb: { xs: 3, md: 5 }, 
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Our Features
          </Typography>
        </FadeInSection>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FadeInSection delay={index * 100}>
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  image={feature.image}
                  imageAlt={`${feature.title} feature`}
                  variant={index === 0 ? 'featured' : 'default'}
                  icon={feature.icon}
                  onClick={() => handleNavigate(feature.path)}
                  actions={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          bgcolor: 'background.paper', 
                          py: 0.5, 
                          px: 1, 
                          borderRadius: 5,
                          border: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        {feature.stats}
                      </Typography>
                      <IconButton color="primary" size="small">
                        <ArrowForward fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                />
              </FadeInSection>
            </Grid>
          ))}
        </Grid>
        
        {/* Notification demo section */}
        <FadeInSection>
          <Box 
            sx={{ 
              mt: 8, 
              mb: 5, 
              p: 4, 
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.background.paper}, ${theme.palette.primary.dark}15)`,
              border: `1px solid ${theme.palette.divider}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Try Our Beautiful Notifications
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.8, maxWidth: '600px', mx: 'auto' }}>
              Our app features beautiful animated notifications to keep you informed about important events and updates.
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              <Button 
                color="success" 
                onClick={() => handleShowNotification('success')}
              >
                Success Alert
              </Button>
              <Button 
                color="error" 
                onClick={() => handleShowNotification('error')}
              >
                Error Alert
              </Button>
              <Button 
                color="warning" 
                onClick={() => handleShowNotification('warning')}
              >
                Warning Alert
              </Button>
              <Button 
                color="info" 
                onClick={() => handleShowNotification('info')}
              >
                Info Alert
              </Button>
            </Box>
          </Box>
        </FadeInSection>
      </Container>
    </Box>
  );
};

export default Home;
