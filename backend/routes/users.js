const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const auth = require("../middleware/auth");
const sharp = require("sharp");

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/profiles");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id })
      .populate("userId", "email username isVerified")
      .populate("socialConnections.following", "username")
      .populate("socialConnections.followers", "username");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/profile
// @desc    Create or update user profile
// @access  Private
router.post("/profile", auth, async (req, res) => {
  try {
    const { personalInfo, location, farmingInfo, preferences } = req.body;

    let profile = await UserProfile.findOne({ userId: req.user.id });

    if (profile) {
      // Update existing profile
      profile.personalInfo = { ...profile.personalInfo, ...personalInfo };
      profile.location = { ...profile.location, ...location };
      profile.farmingInfo = { ...profile.farmingInfo, ...farmingInfo };
      profile.preferences = { ...profile.preferences, ...preferences };
    } else {
      // Create new profile
      profile = new UserProfile({
        userId: req.user.id,
        personalInfo,
        location,
        farmingInfo,
        preferences,
      });
    }

    await profile.save();

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/profile/picture
// @desc    Upload profile picture
// @access  Private
router.post(
  "/profile/picture",
  auth,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Optimize image using sharp
      const optimizedFilename = "optimized-" + req.file.filename;
      const optimizedPath = path.join(req.file.destination, optimizedFilename);

      await sharp(req.file.path)
        .resize(300, 300, { fit: "cover" })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      // Delete original file
      fs.unlinkSync(req.file.path);

      // Update user profile with new picture
      const profile = await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        {
          "personalInfo.profilePicture": `/uploads/profiles/${optimizedFilename}`,
        },
        { new: true, upsert: true }
      );

      res.json({
        message: "Profile picture updated successfully",
        profilePicture: profile.personalInfo.profilePicture,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const stats = {
      totalDiagnoses: profile.statistics.totalDiagnoses,
      successfulTreatments: profile.statistics.successfulTreatments,
      communityPosts: profile.statistics.communityPosts,
      helpfulAnswers: profile.statistics.helpfulAnswers,
      coursesCompleted: profile.statistics.coursesCompleted,
      loginStreak: profile.statistics.loginStreak,
      achievements: profile.achievements,
      farmingExperience: profile.farmingExperience,
      verificationLevel: profile.verificationStatus.verificationLevel,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/follow/:userId
// @desc    Follow/unfollow a user
// @access  Private
router.post("/follow/:userId", auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const currentUserProfile = await UserProfile.findOne({
      userId: currentUserId,
    });
    const targetUserProfile = await UserProfile.findOne({
      userId: targetUserId,
    });

    if (!currentUserProfile || !targetUserProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const isFollowing =
      currentUserProfile.socialConnections.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUserProfile.socialConnections.following.pull(targetUserId);
      targetUserProfile.socialConnections.followers.pull(currentUserId);
    } else {
      // Follow
      currentUserProfile.socialConnections.following.push(targetUserId);
      targetUserProfile.socialConnections.followers.push(currentUserId);
    }

    await currentUserProfile.save();
    await targetUserProfile.save();

    res.json({
      message: isFollowing
        ? "User unfollowed successfully"
        : "User followed successfully",
      isFollowing: !isFollowing,
    });
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/users/search
// @desc    Search users by location or expertise
// @access  Private
router.get("/search", auth, async (req, res) => {
  try {
    const { state, crop, experience, limit = 20 } = req.query;
    let query = {};

    if (state) {
      query["location.state"] = new RegExp(state, "i");
    }

    if (crop) {
      query["farmingInfo.primaryCrops"] = new RegExp(crop, "i");
    }

    if (experience) {
      query["farmingInfo.experienceYears"] = { $gte: parseInt(experience) };
    }

    const users = await UserProfile.find(query)
      .populate("userId", "username email")
      .limit(parseInt(limit))
      .select("personalInfo location farmingInfo statistics achievements");

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/achievement
// @desc    Award achievement to user
// @access  Private
router.post("/achievement", auth, async (req, res) => {
  try {
    const { type, title, description, icon } = req.body;

    const profile = await UserProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check if achievement already exists
    const existingAchievement = profile.achievements.find(
      (achievement) => achievement.type === type
    );

    if (existingAchievement) {
      return res.status(400).json({ message: "Achievement already earned" });
    }

    profile.achievements.push({
      type,
      title,
      description,
      icon,
      earnedAt: new Date(),
    });

    await profile.save();

    res.json({
      message: "Achievement earned!",
      achievement: profile.achievements[profile.achievements.length - 1],
    });
  } catch (error) {
    console.error("Error awarding achievement:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
