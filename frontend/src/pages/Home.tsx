import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      title: "AI Crop Diagnosis",
      description:
        "Upload photos of your crops to get instant AI-powered disease diagnosis and treatment recommendations.",
      icon: <Camera sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      path: "/diagnosis",
      color: "#E8F5E8",
      stats: "95% Accuracy",
    },
    {
      title: "Voice Assistant",
      description:
        "Ask farming questions using your voice in your local language. Perfect for farmers with limited literacy.",
      icon: <Mic sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      path: "/voice-chat",
      color: "#FFF8E1",
      stats: "Multi-language",
    },
    {
      title: "Community Forum",
      description:
        "Connect with fellow farmers, share experiences, and get advice with AI-moderated discussions.",
      icon: <Forum sx={{ fontSize: 48, color: "#1976d2" }} />,
      path: "/community",
      color: "#E3F2FD",
      stats: "50K+ Farmers",
    },
    {
      title: "Weather Insights",
      description:
        "Get localized weather forecasts and agricultural recommendations tailored to your location.",
      icon: <WbSunny sx={{ fontSize: 48, color: "#FF9800" }} />,
      path: "/weather",
      color: "#FFF3E0",
      stats: "7-day Forecast",
    },
    {
      title: "Learning Hub",
      description:
        "Access video tutorials, interactive quizzes, and farming best practices in multiple languages.",
      icon: <School sx={{ fontSize: 48, color: "#9C27B0" }} />,
      path: "/learning",
      color: "#F3E5F5",
      stats: "100+ Courses",
    },
  ];

  const quickStats = [
    { label: "Active Farmers", value: "25,000+", icon: <People /> },
    { label: "Crops Diagnosed", value: "150,000+", icon: <Agriculture /> },
    { label: "Success Rate", value: "94%", icon: <TrendingUp /> },
    { label: "Countries", value: "15+", icon: <CloudQueue /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          py: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          borderRadius: 2,
          color: "white",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          🌱 Welcome to Agropal
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          AI-Powered Agricultural Platform for Smart Farming
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
          Empowering farmers with cutting-edge technology to diagnose crop
          diseases, connect with the community, and access agricultural
          knowledge in their local language.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/diagnosis")}
          sx={{
            bgcolor: "white",
            color: theme.palette.primary.main,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.9)",
            },
          }}
        >
          Start Crop Diagnosis
        </Button>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
        >
          Our Impact
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {quickStats.map((stat, index) => (
            <Grid xs={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 2,
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
                }}
              >
                <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
        >
          Platform Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, bgcolor: feature.color }}>
                  <Box sx={{ textAlign: "center", mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    {feature.description}
                  </Typography>
                  <Chip
                    label={feature.stats}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(feature.path)}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Explore
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          bgcolor: "#f8f9fa",
          borderRadius: 2,
          border: `2px solid ${theme.palette.primary.light}`,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Ready to revolutionize your farming?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "textSecondary" }}>
          Join thousands of farmers already using Agropal to improve their crop
          yields
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/diagnosis")}
          >
            Diagnose Your Crops
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/community")}
          >
            Join Community
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
