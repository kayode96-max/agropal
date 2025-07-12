import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@mui/material";
import {
  Agriculture,
  Schedule,
  Notifications,
  WbSunny,
  AttachMoney,
  EmojiEvents,
  ArrowForward,
  Warning,
  CheckCircle,
  Info,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

interface DashboardStats {
  totalFarms: number;
  activeFarms: number;
  completedFarms: number;
  totalFarmSize: number;
  totalInvestment: number;
  totalIncome: number;
  avgROI: number;
  cropTypes: string[];
  seasons: string[];
}

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  condition: string;
  forecast: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  createdAt: string;
  read: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    totalFarms: 0,
    activeFarms: 0,
    completedFarms: 0,
    totalFarmSize: 0,
    totalInvestment: 0,
    totalIncome: 0,
    avgROI: 0,
    cropTypes: [],
    seasons: [],
  });
  const [weather, setWeather] = useState<WeatherData>({
    location: "Lagos, Nigeria",
    temperature: 28,
    humidity: 75,
    condition: "Partly Cloudy",
    forecast: "Good for farming",
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Load all dashboard data
      const [statsResponse, weatherResponse, notificationsResponse] =
        await Promise.all([
          api.get("/users/stats").catch(() => ({ data: {} })),
          api.get("/weather/current/Lagos").catch(() => ({ data: {} })),
          api.get("/notifications").catch(() => ({ data: [] })),
        ]);

      // Set data with proper defaults
      setStats({
        totalFarms: statsResponse.data?.totalFarms || 0,
        activeFarms: statsResponse.data?.activeFarms || 0,
        completedFarms: statsResponse.data?.completedFarms || 0,
        totalFarmSize: statsResponse.data?.totalFarmSize || 0,
        totalInvestment: statsResponse.data?.totalInvestment || 0,
        totalIncome: statsResponse.data?.totalIncome || 0,
        avgROI: statsResponse.data?.avgROI || 0,
        cropTypes: statsResponse.data?.cropTypes || [],
        seasons: statsResponse.data?.seasons || [],
      });
      setWeather({
        location:
          weatherResponse.data?.data?.location?.name || "Lagos, Nigeria",
        temperature: weatherResponse.data?.data?.current?.temperature || 28,
        humidity: weatherResponse.data?.data?.current?.humidity || 75,
        condition:
          weatherResponse.data?.data?.current?.condition || "Partly Cloudy",
        forecast:
          weatherResponse.data?.data?.current?.description ||
          "Good for farming",
      });
      setNotifications(
        Array.isArray(notificationsResponse.data)
          ? notificationsResponse.data
          : []
      );
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <WbSunny color="warning" />;
      case "cloudy":
      case "partly cloudy":
        return <WbSunny color="disabled" />;
      default:
        return <WbSunny color="primary" />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <LinearProgress sx={{ width: "100%" }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name}! 🌾
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's your farm dashboard overview
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        <Box flex="1 1 250px" minWidth="250px">
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Farms
                  </Typography>
                  <Typography variant="h4">{stats.totalFarms}</Typography>
                </Box>
                <Agriculture color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 250px" minWidth="250px">
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Farms
                  </Typography>
                  <Typography variant="h4">{stats.activeFarms}</Typography>
                </Box>
                <Schedule color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 250px" minWidth="250px">
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Investment
                  </Typography>
                  <Typography variant="h4">
                    ₦{(stats.totalInvestment || 0).toLocaleString()}
                  </Typography>
                </Box>
                <AttachMoney color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 250px" minWidth="250px">
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Average ROI
                  </Typography>
                  <Typography variant="h4">{stats.avgROI}%</Typography>
                </Box>
                <EmojiEvents color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* Weather Card */}
        <Box flex="1 1 400px" minWidth="400px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weather Overview
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                {getWeatherIcon(weather.condition)}
                <Box>
                  <Typography variant="h4">{weather.temperature}°C</Typography>
                  <Typography color="text.secondary">
                    {weather.condition}
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Humidity: {weather.humidity}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {weather.location}
                  </Typography>
                </Box>
                <Chip
                  label={weather.forecast}
                  color={
                    (weather.forecast || "").includes("Good")
                      ? "success"
                      : "warning"
                  }
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Notifications */}
        <Box flex="1 1 400px" minWidth="400px">
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Typography variant="h6">Recent Notifications</Typography>
                <IconButton onClick={() => navigate("/notifications")}>
                  <Notifications />
                </IconButton>
              </Box>
              <List>
                {(notifications || []).slice(0, 3).map((notification) => (
                  <ListItem
                    key={notification?._id || Math.random()}
                    disablePadding
                  >
                    <ListItemIcon>
                      {notification?.type === "warning" && (
                        <Warning color="warning" />
                      )}
                      {notification?.type === "error" && (
                        <Warning color="error" />
                      )}
                      {notification?.type === "success" && (
                        <CheckCircle color="success" />
                      )}
                      {notification?.type === "info" && <Info color="info" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification?.title || "Notification"}
                      secondary={notification?.message || "No message"}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                endIcon={<ArrowForward />}
                onClick={() => navigate("/notifications")}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Button
            variant="contained"
            startIcon={<Agriculture />}
            onClick={() => navigate("/crop-diagnosis")}
          >
            Diagnose Crop
          </Button>
          <Button
            variant="outlined"
            startIcon={<Schedule />}
            onClick={() => navigate("/calendar")}
          >
            View Calendar
          </Button>
          <Button
            variant="outlined"
            startIcon={<AttachMoney />}
            onClick={() => navigate("/market")}
          >
            Market Prices
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
