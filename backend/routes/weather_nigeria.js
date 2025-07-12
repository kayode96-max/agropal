const express = require("express");
const axios = require("axios");
const {
  WeatherData,
  WeatherAlert,
  SeasonalCalendar,
} = require("../models/Weather");
const router = express.Router();

// Nigerian weather zones mapping
const NIGERIAN_WEATHER_ZONES = {
  sahel: ["Borno", "Yobe", "Jigawa", "Katsina", "Sokoto", "Kebbi", "Zamfara"],
  sudan_savanna: ["Kano", "Kaduna", "Bauchi", "Gombe", "Adamawa"],
  guinea_savanna: [
    "Niger",
    "FCT",
    "Kwara",
    "Kogi",
    "Plateau",
    "Benue",
    "Taraba",
    "Nasarawa",
  ],
  derived_savanna: ["Oyo"],
  forest: [
    "Ogun",
    "Ondo",
    "Osun",
    "Ekiti",
    "Edo",
    "Delta",
    "Cross River",
    "Akwa Ibom",
    "Abia",
    "Imo",
    "Anambra",
    "Enugu",
    "Ebonyi",
  ],
  coastal: ["Lagos"],
  mangrove: ["Bayelsa", "Rivers"],
};

// Get current weather by location
router.get("/current/:state", async (req, res) => {
  try {
    const { state } = req.params;
    const { lga } = req.query;

    // Get state coordinates (simplified - in production use a proper geocoding service)
    const stateCoordinates = getStateCoordinates(state);
    if (!stateCoordinates) {
      return res.status(400).json({
        success: false,
        message: "Invalid Nigerian state provided",
      });
    }

    // Try to get real weather data from OpenWeatherMap
    let weatherData;
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${stateCoordinates.lat}&lon=${stateCoordinates.lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
      );

      const weather = weatherResponse.data;
      weatherData = {
        location: {
          state,
          lga: lga || "All",
          coordinates: stateCoordinates,
          name: state,
        },
        current: {
          temperature: Math.round(weather.main.temp),
          feelsLike: Math.round(weather.main.feels_like),
          humidity: weather.main.humidity,
          pressure: weather.main.pressure,
          windSpeed: Math.round(weather.wind?.speed * 3.6 || 0), // Convert m/s to km/h
          windDirection: weather.wind?.deg || 0,
          visibility: Math.round((weather.visibility || 10000) / 1000), // Convert meters to km
          cloudCover: weather.clouds?.all || 0,
          condition: weather.weather[0]?.main || "Unknown",
          icon: weather.weather[0]?.icon || "01d",
          description: weather.weather[0]?.description || "No description",
        },
        forecast: generateForecast(
          Math.round(weather.main.temp),
          weather.main.humidity
        ),
        agricultural: {
          soilMoisture: generateSoilMoisture(weather.main.humidity),
          plantingConditions: generatePlantingConditions(
            weather.main.temp,
            weather.main.humidity
          ),
          pestRisk: generatePestRisk(weather.main.temp, weather.main.humidity),
          irrigation: generateIrrigation(weather.main.humidity),
          recommendations: generateRecommendations(
            weather.main.temp,
            weather.main.humidity,
            state
          ),
        },
        agriculturalAlerts: generateAgriculturalAlerts(weather, state),
        farmingRecommendations: generateFarmingRecommendations(weather, state),
        seasonalInfo: getSeasonalInfo(state, new Date()),
      };
    } catch (apiError) {
      console.warn(
        "OpenWeatherMap API failed, using mock data:",
        apiError.message
      );

      // Fallback to mock data if API fails
      weatherData = {
        location: {
          state,
          lga: lga || "All",
          coordinates: stateCoordinates,
          name: state,
        },
        current: {
          temperature: 28,
          feelsLike: 32,
          humidity: 75,
          pressure: 1013,
          windSpeed: 8,
          windDirection: 180,
          visibility: 10,
          cloudCover: 60,
          condition: "Partly Cloudy",
          icon: "02d",
          description: "Partly cloudy with chance of rain",
        },
        forecast: generateForecast(28, 75), // Use mock values for fallback
        agricultural: {
          soilMoisture: "Moderate",
          plantingConditions: "Good for planting yam and cassava",
          pestRisk: "Low",
          irrigation: "Recommended due to recent rainfall",
          recommendations: [
            "Monitor soil moisture levels",
            "Apply organic fertilizer",
            "Check for pest infestation",
            "Prepare for harvest season",
          ],
        },
        agriculturalAlerts: generateAgriculturalAlerts(
          { main: { temp: 28, humidity: 75 } },
          state
        ),
        farmingRecommendations: generateFarmingRecommendations(
          { main: { temp: 28, humidity: 75 } },
          state
        ),
        seasonalInfo: getSeasonalInfo(state, new Date()),
      };
    }

    res.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error("Weather fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Weather service unavailable",
    });
  }
});

// Get farming calendar for a specific state and month
router.get("/calendar/:state/:month", async (req, res) => {
  try {
    const { state, month } = req.params;
    const monthNum = parseInt(month);

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    // Mock calendar data for Nigerian states
    const mockCalendar = {
      state,
      month: monthNum,
      activities: getMonthlyActivities(state, monthNum),
      weatherPattern: getWeatherPattern(state, monthNum),
      marketInfo: getMarketInfo(state, monthNum),
    };

    res.json({
      success: true,
      data: mockCalendar,
    });
  } catch (error) {
    console.error("Calendar fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch farming calendar",
    });
  }
});

// Get weather alerts for a state
router.get("/alerts/:state", async (req, res) => {
  try {
    const { state } = req.params;

    const mockAlerts = [
      {
        type: "severe_weather",
        title: "Heavy Rainfall Expected",
        message: `Heavy rains expected in ${state} over the next 48 hours. Ensure proper drainage.`,
        severity: "warning",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000),
        actionItems: [
          "Check drainage systems",
          "Protect young seedlings",
          "Harvest mature crops if possible",
        ],
      },
    ];

    res.json({
      success: true,
      data: mockAlerts,
    });
  } catch (error) {
    console.error("Alerts fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weather alerts",
    });
  }
});

// Get historical weather patterns
router.get("/patterns/:state", async (req, res) => {
  try {
    const { state } = req.params;

    // Get weather zone for the state
    const zone = Object.keys(NIGERIAN_WEATHER_ZONES).find((z) =>
      NIGERIAN_WEATHER_ZONES[z].includes(state)
    );

    const patterns = {
      zone,
      rainySeasonStart: getRainySeasonStart(zone),
      rainySeasonEnd: getRainySeasonEnd(zone),
      drySeasonStart: getDrySeasonStart(zone),
      harmattanPeriod: getHarmattanPeriod(zone),
      averageAnnualRainfall: getAverageRainfall(zone),
      temperatureRange: getTemperatureRange(zone),
      recommendations: getSeasonalRecommendations(
        zone,
        new Date().getMonth() + 1
      ),
    };

    res.json({
      success: true,
      data: patterns,
    });
  } catch (error) {
    console.error("Patterns fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weather patterns",
    });
  }
});

// Helper functions
function getStateCoordinates(state) {
  const coordinates = {
    Abia: { lat: 5.4527, lon: 7.5248 },
    Adamawa: { lat: 9.3265, lon: 12.3984 },
    "Akwa Ibom": { lat: 5.0077, lon: 7.8536 },
    Anambra: { lat: 6.2207, lon: 6.9977 },
    Bauchi: { lat: 10.3158, lon: 9.8442 },
    Bayelsa: { lat: 4.7719, lon: 6.0699 },
    Benue: { lat: 7.1906, lon: 8.1278 },
    Borno: { lat: 11.8846, lon: 13.1571 },
    "Cross River": { lat: 5.9631, lon: 8.3257 },
    Delta: { lat: 5.6815, lon: 5.9099 },
    Ebonyi: { lat: 6.2649, lon: 8.0137 },
    Edo: { lat: 6.335, lon: 5.6037 },
    Ekiti: { lat: 7.7319, lon: 5.311 },
    Enugu: { lat: 6.5244, lon: 7.5086 },
    FCT: { lat: 9.0579, lon: 7.4951 },
    Gombe: { lat: 10.2904, lon: 11.1669 },
    Imo: { lat: 5.4966, lon: 7.034 },
    Jigawa: { lat: 12.223, lon: 9.5593 },
    Kaduna: { lat: 10.5222, lon: 7.4383 },
    Kano: { lat: 12.0022, lon: 8.592 },
    Katsina: { lat: 12.9908, lon: 7.6018 },
    Kebbi: { lat: 12.4539, lon: 4.1975 },
    Kogi: { lat: 7.8007, lon: 6.7393 },
    Kwara: { lat: 8.967, lon: 4.3876 },
    Lagos: { lat: 6.5244, lon: 3.3792 },
    Nasarawa: { lat: 8.5378, lon: 8.3206 },
    Niger: { lat: 10.2305, lon: 5.1968 },
    Ogun: { lat: 7.1608, lon: 3.3475 },
    Ondo: { lat: 7.2526, lon: 5.2066 },
    Osun: { lat: 7.5629, lon: 4.52 },
    Oyo: { lat: 8.1559, lon: 3.5966 },
    Plateau: { lat: 9.2182, lon: 9.5179 },
    Rivers: { lat: 4.8156, lon: 6.9994 },
    Sokoto: { lat: 13.0059, lon: 5.2476 },
    Taraba: { lat: 7.8732, lon: 11.3598 },
    Yobe: { lat: 11.7467, lon: 11.9668 },
    Zamfara: { lat: 12.1667, lon: 6.25 },
  };

  return coordinates[state] || null;
}

function generateForecast(baseTemp = 26, baseHumidity = 75) {
  const forecast = [];
  const conditions = [
    "Sunny",
    "Partly Cloudy",
    "Cloudy",
    "Light Rain",
    "Thunderstorms",
  ];

  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Generate more realistic temperatures based on current weather
    const tempVariation = (Math.random() - 0.5) * 6; // ±3°C variation
    const minTemp = baseTemp - 4 + tempVariation;
    const maxTemp = baseTemp + 4 + tempVariation;

    // Generate more realistic precipitation based on season
    const month = new Date().getMonth();
    let precipitationChance;
    if (month >= 3 && month <= 9) {
      // Rainy season (April-October)
      precipitationChance = 30 + Math.random() * 50; // 30-80% chance
    } else {
      // Dry season
      precipitationChance = Math.random() * 20; // 0-20% chance
    }

    // Select random condition
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    forecast.push({
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      high: Math.round(Math.max(minTemp, maxTemp)),
      low: Math.round(Math.min(minTemp, maxTemp)),
      condition: condition,
      precipitation: Math.round(precipitationChance),
      humidity: Math.round(baseHumidity + (Math.random() - 0.5) * 20), // ±10% variation
      windSpeed: Math.round(5 + Math.random() * 10),
      icon: condition.includes("Rain")
        ? "10d"
        : condition.includes("Thunder")
        ? "11d"
        : condition === "Sunny"
        ? "01d"
        : "02d",
      description: `${condition.toLowerCase()} conditions expected`,
    });
  }
  return forecast;
}

function generateAgriculturalAlerts(weather, state) {
  const alerts = [];
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;

  if (temp > 35) {
    alerts.push({
      type: "high_wind_warning",
      severity: "moderate",
      message:
        "High temperature detected. Ensure adequate irrigation for crops.",
      actionRequired:
        "Increase watering frequency, provide shade for sensitive crops",
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      affectedCrops: ["tomato", "pepper", "vegetables"],
    });
  }

  if (humidity > 80) {
    alerts.push({
      type: "disease_outbreak_risk",
      severity: "high",
      message: "High humidity increases disease risk. Monitor crops closely.",
      actionRequired: "Apply preventive fungicide, improve air circulation",
      validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000),
      affectedCrops: ["cassava", "yam", "maize"],
    });
  }

  return alerts;
}

function generateFarmingRecommendations(weather, state) {
  const recommendations = [];
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;

  if (temp >= 25 && temp <= 30 && humidity >= 60) {
    recommendations.push({
      activity: "planting",
      timing: "optimal",
      suitability: "excellent",
      crops: ["cassava", "yam", "maize"],
      notes: "Perfect conditions for planting major crops",
    });
  }

  return recommendations;
}

function getSeasonalInfo(state, date) {
  const month = date.getMonth() + 1;

  const zone = Object.keys(NIGERIAN_WEATHER_ZONES).find((z) =>
    NIGERIAN_WEATHER_ZONES[z].includes(state)
  );

  let season = "dry_season";
  if (zone === "sahel" && month >= 6 && month <= 9) {
    season = "wet_season";
  } else if (
    (zone === "sudan_savanna" || zone === "guinea_savanna") &&
    month >= 5 &&
    month <= 10
  ) {
    season = "wet_season";
  } else if (zone === "forest" && month >= 4 && month <= 11) {
    season = "wet_season";
  } else if (month >= 12 || month <= 2) {
    season = "harmattan";
  }

  return {
    season,
    averageTemperature: getZoneAverageTemp(zone, month),
    daysToSeasonChange: getDaysToSeasonChange(season, month),
  };
}

function getMonthlyActivities(state, month) {
  // Mock data for different crops based on Nigerian farming calendar
  const activities = [
    {
      crop: "cassava",
      activity:
        month >= 3 && month <= 5
          ? "planting"
          : month >= 18 && month <= 24
          ? "harvesting"
          : "maintenance",
      timing: "early month",
      priority: "high",
      description: "Plant cassava stems after first rains",
      tips: [
        "Select healthy stems",
        "Plant at 45-degree angle",
        "Ensure good drainage",
      ],
    },
    {
      crop: "maize",
      activity:
        month >= 4 && month <= 6
          ? "planting"
          : month >= 10 && month <= 12
          ? "harvesting"
          : "land_preparation",
      timing: "mid month",
      priority: "high",
      description: "Plant maize after soil preparation",
      tips: [
        "Use certified seeds",
        "Apply basal fertilizer",
        "Maintain proper spacing",
      ],
    },
  ];

  return activities;
}

function getWeatherPattern(state, month) {
  return {
    expectedRainfall: 150,
    temperatureRange: { min: 24, max: 32 },
    humidity: 70,
    commonConditions: ["partly_cloudy", "scattered_showers"],
  };
}

function getMarketInfo(state, month) {
  return {
    expectedPrices: [
      {
        crop: "cassava",
        priceRange: { min: 80000, max: 120000 },
        unit: "per ton",
      },
      {
        crop: "yam",
        priceRange: { min: 200000, max: 300000 },
        unit: "per ton",
      },
    ],
    harvestingSeason: ["cassava", "yam"],
  };
}

function getRainySeasonStart(zone) {
  const starts = {
    sahel: "June",
    sudan_savanna: "May",
    guinea_savanna: "April",
    forest: "March",
    coastal: "March",
  };
  return starts[zone] || "April";
}

function getRainySeasonEnd(zone) {
  const ends = {
    sahel: "September",
    sudan_savanna: "October",
    guinea_savanna: "October",
    forest: "November",
    coastal: "November",
  };
  return ends[zone] || "October";
}

function getDrySeasonStart(zone) {
  const starts = {
    sahel: "October",
    sudan_savanna: "November",
    guinea_savanna: "November",
    forest: "December",
    coastal: "December",
  };
  return starts[zone] || "November";
}

function getHarmattanPeriod(zone) {
  return {
    start: "December",
    end: "February",
    characteristics: "Dry, dusty winds from the Sahara",
  };
}

function getAverageRainfall(zone) {
  const rainfall = {
    sahel: "200-600mm",
    sudan_savanna: "600-1000mm",
    guinea_savanna: "1000-1500mm",
    forest: "1500-3000mm",
    coastal: "2000-4000mm",
  };
  return rainfall[zone] || "1000-1500mm";
}

function getTemperatureRange(zone) {
  const ranges = {
    sahel: { min: 15, max: 45 },
    sudan_savanna: { min: 18, max: 42 },
    guinea_savanna: { min: 20, max: 38 },
    forest: { min: 22, max: 35 },
    coastal: { min: 24, max: 32 },
  };
  return ranges[zone] || ranges["guinea_savanna"];
}

function getSeasonalRecommendations(zone, month) {
  return [
    "Monitor weather forecasts daily",
    "Adjust irrigation based on rainfall",
    "Prepare for seasonal crop diseases",
  ];
}

function getZoneAverageTemp(zone, month) {
  const tempRanges = {
    sahel: { min: 20, max: 40 },
    sudan_savanna: { min: 22, max: 38 },
    guinea_savanna: { min: 24, max: 35 },
    forest: { min: 25, max: 32 },
    coastal: { min: 24, max: 30 },
  };

  const range = tempRanges[zone] || tempRanges["guinea_savanna"];
  return (range.min + range.max) / 2;
}

function getDaysToSeasonChange(currentSeason, month) {
  if (currentSeason === "dry_season" && month < 4) {
    return (4 - month) * 30;
  } else if (currentSeason === "wet_season" && month > 10) {
    return (12 - month) * 30;
  }
  return 0;
}

// Helper functions for agricultural data generation based on real weather
function generateSoilMoisture(humidity) {
  if (humidity > 80) return "High";
  if (humidity > 60) return "Moderate";
  if (humidity > 40) return "Low";
  return "Very Low";
}

function generatePlantingConditions(temp, humidity) {
  if (temp >= 25 && temp <= 35 && humidity > 60) {
    return "Excellent for planting yam, cassava, and maize";
  } else if (temp >= 20 && temp <= 40 && humidity > 40) {
    return "Good for planting drought-resistant crops";
  } else if (temp < 20) {
    return "Cool conditions, suitable for vegetables";
  } else {
    return "Hot and dry, irrigation required for planting";
  }
}

function generatePestRisk(temp, humidity) {
  if (temp > 30 && humidity > 70) return "High";
  if (temp > 25 && humidity > 60) return "Moderate";
  if (temp < 20 || humidity < 40) return "Low";
  return "Low";
}

function generateIrrigation(humidity) {
  if (humidity < 40) return "Immediate irrigation required";
  if (humidity < 60) return "Moderate irrigation recommended";
  return "Natural moisture sufficient";
}

function generateRecommendations(temp, humidity, state) {
  const recommendations = [];

  if (temp > 35) {
    recommendations.push("Provide shade for crops during peak heat");
    recommendations.push("Increase irrigation frequency");
  }

  if (humidity > 80) {
    recommendations.push("Monitor for fungal diseases");
    recommendations.push("Ensure proper ventilation");
  }

  if (humidity < 40) {
    recommendations.push("Implement water conservation techniques");
    recommendations.push("Consider mulching to retain moisture");
  }

  // Add general recommendations based on season
  const month = new Date().getMonth();
  if (month >= 3 && month <= 5) {
    // April-June (planting season)
    recommendations.push("Prepare land for planting season");
    recommendations.push("Apply organic fertilizer");
  } else if (month >= 6 && month <= 9) {
    // July-October (growing season)
    recommendations.push("Monitor crop growth and health");
    recommendations.push("Apply pesticides if needed");
  } else {
    // November-March (harvest/dry season)
    recommendations.push("Harvest mature crops");
    recommendations.push("Store seeds for next planting season");
  }

  return recommendations.slice(0, 4); // Return max 4 recommendations
}

module.exports = router;
