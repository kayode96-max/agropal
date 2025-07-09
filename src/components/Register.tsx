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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

// Nigerian states and local governments data
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ha", name: "Hausa" },
  { code: "ig", name: "Igbo" },
  { code: "yo", name: "Yoruba" },
];

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    state: "",
    localGovernment: "",
    preferredLanguage: "en",
    primaryCrops: ["Rice"], // Default crop
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSelectChange = (name: string) => (event: any) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const userData = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phoneNumber,
        password: registerData.password,
        location: {
          state: registerData.state,
          localGovernment: registerData.localGovernment,
        },
        profile: {
          primaryCrops: registerData.primaryCrops,
          preferredLanguage: registerData.preferredLanguage,
        },
      };
      await register(userData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            🌱 Join Agropal
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            Create your account and start your smart farming journey
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="tel"
                placeholder="+234 or 0..."
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={loading}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <FormControl fullWidth required>
                  <InputLabel id="state-label">State</InputLabel>
                  <Select
                    labelId="state-label"
                    id="state"
                    name="state"
                    value={formData.state}
                    label="State"
                    onChange={handleSelectChange("state")}
                    disabled={loading}
                  >
                    {NIGERIAN_STATES.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  required
                  fullWidth
                  id="localGovernment"
                  label="Local Government Area"
                  name="localGovernment"
                  value={formData.localGovernment}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
              <FormControl fullWidth>
                <InputLabel id="language-label">Preferred Language</InputLabel>
                <Select
                  labelId="language-label"
                  id="preferredLanguage"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  label="Preferred Language"
                  onChange={handleSelectChange("preferredLanguage")}
                  disabled={loading}
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Account"}
            </Button>

            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={onSwitchToLogin}
                disabled={loading}
              >
                {"Already have an account? Sign In"}
              </Link>
            </Box>
          </Box>

          <Box
            sx={{ mt: 3, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              🇳🇬 Welcome to Nigeria's premier agricultural platform
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Connect with fellow farmers, get AI-powered insights, and grow
              smarter
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
