import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, GlobalStyles } from "@mui/material";
// Import custom notification context
import { NotificationProvider } from './contexts/NotificationContext';
import { alpha } from "@mui/material/styles";

// Import theme
import theme from './theme/darkTheme';

// Import components
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar_new";
import Footer from "./components/Footer";
import AuthWrapper from "./components/AuthWrapper";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home_new";
import Dashboard from "./pages/Dashboard";
import CropDiagnosis from "./pages/CropDiagnosis";
import Community from "./pages/Community";
import Weather from "./pages/Weather";
import Learning from "./pages/Learning";
import VoiceChat from "./pages/VoiceChat";
import CropCalendar from "./pages/CropCalendar";
import MarketPrices from "./pages/MarketPrices";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";

// Global styles for beautiful effects
const globalStyles = {
  // Beautiful gradient subtle background
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
  // Focus outline glow effect
  '@keyframes focusPulse': {
    '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
    '50%': { boxShadow: '0 0 0 4px rgba(76, 175, 80, 0.2)' },
    '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
  },
  // Beautiful subtle background pattern
  'body:before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle at 50% 0%, ${alpha('#4CAF50', 0.08)} 0%, transparent 70%)`,
    pointerEvents: 'none',
    zIndex: -1,
  },
  // Focus states for accessibility and beauty
  'button:focus, input:focus, select:focus, textarea:focus, a:focus': {
    outline: 'none',
    animation: 'focusPulse 2s infinite',
  },
  // Subtle animated pattern background
  '.bg-pattern': {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `radial-gradient(${alpha('#4CAF50', 0.1)} 1px, transparent 1px), 
                     radial-gradient(${alpha('#4CAF50', 0.1)} 1px, transparent 1px)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
    zIndex: -2,
    opacity: 0.5,
  },
  // Enhanced scrollbar for webkit browsers
  '::-webkit-scrollbar-thumb:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  },
};

function App() {
  // Smooth scroll to top when navigating between pages
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <div className="bg-pattern" />
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <ErrorBoundary>
                <AuthWrapper>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "100vh",
                      overflow: "hidden",
                      position: "relative",
                      background: "transparent",
                    }}
                  >
                    <ErrorBoundary>
                      <Navbar />
                    </ErrorBoundary>
                    <Box 
                      component="main" 
                      sx={{ 
                        flexGrow: 1, 
                        pt: { xs: 3, sm: 4 }, 
                        px: { xs: 2, sm: 3, md: 4 },
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        zIndex: 1,
                      }}
                      className="page-container fadeIn"
                    >
                      <ErrorBoundary>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/diagnosis" element={<CropDiagnosis />} />
                          <Route path="/community" element={<Community />} />
                          <Route path="/weather" element={<Weather />} />
                          <Route path="/learning" element={<Learning />} />
                          <Route path="/voice-chat" element={<VoiceChat />} />
                          <Route path="/calendar" element={<CropCalendar />} />
                          <Route path="/market" element={<MarketPrices />} />
                          <Route
                            path="/notifications"
                            element={<NotificationsPage />}
                          />
                          <Route path="/profile" element={<ProfilePage />} />
                        </Routes>
                      </ErrorBoundary>
                    </Box>
                    <ErrorBoundary>
                      <Footer />
                    </ErrorBoundary>
                  </Box>
                </AuthWrapper>
              </ErrorBoundary>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
