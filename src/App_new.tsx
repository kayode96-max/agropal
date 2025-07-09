import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";

// Import components
import Navbar from "./components/Navbar";
import AuthWrapper from "./components/AuthWrapper";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import CropDiagnosis from "./pages/CropDiagnosis";
import Community from "./pages/Community";
import Weather from "./pages/Weather";
import Learning from "./pages/Learning";
import VoiceChat from "./pages/VoiceChat";

// Create theme with Nigerian colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32", // Green for agriculture
    },
    secondary: {
      main: "#FFA726", // Orange for warmth
    },
    background: {
      default: "#F5F5F5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Prevent all caps
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AuthWrapper>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1, pt: 2 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/diagnosis" element={<CropDiagnosis />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/weather" element={<Weather />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/voice-chat" element={<VoiceChat />} />
                </Routes>
              </Box>
            </Box>
          </AuthWrapper>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
