import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  AppBar, 
  Toolbar,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';

// Simple theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4CAF50',
    },
  },
});

// Simple Home component
const SimpleHome: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          🌱 Welcome to Agropal
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          AI-Powered Agricultural Platform
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Empowering farmers with cutting-edge technology for crop diagnosis, 
          weather monitoring, and agricultural education.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" size="large">
            Get Started
          </Button>
          <Button variant="outlined" size="large">
            Learn More
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          Key Features
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 4 }}>
          <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>🔬 AI Crop Diagnosis</Typography>
            <Typography variant="body2">
              Advanced image analysis for quick crop disease identification
            </Typography>
          </Box>
          <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>🌤️ Weather Integration</Typography>
            <Typography variant="body2">
              Real-time weather data and forecasts for better farming decisions
            </Typography>
          </Box>
          <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>👥 Community Forum</Typography>
            <Typography variant="body2">
              Connect with fellow farmers and agricultural experts
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

// Simple App component
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🌱 Agropal
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        
        <Routes>
          <Route path="/" element={<SimpleHome />} />
          <Route path="*" element={
            <Container sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h4">Page Coming Soon</Typography>
              <Typography>This feature is under development.</Typography>
            </Container>
          } />
        </Routes>
        
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © 2025 Agropal. Built with ❤️ for farmers worldwide.
            </Typography>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
