const mongoose = require("mongoose");

const weatherDataSchema = new mongoose.Schema(
  {
    location: {
      state: {
        type: String,
        required: true,
      },
      lga: String,
      coordinates: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
      name: String, // Location name
    },
    current: {
      temperature: Number,
      feelsLike: Number,
      humidity: Number,
      pressure: Number,
      windSpeed: Number,
      windDirection: Number,
      visibility: Number,
      uvIndex: Number,
      cloudCover: Number,
      condition: String,
      icon: String,
      description: String,
    },
    forecast: [
      {
        date: Date,
        temperature: {
          min: Number,
          max: Number,
        },
        humidity: Number,
        precipitation: {
          probability: Number,
          amount: Number,
        },
        windSpeed: Number,
        condition: String,
        icon: String,
        description: String,
      },
    ],
    agriculturalAlerts: [
      {
        type: {
          type: String,
          enum: [
            "drought_warning",
            "flood_warning",
            "frost_warning",
            "high_wind_warning",
            "pest_outbreak_risk",
            "disease_outbreak_risk",
            "planting_window",
            "harvest_recommendation",
            "irrigation_advisory",
          ],
        },
        severity: {
          type: String,
          enum: ["low", "moderate", "high", "critical"],
        },
        message: String,
        actionRequired: String,
        validUntil: Date,
        affectedCrops: [String],
      },
    ],
    farmingRecommendations: [
      {
        activity: String,
        timing: String,
        suitability: {
          type: String,
          enum: ["excellent", "good", "fair", "poor", "not_suitable"],
        },
        crops: [String],
        notes: String,
      },
    ],
    seasonalInfo: {
      season: {
        type: String,
        enum: ["dry_season", "wet_season", "harmattan"],
      },
      rainfalTotal: Number, // Monthly total
      averageTemperature: Number,
      daysToSeasonChange: Number,
    },
    source: {
      provider: String,
      lastUpdated: Date,
      dataQuality: String,
    },
  },
  {
    timestamps: true,
  }
);

// Weather alert schema
const weatherAlertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "severe_weather",
        "drought",
        "flood",
        "pest_outbreak",
        "disease_outbreak",
        "market_price_alert",
        "government_announcement",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "info",
    },
    targetAudience: {
      states: [String],
      crops: [String],
      farmingTypes: [String],
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: Date,
    source: String,
    actionItems: [String],
    relatedLinks: [String],
    language: {
      type: String,
      enum: ["en", "ha", "ig", "yo"],
      default: "en",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sentViaNotification: {
      type: Boolean,
      default: false,
    },
    acknowledgedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Seasonal farming calendar
const seasonalCalendarSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    activities: [
      {
        crop: String,
        activity: {
          type: String,
          enum: [
            "land_preparation",
            "planting",
            "weeding",
            "fertilizer_application",
            "pest_control",
            "irrigation",
            "harvesting",
            "storage",
            "marketing",
          ],
        },
        timing: String, // e.g., "early month", "mid month", "late month"
        priority: {
          type: String,
          enum: ["high", "medium", "low"],
        },
        description: String,
        tips: [String],
      },
    ],
    weatherPattern: {
      expectedRainfall: Number,
      temperatureRange: {
        min: Number,
        max: Number,
      },
      humidity: Number,
      commonConditions: [String],
    },
    marketInfo: {
      expectedPrices: [
        {
          crop: String,
          priceRange: {
            min: Number,
            max: Number,
          },
          unit: String,
        },
      ],
      harvestingSeason: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
weatherDataSchema.index({ "location.state": 1, "location.coordinates": 1 });
weatherDataSchema.index({ createdAt: -1 });

weatherAlertSchema.index({ "targetAudience.states": 1 });
weatherAlertSchema.index({ "targetAudience.crops": 1 });
weatherAlertSchema.index({ validFrom: 1, validUntil: 1 });
weatherAlertSchema.index({ isActive: 1 });

seasonalCalendarSchema.index({ state: 1, month: 1 });
seasonalCalendarSchema.index({ "activities.crop": 1 });

const WeatherData = mongoose.model("WeatherData", weatherDataSchema);
const WeatherAlert = mongoose.model("WeatherAlert", weatherAlertSchema);
const SeasonalCalendar = mongoose.model(
  "SeasonalCalendar",
  seasonalCalendarSchema
);

module.exports = { WeatherData, WeatherAlert, SeasonalCalendar };
