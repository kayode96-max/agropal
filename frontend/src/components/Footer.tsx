import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link, 
  IconButton,
  Divider,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  YouTube, 
  Email,
  Phone,
  LocationOn,
  KeyboardArrowUp
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.8)} 0%, ${theme.palette.background.paper} 100%)`,
  backdropFilter: 'blur(10px)',
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  position: 'relative',
  marginTop: theme.spacing(6),
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: 0,
    width: '100%',
    height: '1px',
    background: `linear-gradient(90deg, 
      rgba(76,175,80,0) 0%, 
      ${alpha(theme.palette.primary.main, 0.5)} 50%, 
      rgba(76,175,80,0) 100%)`,
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0.5),
  color: theme.palette.primary.main,
  background: alpha(theme.palette.primary.main, 0.1),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.2),
    transform: 'translateY(-3px)',
    boxShadow: `0 5px 10px ${alpha(theme.palette.common.black, 0.2)}`,
  }
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  transition: 'color 0.2s ease, transform 0.2s ease',
  display: 'inline-block',
  marginBottom: theme.spacing(1),
  position: 'relative',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateX(3px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: 0,
    width: '0',
    height: '1px',
    background: theme.palette.primary.main,
    transition: 'width 0.3s ease',
  },
  '&:hover::after': {
    width: '100%',
  }
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  backgroundSize: '200% auto',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${gradientFlow} 5s ease infinite`,
  fontWeight: 700,
  letterSpacing: 1,
}));

const ScrollTopButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '-20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.primary.main,
  boxShadow: `0 0 10px ${alpha(theme.palette.common.black, 0.2)}`,
  animation: `${float} 2s ease-in-out infinite`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  }
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  }
}));

const Footer: React.FC = () => {
  const theme = useTheme();
  
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <FooterContainer>
      <ScrollTopButton 
        onClick={handleScrollTop}
        aria-label="scroll to top"
        size="small"
      >
        <KeyboardArrowUp />
      </ScrollTopButton>
      
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Branding Section */}
          <Grid item xs={12} sm={6} md={4}>
            <GradientText variant="h5" gutterBottom>
              AgroPal
            </GradientText>
            <Typography 
              variant="body2" 
              color="textSecondary"
              sx={{ mb: 2, maxWidth: '90%' }}
            >
              Empowering farmers with AI-powered agricultural solutions for sustainable farming practices and improved crop yields.
            </Typography>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <SocialButton aria-label="facebook">
                <Facebook fontSize="small" />
              </SocialButton>
              <SocialButton aria-label="twitter">
                <Twitter fontSize="small" />
              </SocialButton>
              <SocialButton aria-label="instagram">
                <Instagram fontSize="small" />
              </SocialButton>
              <SocialButton aria-label="linkedin">
                <LinkedIn fontSize="small" />
              </SocialButton>
              <SocialButton aria-label="youtube">
                <YouTube fontSize="small" />
              </SocialButton>
            </Box>
          </Grid>
          
          {/* Quick Links Section */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="primary" fontWeight={600} gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/diagnosis">Crop Diagnosis</FooterLink>
              <FooterLink href="/weather">Weather Forecast</FooterLink>
              <FooterLink href="/learning">E-Learning</FooterLink>
            </Box>
          </Grid>
          
          {/* Resources Section */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="primary" fontWeight={600} gutterBottom>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">FAQ</FooterLink>
              <FooterLink href="#">Community</FooterLink>
              <FooterLink href="#">Support</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
            </Box>
          </Grid>
          
          {/* Contact Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" color="primary" fontWeight={600} gutterBottom>
              Contact Us
            </Typography>
            <ContactItem>
              <LocationOn fontSize="small" />
              <Typography variant="body2" color="textSecondary">
                123 Farming Avenue, Agritech City
              </Typography>
            </ContactItem>
            <ContactItem>
              <Email fontSize="small" />
              <Typography variant="body2" color="textSecondary">
                info@agropal.com
              </Typography>
            </ContactItem>
            <ContactItem>
              <Phone fontSize="small" />
              <Typography variant="body2" color="textSecondary">
                +234 123 456 7890
              </Typography>
            </ContactItem>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, opacity: 0.2 }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'flex-start' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Typography variant="caption" color="textSecondary">
            &copy; {new Date().getFullYear()} AgroPal. All rights reserved.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            mt: { xs: 1, sm: 0 }
          }}>
            <Typography variant="caption" color="textSecondary" component={Link} href="#" sx={{ textDecoration: 'none' }}>
              Terms of Service
            </Typography>
            <Typography variant="caption" color="textSecondary" component={Link} href="#" sx={{ textDecoration: 'none' }}>
              Privacy Policy
            </Typography>
            <Typography variant="caption" color="textSecondary" component={Link} href="#" sx={{ textDecoration: 'none' }}>
              Cookies
            </Typography>
          </Box>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
