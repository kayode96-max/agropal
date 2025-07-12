const express = require("express");
const router = express.Router();
const MarketPrice = require("../models/MarketPrice");
const auth = require("../middleware/auth");

// @route   GET /api/market/prices
// @desc    Get market prices
// @access  Private
router.get("/prices", auth, async (req, res) => {
  try {
    const {
      crop,
      state,
      market,
      limit = 20,
      page = 1,
      sortBy = "metadata.lastUpdated",
      sortOrder = "desc",
    } = req.query;

    let query = {};

    if (crop) {
      query.crop = new RegExp(crop, "i");
    }

    if (state) {
      query["market.location.state"] = new RegExp(state, "i");
    }

    if (market) {
      query["market.name"] = new RegExp(market, "i");
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const prices = await MarketPrice.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("reportedBy", "username");

    const total = await MarketPrice.countDocuments(query);

    res.json({
      prices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching market prices:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/market/prices/trending
// @desc    Get trending price movements
// @access  Private
router.get("/prices/trending", auth, async (req, res) => {
  try {
    const { state, limit = 10 } = req.query;

    let query = {};
    if (state) {
      query["market.location.state"] = new RegExp(state, "i");
    }

    const trendingPrices = await MarketPrice.find(query)
      .sort({ "trend.percentage": -1 })
      .limit(parseInt(limit))
      .select("crop market price trend metadata");

    res.json(trendingPrices);
  } catch (error) {
    console.error("Error fetching trending prices:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/market/prices/:crop/history
// @desc    Get price history for a crop
// @access  Private
router.get("/prices/:crop/history", auth, async (req, res) => {
  try {
    const { crop } = req.params;
    const { state, days = 30 } = req.query;

    let query = { crop: new RegExp(crop, "i") };
    if (state) {
      query["market.location.state"] = new RegExp(state, "i");
    }

    const priceData = await MarketPrice.find(query)
      .sort({ "metadata.lastUpdated": -1 })
      .limit(parseInt(days));

    // Process price history
    const history = priceData.map((price) => ({
      date: price.metadata.lastUpdated,
      price: price.price.current,
      market: price.market.name,
      location: price.market.location,
      quality: price.price.quality,
    }));

    // Calculate statistics
    const prices = priceData.map((p) => p.price.current);
    const stats = {
      current: prices[0] || 0,
      average: prices.reduce((a, b) => a + b, 0) / prices.length || 0,
      highest: Math.max(...prices) || 0,
      lowest: Math.min(...prices) || 0,
      trend: priceData[0]?.trend || null,
    };

    res.json({
      crop,
      history,
      stats,
    });
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/market/prices
// @desc    Report market price
// @access  Private
router.post("/prices", auth, async (req, res) => {
  try {
    const { crop, variety, market, price, quality = "good" } = req.body;

    // Validate required fields
    if (!crop || !market || !price) {
      return res.status(400).json({
        message: "Crop, market, and price are required",
      });
    }

    // Check if recent price exists for same crop/market
    const existingPrice = await MarketPrice.findOne({
      crop: crop.toLowerCase(),
      "market.name": market.name,
      "market.location.state": market.location.state,
      "metadata.lastUpdated": {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Within last 24 hours
      },
    });

    if (existingPrice) {
      // Update existing price
      existingPrice.price.current = price.current;
      existingPrice.price.quality = quality;
      existingPrice.priceHistory.push({
        price: price.current,
        date: new Date(),
        source: "user_report",
        quality,
      });
      existingPrice.metadata.lastUpdated = new Date();
      existingPrice.reportedBy = req.user.id;

      await existingPrice.save();
      res.json(existingPrice);
    } else {
      // Create new price entry
      const newPrice = new MarketPrice({
        crop: crop.toLowerCase(),
        variety,
        market,
        price: {
          current: price.current,
          currency: price.currency || "NGN",
          unit: price.unit || "kg",
          quality,
        },
        priceHistory: [
          {
            price: price.current,
            date: new Date(),
            source: "user_report",
            quality,
          },
        ],
        source: "user_report",
        reportedBy: req.user.id,
      });

      await newPrice.save();
      res.status(201).json(newPrice);
    }
  } catch (error) {
    console.error("Error reporting market price:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/market/forecast/:crop
// @desc    Get price forecast for a crop
// @access  Private
router.get("/forecast/:crop", auth, async (req, res) => {
  try {
    const { crop } = req.params;
    const { state } = req.query;

    let query = { crop: new RegExp(crop, "i") };
    if (state) {
      query["market.location.state"] = new RegExp(state, "i");
    }

    // Get recent prices for trend analysis
    const recentPrices = await MarketPrice.find(query)
      .sort({ "metadata.lastUpdated": -1 })
      .limit(30);

    if (recentPrices.length === 0) {
      return res.status(404).json({ message: "No price data found" });
    }

    // Simple forecasting based on recent trends
    const prices = recentPrices.map((p) => p.price.current);
    const currentPrice = prices[0];
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Calculate trend
    const recentTrend =
      prices.slice(0, 7).reduce((a, b) => a + b, 0) /
      Math.min(7, prices.length);
    const olderTrend =
      prices.slice(7, 14).reduce((a, b) => a + b, 0) /
      Math.min(7, prices.slice(7).length);

    const trendDirection =
      recentTrend > olderTrend
        ? "up"
        : recentTrend < olderTrend
        ? "down"
        : "stable";
    const trendPercentage =
      olderTrend > 0 ? ((recentTrend - olderTrend) / olderTrend) * 100 : 0;

    // Simple forecast calculation
    const forecast = {
      next7Days: currentPrice * (1 + (trendPercentage / 100) * 0.5),
      next30Days: currentPrice * (1 + (trendPercentage / 100) * 2),
      nextSeason: avgPrice * 1.1, // Seasonal adjustment
      confidence: Math.max(20, Math.min(80, 60 - Math.abs(trendPercentage))),
    };

    res.json({
      crop,
      currentPrice,
      avgPrice,
      trend: {
        direction: trendDirection,
        percentage: trendPercentage,
      },
      forecast,
      dataPoints: recentPrices.length,
    });
  } catch (error) {
    console.error("Error generating price forecast:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/market/markets
// @desc    Get list of markets
// @access  Private
router.get("/markets", auth, async (req, res) => {
  try {
    const { state } = req.query;

    let query = {};
    if (state) {
      query["market.location.state"] = new RegExp(state, "i");
    }

    const markets = await MarketPrice.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            name: "$market.name",
            state: "$market.location.state",
            lga: "$market.location.lga",
          },
          location: { $first: "$market.location" },
          priceCount: { $sum: 1 },
          lastUpdated: { $max: "$metadata.lastUpdated" },
        },
      },
      { $sort: { lastUpdated: -1 } },
    ]);

    res.json(markets);
  } catch (error) {
    console.error("Error fetching markets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
