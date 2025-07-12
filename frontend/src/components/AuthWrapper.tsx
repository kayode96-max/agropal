import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import Register from "./Register";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Agropal...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your smart farming assistant
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <>
        {showRegister ? (
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
