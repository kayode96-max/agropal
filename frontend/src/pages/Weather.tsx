import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  Grid,
  Button,
  TextField,
  Alert,
  LinearProgress,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  WbSunny,
  Cloud,
  Grain,
  Air,
  Visibility,
  Thermostat,
  Water,
  LocationOn,
  Refresh,
  Agriculture,
  CalendarToday,
  Warning,
} from "@mui/icons-material";
import { weatherAPI } from "../utils/api";

interface WeatherData {
  location: {
    state: string;
    lga: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
    humidity: number;
    windSpeed: number;
  }>;
  agricultural: {
    soilMoisture: string;
    plantingConditions: string;
    pestRisk: string;
    irrigation: string;
    recommendations: string[];
  };
  farmingCalendar?: {
    currentSeason: string;
    upcomingActivities: Array<{
      activity: string;
      timeframe: string;
      priority: string;
    }>;
  };
  alerts?: Array<{
    type: string;
    message: string;
    severity: string;
  }>;
}

const nigerianStates = [
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

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedState, setSelectedState] = useState("Lagos");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeatherData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Use the location in the URL path as expected by the backend
      const location = selectedLGA
        ? `${selectedState}/${selectedLGA}`
        : selectedState;
      console.log(
        "Calling weatherAPI.getCurrentWeather with location:",
        location
      );
      const response = await weatherAPI.getCurrentWeather(location);
      console.log("Weather API response:", response.data);

      setWeatherData(response.data.data);
    } catch (err: any) {
      console.error("Weather fetch error:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        url: err.config?.url,
        data: err.response?.data,
      });
      setError(err.response?.data?.message || "Failed to fetch weather data");
      // No fallback - show the actual error
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedLGA]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const getWeatherIcon = (condition: string) => {
    const normalizedCondition = condition.toLowerCase();
    if (
      normalizedCondition.includes("sunny") ||
      normalizedCondition.includes("clear")
    ) {
      return <WbSunny sx={{ color: "#FFD700" }} />;
    } else if (normalizedCondition.includes("cloud")) {
      return <Cloud sx={{ color: "#87CEEB" }} />;
    } else if (
      normalizedCondition.includes("rain") ||
      normalizedCondition.includes("storm")
    ) {
      return <Grain sx={{ color: "#4682B4" }} />;
    } else {
      return <WbSunny sx={{ color: "#FFD700" }} />;
    }
  };

  const getConditionColor = (condition: string): string => {
    const normalized = condition.toLowerCase();
    if (normalized.includes("sunny")) return "#FFD700";
    if (normalized.includes("rain") || normalized.includes("storm"))
      return "#4682B4";
    if (normalized.includes("cloud")) return "#87CEEB";
    return "#FFA726";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          🌤️ Nigerian Weather Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Real-time weather data and agricultural insights for Nigerian farmers
        </Typography>
      </Box>

      {/* Location Selection */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          📍 Select Your Location
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState}
                label="State"
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {nigerianStates.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              label="Local Government Area (Optional)"
              value={selectedLGA}
              onChange={(e) => setSelectedLGA(e.target.value)}
              placeholder="e.g., Ikeja, Surulere"
            />
          </Grid>
          <Grid xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchWeatherData}
              disabled={loading}
              startIcon={<Refresh />}
              sx={{ height: 56 }}
            >
              {loading ? "Loading..." : "Get Weather"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
            Fetching weather data for {selectedState}...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {weatherData && (
        <>
          {/* Weather Alerts */}
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <Box sx={{ mb: 4 }}>
              {weatherData.alerts.map((alert, index) => (
                <Alert
                  key={index}
                  severity={alert.severity as any}
                  icon={<Warning />}
                  sx={{ mb: 1 }}
                >
                  <strong>{alert.type} Alert:</strong> {alert.message}
                </Alert>
              ))}
            </Box>
          )}

          {/* Current Weather */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">
                {weatherData.location?.state || "Unknown Location"}
                {weatherData.location?.lga && `, ${weatherData.location.lga}`}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {getWeatherIcon(weatherData.current?.condition || "Unknown")}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h3" component="div" fontWeight="bold">
                      {weatherData.current?.temperature || 0}°C
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      {weatherData.current?.condition || "Unknown"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Water sx={{ mr: 1, color: "#2196F3" }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Humidity
                        </Typography>
                        <Typography variant="h6">
                          {weatherData.current?.humidity || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Air sx={{ mr: 1, color: "#607D8B" }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Wind Speed
                        </Typography>
                        <Typography variant="h6">
                          {weatherData.current?.windSpeed || 0} km/h
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Thermostat sx={{ mr: 1, color: "#FF5722" }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Pressure
                        </Typography>
                        <Typography variant="h6">
                          {weatherData.current?.pressure || 0} hPa
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Visibility sx={{ mr: 1, color: "#9C27B0" }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          UV Index
                        </Typography>
                        <Typography variant="h6">
                          {weatherData.current?.uvIndex || 0}/10
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* 5-Day Forecast */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              📅 5-Day Forecast
            </Typography>
            <Grid container spacing={2}>
              {(weatherData.forecast || []).map((day, index) => (
                <Grid xs={12} sm={6} md={2.4} key={index}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderTop: `3px solid ${getConditionColor(
                        day.condition
                      )}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {formatDate(day.date)}
                    </Typography>
                    {getWeatherIcon(day.condition)}
                    <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                      {day.condition}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {day.high}°/{day.low}°
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {day.precipitation}% rain
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Agricultural Insights */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              🌾 Agricultural Insights
            </Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Current Conditions
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={`Soil: ${
                        weatherData.agricultural?.soilMoisture || "N/A"
                      }`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Pest Risk: ${
                        weatherData.agricultural?.pestRisk || "N/A"
                      }`}
                      color="warning"
                      variant="outlined"
                    />
                    <Chip
                      label={`Irrigation: ${
                        weatherData.agricultural?.irrigation || "N/A"
                      }`}
                      color="info"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Planting Conditions:</strong>{" "}
                    {weatherData.agricultural?.plantingConditions ||
                      "Information not available"}
                  </Typography>
                </Box>
              </Grid>

              <Grid xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  💡 Recommendations
                </Typography>
                <Box>
                  {(weatherData.agricultural?.recommendations || []).map(
                    (rec, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <Agriculture
                          sx={{
                            mr: 1,
                            mt: 0.5,
                            fontSize: 16,
                            color: "primary.main",
                          }}
                        />
                        {rec}
                      </Typography>
                    )
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Farming Calendar */}
          {weatherData.farmingCalendar && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                📋 Farming Calendar -{" "}
                {weatherData.farmingCalendar.currentSeason}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Upcoming agricultural activities based on seasonal patterns
              </Typography>

              <Grid container spacing={2}>
                {weatherData.farmingCalendar.upcomingActivities.map(
                  (activity, index) => (
                    <Grid xs={12} md={4} key={index}>
                      <Card sx={{ p: 2, height: "100%" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <CalendarToday
                            sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                          />
                          <Chip
                            label={activity.priority}
                            size="small"
                            color={
                              activity.priority === "High" ? "error" : "primary"
                            }
                          />
                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {activity.activity}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {activity.timeframe}
                        </Typography>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default Weather;
