const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = "all",
      type = "all",
      priority = "all",
    } = req.query;

    let query = { userId: req.user.id };

    // Filter by status
    if (status !== "all") {
      query.status = status;
    }

    // Filter by type
    if (type !== "all") {
      query.type = type;
    }

    // Filter by priority
    if (priority !== "all") {
      query.priority = priority;
    }

    // Filter out expired notifications
    query.expiresAt = { $gt: new Date() };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      status: { $in: ["sent", "delivered"] },
      expiresAt: { $gt: new Date() },
    });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        status: "read",
        readAt: new Date(),
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put("/read-all", auth, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        userId: req.user.id,
        status: { $in: ["sent", "delivered"] },
      },
      {
        status: "read",
        readAt: new Date(),
      }
    );

    res.json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/notifications/preferences
// @desc    Update notification preferences
// @access  Private
router.post("/preferences", auth, async (req, res) => {
  try {
    const UserProfile = require("../models/UserProfile");
    const { notifications } = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        "preferences.notifications": notifications,
      },
      { new: true, upsert: true }
    );

    res.json({
      message: "Notification preferences updated",
      preferences: profile.preferences.notifications,
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          unread: {
            $sum: {
              $cond: [{ $in: ["$status", ["sent", "delivered"]] }, 1, 0],
            },
          },
        },
      },
    ]);

    const totalNotifications = await Notification.countDocuments({
      userId: req.user.id,
    });

    const unreadNotifications = await Notification.countDocuments({
      userId: req.user.id,
      status: { $in: ["sent", "delivered"] },
    });

    res.json({
      stats,
      totalNotifications,
      unreadNotifications,
    });
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
