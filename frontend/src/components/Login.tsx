import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

interface LoginProps {
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            🌱 Welcome to Agropal
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            Your smart farming assistant for Nigeria
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={onSwitchToRegister}
                disabled={loading}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>

          <Box
            sx={{ mt: 3, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              🇳🇬 Designed specifically for Nigerian farmers
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Available in English, Hausa, Igbo, and Yoruba
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
