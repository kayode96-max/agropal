const mongoose = require("mongoose");

const marketPriceSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true },
    variety: String,
    market: {
      name: { type: String, required: true },
      type: {
        type: String,
        enum: ["local", "state", "national", "international"],
        default: "local",
      },
      location: {
        state: String,
        lga: String,
        marketName: String,
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
    },
    price: {
      current: { type: Number, required: true },
      currency: { type: String, default: "NGN" },
      unit: { type: String, default: "kg" },
      quality: {
        type: String,
        enum: ["premium", "good", "fair", "poor"],
        default: "good",
      },
    },
    priceHistory: [
      {
        price: Number,
        date: Date,
        source: String,
        quality: String,
      },
    ],
    trend: {
      direction: {
        type: String,
        enum: ["up", "down", "stable"],
      },
      percentage: Number,
      period: String, // "daily", "weekly", "monthly"
    },
    seasonality: {
      peak: [String], // months when price is highest
      low: [String], // months when price is lowest
      averagePrice: Number,
    },
    factors: {
      supply: {
        type: String,
        enum: ["high", "medium", "low"],
      },
      demand: {
        type: String,
        enum: ["high", "medium", "low"],
      },
      weather: String,
      events: [String], // festivals, export demands, etc.
    },
    forecast: {
      next7Days: Number,
      next30Days: Number,
      nextSeason: Number,
      confidence: Number, // 0-100%
    },
    source: {
      type: String,
      enum: ["manual", "api", "scraper", "user_report"],
      default: "manual",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verified: {
      isVerified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      verificationDate: Date,
    },
    metadata: {
      lastUpdated: { type: Date, default: Date.now },
      updateFrequency: String, // daily, weekly, etc.
      reliability: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "medium",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
marketPriceSchema.index({ crop: 1, "market.location.state": 1 });
marketPriceSchema.index({ "market.name": 1, crop: 1 });
marketPriceSchema.index({ "metadata.lastUpdated": 1 });
marketPriceSchema.index({ "trend.direction": 1 });

module.exports = mongoose.model("MarketPrice", marketPriceSchema);
