const express = require("express");
const router = express.Router();
const CropCalendar = require("../models/CropCalendar");
const auth = require("../middleware/auth");

// @route   GET /api/calendar
// @desc    Get user's crop calendars
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const {
      status = "all",
      season,
      crop,
      year,
      limit = 20,
      page = 1,
    } = req.query;

    let query = { userId: req.user.id };

    if (status !== "all") {
      query.status = status;
    }

    if (season) {
      query.season = season;
    }

    if (crop) {
      query.cropType = new RegExp(crop, "i");
    }

    if (year) {
      const startYear = new Date(`${year}-01-01`);
      const endYear = new Date(`${year}-12-31`);
      query.plantingDate = { $gte: startYear, $lte: endYear };
    }

    const calendars = await CropCalendar.find(query)
      .sort({ plantingDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await CropCalendar.countDocuments(query);

    res.json({
      calendars,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching crop calendars:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/calendar
// @desc    Create new crop calendar
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const {
      cropType,
      variety,
      season,
      plantingDate,
      farmLocation,
      expectedHarvestDate,
    } = req.body;

    // Validate required fields
    if (!cropType || !season || !plantingDate || !farmLocation) {
      return res.status(400).json({
        message:
          "Crop type, season, planting date, and farm location are required",
      });
    }

    const calendar = new CropCalendar({
      userId: req.user.id,
      cropType,
      variety,
      season,
      plantingDate: new Date(plantingDate),
      expectedHarvestDate: expectedHarvestDate
        ? new Date(expectedHarvestDate)
        : null,
      farmLocation,
      status: "planning",
    });

    await calendar.save();

    res.status(201).json({
      message: "Crop calendar created successfully",
      calendar,
    });
  } catch (error) {
    console.error("Error creating crop calendar:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/calendar/:id
// @desc    Get specific crop calendar
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const calendar = await CropCalendar.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    res.json(calendar);
  } catch (error) {
    console.error("Error fetching crop calendar:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/calendar/:id
// @desc    Update crop calendar
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const calendar = await CropCalendar.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    res.json({
      message: "Calendar updated successfully",
      calendar,
    });
  } catch (error) {
    console.error("Error updating crop calendar:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/calendar/:id/activities
// @desc    Add activity to crop calendar
// @access  Private
router.post("/:id/activities", auth, async (req, res) => {
  try {
    const { type, name, description, scheduledDate, cost, notes } = req.body;

    const calendar = await CropCalendar.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    const activity = {
      type,
      name,
      description,
      scheduledDate: new Date(scheduledDate),
      cost: cost || 0,
      notes,
      status: "pending",
    };

    calendar.activities.push(activity);
    await calendar.save();

    const newActivity = calendar.activities[calendar.activities.length - 1];

    res.status(201).json({
      message: "Activity added successfully",
      activity: newActivity,
    });
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/calendar/:id/activities/:activityId
// @desc    Update activity status
// @access  Private
router.put("/:id/activities/:activityId", auth, async (req, res) => {
  try {
    const { status, completedDate, notes, cost } = req.body;

    const calendar = await CropCalendar.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    const activity = calendar.activities.id(req.params.activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (status) activity.status = status;
    if (completedDate) activity.completedDate = new Date(completedDate);
    if (notes) activity.notes = notes;
    if (cost !== undefined) activity.cost = cost;

    await calendar.save();

    res.json({
      message: "Activity updated successfully",
      activity,
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/calendar/upcoming
// @desc    Get upcoming activities
// @access  Private
router.get("/upcoming", auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const calendars = await CropCalendar.find({
      userId: req.user.id,
      status: { $in: ["planning", "active"] },
      "activities.scheduledDate": {
        $gte: new Date(),
        $lte: endDate,
      },
      "activities.status": "pending",
    }).select("cropType variety activities farmLocation");

    const upcomingActivities = [];
    calendars.forEach((calendar) => {
      calendar.activities.forEach((activity) => {
        if (
          activity.scheduledDate >= new Date() &&
          activity.scheduledDate <= endDate &&
          activity.status === "pending"
        ) {
          upcomingActivities.push({
            calendarId: calendar._id,
            cropType: calendar.cropType,
            variety: calendar.variety,
            farmLocation: calendar.farmLocation,
            activity: activity,
          });
        }
      });
    });

    // Sort by scheduled date
    upcomingActivities.sort(
      (a, b) =>
        new Date(a.activity.scheduledDate) - new Date(b.activity.scheduledDate)
    );

    res.json(upcomingActivities);
  } catch (error) {
    console.error("Error fetching upcoming activities:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/calendar/stats
// @desc    Get farming statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const calendars = await CropCalendar.find({ userId: req.user.id });

    const stats = {
      totalFarms: calendars.length,
      activeFarms: calendars.filter((c) => c.status === "active").length,
      completedFarms: calendars.filter((c) => c.status === "completed").length,
      totalFarmSize: calendars.reduce(
        (sum, c) => sum + (c.farmLocation.farmSize || 0),
        0
      ),
      totalInvestment: calendars.reduce(
        (sum, c) => sum + (c.totalCost || 0),
        0
      ),
      totalIncome: calendars.reduce(
        (sum, c) => sum + (c.harvest?.totalIncome || 0),
        0
      ),
      avgROI: 0,
      cropTypes: [...new Set(calendars.map((c) => c.cropType))],
      seasons: [...new Set(calendars.map((c) => c.season))],
    };

    // Calculate average ROI
    const completedWithROI = calendars.filter(
      (c) => c.status === "completed" && c.roi
    );
    stats.avgROI =
      completedWithROI.length > 0
        ? completedWithROI.reduce((sum, c) => sum + c.roi, 0) /
          completedWithROI.length
        : 0;

    res.json(stats);
  } catch (error) {
    console.error("Error fetching farming stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/calendar/:id/harvest
// @desc    Record harvest data
// @access  Private
router.post("/:id/harvest", auth, async (req, res) => {
  try {
    const {
      actualYield,
      quality,
      harvestCost,
      storageMethod,
      storageCost,
      marketPrice,
      buyer,
      totalIncome,
    } = req.body;

    const calendar = await CropCalendar.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    calendar.harvest = {
      actualYield,
      quality,
      harvestCost: harvestCost || 0,
      storageMethod,
      storageCost: storageCost || 0,
      marketPrice,
      buyer,
      totalIncome: totalIncome || 0,
      netProfit: (totalIncome || 0) - calendar.totalCost,
    };

    calendar.actualHarvestDate = new Date();
    calendar.status = "completed";

    await calendar.save();

    res.json({
      message: "Harvest data recorded successfully",
      calendar,
    });
  } catch (error) {
    console.error("Error recording harvest:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
