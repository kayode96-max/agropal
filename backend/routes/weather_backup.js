const express = require("express");
const axios = require("axios");
const router = express.Router();

// Check if we should use mock data or real API
const USE_MOCK_WEATHER = process.env.USE_MOCK_WEATHER === 'true';
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Mock weather data for MVP (replace with OpenWeatherMap API)
const mockWeatherData = {
  lagos: {
    current: {
      location: "Lagos, Nigeria",
      temperature: 28,
      humidity: 75,
      windSpeed: 15,
      description: "Partly cloudy",
      icon: "02d",
      pressure: 1012,
      visibility: 8,
      uvIndex: 7,
    },
    forecast: [
      {
        date: "2025-01-11",
        high: 30,
        low: 24,
        description: "Sunny",
        humidity: 70,
        precipitation: 0,
        suitable_activities: ["Planting", "Harvesting", "Spraying"],
      },
      {
        date: "2025-01-12",
        high: 29,
        low: 23,
        description: "Light rain",
        humidity: 85,
        precipitation: 60,
        suitable_activities: ["Indoor work", "Planning"],
      },
      {
        date: "2025-01-13",
        high: 31,
        low: 25,
        description: "Partly cloudy",
        humidity: 72,
        precipitation: 5,
        suitable_activities: ["Weeding", "Fertilizing"],
      },
    ],
    alerts: [
      {
        type: "advisory",
        title: "High Humidity Alert",
        description: "High humidity levels may increase risk of fungal diseases",
        severity: "medium",
        issued: "2025-01-10T08:00:00Z",
        expires: "2025-01-12T18:00:00Z",
      },
    ],
    agricultural_insights: {
      soil_moisture: "Good",
      disease_risk: "Medium",
      recommendations: [
        "Monitor crops for fungal diseases",
        "Ensure proper drainage",
        "Apply preventive fungicide if needed",
      ],
    },
  },
  abuja: {
    current: {
      location: "Abuja, Nigeria",
      temperature: 26,
      humidity: 65,
      windSpeed: 12,
      description: "Clear sky",
      icon: "01d",
      pressure: 1015,
      visibility: 10,
      uvIndex: 8,
    },
    forecast: [
      {
        date: "2025-01-11",
        high: 28,
        low: 20,
        description: "Sunny",
        humidity: 60,
        precipitation: 0,
        suitable_activities: ["Planting", "Harvesting", "Spraying"],
      },
      {
        date: "2025-01-12",
        high: 27,
        low: 19,
        description: "Partly cloudy",
        humidity: 65,
        precipitation: 10,
        suitable_activities: ["Weeding", "Fertilizing"],
      },
    ],
    alerts: [],
    agricultural_insights: {
      soil_moisture: "Moderate",
      disease_risk: "Low",
      recommendations: [
        "Good conditions for most farming activities",
        "Continue regular irrigation schedule",
        "Monitor for pests during dry periods",
      ],
    },
  },
  kano: {
    current: {
      location: "Kano, Nigeria",
      temperature: 24,
      humidity: 55,
      windSpeed: 18,
      description: "Dusty",
      icon: "50d",
      pressure: 1018,
      visibility: 6,
      uvIndex: 9,
    },
    forecast: [
      {
        date: "2025-01-11",
        high: 26,
        low: 18,
        description: "Dusty",
        humidity: 50,
        precipitation: 0,
        suitable_activities: ["Indoor work", "Equipment maintenance"],
      },
      {
        date: "2025-01-12",
        high: 25,
        low: 17,
        description: "Clear",
        humidity: 55,
        precipitation: 0,
        suitable_activities: ["Planting", "Harvesting"],
      },
    ],
    alerts: [
      {
        type: "warning",
        title: "Dust Storm Warning",
        description: "Harmattan winds bringing dust - protect crops and equipment",
        severity: "high",
        issued: "2025-01-10T06:00:00Z",
        expires: "2025-01-11T18:00:00Z",
      },
    ],
    agricultural_insights: {
      soil_moisture: "Low",
      disease_risk: "Low",
      recommendations: [
        "Increase irrigation frequency",
        "Protect young plants from dust",
        "Check equipment for dust damage",
      ],
    },
  },
  // Default fallback
  nairobi: {
    current: {
      location: "Default Location",
      temperature: 22,
      humidity: 65,
      windSpeed: 12,
      description: "Partly cloudy",
      icon: "02d",
      pressure: 1015,
      visibility: 10,
      uvIndex: 6,
    },
    forecast: [
      {
        date: "2025-01-11",
        high: 25,
        low: 18,
        description: "Sunny",
        humidity: 60,
        precipitation: 0,
        suitable_activities: ["Planting", "Harvesting", "Spraying"],
      },
    ],
    alerts: [],
    agricultural_insights: {
      soil_moisture: "Good",
      disease_risk: "Low",
      recommendations: [
        "Good conditions for farming",
        "Continue regular activities",
      ],
    },
  },
};
        title: "Light Rain Expected",
        description:
          "Light rainfall expected tomorrow. Good time for transplanting seedlings.",
        severity: "low",
        validUntil: "2025-01-12T18:00:00Z",
      },
    ],
    agricultural_insights: {
      soil_moisture: "Adequate",
      planting_conditions: "Good",
      pest_risk: "Low",
      disease_risk: "Medium",
      recommendations: [
        "Good conditions for planting drought-resistant crops",
        "Monitor for fungal diseases due to humidity",
        "Ideal weather for outdoor farm activities",
      ],
    },
  },
  kampala: {
    current: {
      location: "Kampala, Uganda",
      temperature: 24,
      humidity: 75,
      windSpeed: 8,
      description: "Thunderstorms",
      icon: "11d",
      pressure: 1012,
      visibility: 8,
      uvIndex: 4,
    },
    forecast: [
      {
        date: "2025-01-11",
        high: 27,
        low: 20,
        description: "Heavy rain",
        humidity: 85,
        precipitation: 90,
        suitable_activities: ["Indoor planning", "Equipment maintenance"],
      },
      {
        date: "2025-01-12",
        high: 25,
        low: 19,
        description: "Overcast",
        humidity: 70,
        precipitation: 30,
        suitable_activities: ["Light outdoor work"],
      },
    ],
    alerts: [
      {
        type: "warning",
        title: "Heavy Rain Warning",
        description:
          "Heavy rainfall expected. Avoid outdoor activities and protect crops.",
        severity: "high",
        validUntil: "2025-01-11T20:00:00Z",
      },
    ],
    agricultural_insights: {
      soil_moisture: "Excessive",
      planting_conditions: "Poor",
      pest_risk: "Medium",
      disease_risk: "High",
      recommendations: [
        "Ensure proper drainage in fields",
        "Monitor crops for waterlogging",
        "Postpone fertilizer application",
      ],
    },
  },
};

// GET /api/weather/current/:location - Get current weather
router.get("/current/:location", async (req, res) => {
  try {
    const location = req.params.location.toLowerCase();

    let weatherData;
    
    if (USE_MOCK_WEATHER || !OPENWEATHER_API_KEY) {
      // Use mock data
      weatherData = mockWeatherData[location] || mockWeatherData["nairobi"];
      res.json({
        success: true,
        weather: weatherData.current,
        source: "mock",
        message: "Using mock weather data for development",
      });
    } else {
      // Use real API
      const realWeatherData = await fetchWeatherFromAPI(location);
      res.json({
        success: true,
        weather: realWeatherData.current,
        source: "openweather",
        message: "Live weather data from OpenWeatherMap",
      });
    }
  } catch (error) {
    console.error("Weather API error:", error);
    
    // Fallback to mock data on error
    const location = req.params.location.toLowerCase();
    const weatherData = mockWeatherData[location] || mockWeatherData["nairobi"];
    
    res.json({
      success: true,
      weather: weatherData.current,
      source: "mock_fallback",
      message: "Weather API unavailable, using mock data",
      error: error.message,
    });
  }
});
      agricultural_insights: weatherData.agricultural_insights,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Weather fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch weather data",
      message: error.message,
    });
  }
});

// GET /api/weather/forecast/:location - Get weather forecast
router.get("/forecast/:location", async (req, res) => {
  try {
    const location = req.params.location.toLowerCase();
    const days = parseInt(req.query.days) || 3;

    // For MVP, use mock data
    const weatherData = mockWeatherData[location] || mockWeatherData["nairobi"];
    const forecast = weatherData.forecast.slice(0, days);

    res.json({
      success: true,
      location: weatherData.current.location,
      forecast: forecast,
      alerts: weatherData.alerts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Forecast fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch forecast data",
      message: error.message,
    });
  }
});

// GET /api/weather/alerts/:location - Get weather alerts
router.get("/alerts/:location", async (req, res) => {
  try {
    const location = req.params.location.toLowerCase();

    const weatherData = mockWeatherData[location] || mockWeatherData["nairobi"];

    res.json({
      success: true,
      location: weatherData.current.location,
      alerts: weatherData.alerts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Alerts fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch alerts",
      message: error.message,
    });
  }
});

// GET /api/weather/farming-calendar/:location - Get farming calendar based on weather
router.get("/farming-calendar/:location", async (req, res) => {
  try {
    const location = req.params.location.toLowerCase();

    // Mock farming calendar data
    const farmingCalendar = {
      nairobi: {
        current_season: "Dry season",
        recommended_crops: [
          {
            name: "Maize",
            planting_window: "2025-03-01 to 2025-04-30",
            harvest_window: "2025-07-01 to 2025-08-31",
            suitability: "high",
          },
          {
            name: "Beans",
            planting_window: "2025-03-15 to 2025-04-15",
            harvest_window: "2025-06-15 to 2025-07-15",
            suitability: "medium",
          },
          {
            name: "Tomatoes",
            planting_window: "2025-01-15 to 2025-02-28",
            harvest_window: "2025-04-15 to 2025-06-30",
            suitability: "high",
          },
        ],
        monthly_activities: {
          January: [
            "Land preparation",
            "Nursery establishment",
            "Irrigation system check",
          ],
          February: ["Transplanting", "Weed control", "Pest monitoring"],
          March: ["Planting main season crops", "Fertilizer application"],
        },
      },
    };

    const calendar = farmingCalendar[location] || farmingCalendar["nairobi"];

    res.json({
      success: true,
      location: location,
      calendar: calendar,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Farming calendar error:", error);
    res.status(500).json({
      error: "Failed to fetch farming calendar",
      message: error.message,
    });
  }
});

// OpenWeatherMap API integration
async function fetchWeatherFromAPI(location) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const baseUrl = 'https://api.openweathermap.org/data/2.5';
  
  try {
    const currentWeather = await axios.get(
      `${baseUrl}/weather?q=${location}&appid=${API_KEY}&units=metric`
    );
    
    const forecast = await axios.get(
      `${baseUrl}/forecast?q=${location}&appid=${API_KEY}&units=metric`
    );
    
    // Transform the data to match our expected format
    const transformedData = {
      current: {
        location: `${currentWeather.data.name}, ${currentWeather.data.sys.country}`,
        temperature: Math.round(currentWeather.data.main.temp),
        humidity: currentWeather.data.main.humidity,
        windSpeed: Math.round(currentWeather.data.wind.speed * 3.6), // Convert m/s to km/h
        description: currentWeather.data.weather[0].description,
        icon: currentWeather.data.weather[0].icon,
        pressure: currentWeather.data.main.pressure,
        visibility: currentWeather.data.visibility ? Math.round(currentWeather.data.visibility / 1000) : 10,
        uvIndex: 5, // OpenWeatherMap doesn't provide UV index in basic plan
      },
      forecast: forecast.data.list.slice(0, 5).map(item => ({
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        description: item.weather[0].description,
        humidity: item.main.humidity,
        precipitation: item.rain ? (item.rain['3h'] || 0) : 0,
        suitable_activities: getSuitableActivities(item.weather[0].main, item.main.temp)
      }))
    };
    
    return transformedData;
  } catch (error) {
    throw new Error(`Weather API error: ${error.message}`);
  }
}

// Helper function to suggest suitable farming activities based on weather
function getSuitableActivities(weatherMain, temperature) {
  const activities = [];
  
  if (weatherMain === 'Clear' && temperature > 20) {
    activities.push('Planting', 'Harvesting', 'Spraying');
  } else if (weatherMain === 'Rain') {
    activities.push('Indoor work', 'Planning');
  } else if (weatherMain === 'Clouds') {
    activities.push('Weeding', 'Fertilizing');
  } else {
    activities.push('Monitoring crops');
  }
  
  return activities;
}

module.exports = router;
