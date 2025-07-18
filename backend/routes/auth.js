const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Nigerian phone number validation
const validateNigerianPhone = (phone) => {
  const nigerianPhoneRegex = /^(\+234|234|0)[789][01]\d{8}$/;
  return nigerianPhoneRegex.test(phone);
};

// Register new user
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("phone").custom((value) => {
      if (!validateNigerianPhone(value)) {
        throw new Error("Valid Nigerian phone number required");
      }
      return true;
    }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("location.state").notEmpty().withMessage("State is required"),
    body("location.localGovernment").optional(),
    body("profile.primaryCrops")
      .isArray({ min: 1 })
      .withMessage("At least one primary crop required"),
    body("profile.preferredLanguage").optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, email, phone, password, role, location, profile } =
        req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email or phone already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || "farmer",
        location,
        profile: {
          ...profile,
          preferredLanguage: profile.preferredLanguage || "en",
        },
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location,
          profile: user.profile,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// Login user
router.post(
  "/login",
  [
    body("identifier").notEmpty().withMessage("Email or phone required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { identifier, password } = req.body;

      // Find user by email or phone
      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location,
          profile: user.profile,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// Get current user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        profile: user.profile,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get Nigerian states and agricultural zones
router.get("/nigeria-data", (req, res) => {
  try {
    const nigerianStates = [
      { name: "Abia", region: "south_east", zone: "forest" },
      { name: "Adamawa", region: "north_east", zone: "sudan_savanna" },
      { name: "Akwa Ibom", region: "south_south", zone: "forest" },
      { name: "Anambra", region: "south_east", zone: "forest" },
      { name: "Bauchi", region: "north_east", zone: "sudan_savanna" },
      { name: "Bayelsa", region: "south_south", zone: "mangrove" },
      { name: "Benue", region: "north_central", zone: "guinea_savanna" },
      { name: "Borno", region: "north_east", zone: "sahel" },
      { name: "Cross River", region: "south_south", zone: "forest" },
      { name: "Delta", region: "south_south", zone: "forest" },
      { name: "Ebonyi", region: "south_east", zone: "forest" },
      { name: "Edo", region: "south_south", zone: "forest" },
      { name: "Ekiti", region: "south_west", zone: "forest" },
      { name: "Enugu", region: "south_east", zone: "forest" },
      { name: "FCT", region: "north_central", zone: "guinea_savanna" },
      { name: "Gombe", region: "north_east", zone: "sudan_savanna" },
      { name: "Imo", region: "south_east", zone: "forest" },
      { name: "Jigawa", region: "north_west", zone: "sudan_savanna" },
      { name: "Kaduna", region: "north_west", zone: "guinea_savanna" },
      { name: "Kano", region: "north_west", zone: "sudan_savanna" },
      { name: "Katsina", region: "north_west", zone: "sudan_savanna" },
      { name: "Kebbi", region: "north_west", zone: "sudan_savanna" },
      { name: "Kogi", region: "north_central", zone: "guinea_savanna" },
      { name: "Kwara", region: "north_central", zone: "guinea_savanna" },
      { name: "Lagos", region: "south_west", zone: "coastal" },
      { name: "Nasarawa", region: "north_central", zone: "guinea_savanna" },
      { name: "Niger", region: "north_central", zone: "guinea_savanna" },
      { name: "Ogun", region: "south_west", zone: "forest" },
      { name: "Ondo", region: "south_west", zone: "forest" },
      { name: "Osun", region: "south_west", zone: "forest" },
      { name: "Oyo", region: "south_west", zone: "derived_savanna" },
      { name: "Plateau", region: "north_central", zone: "guinea_savanna" },
      { name: "Rivers", region: "south_south", zone: "mangrove" },
      { name: "Sokoto", region: "north_west", zone: "sudan_savanna" },
      { name: "Taraba", region: "north_east", zone: "guinea_savanna" },
      { name: "Yobe", region: "north_east", zone: "sahel" },
      { name: "Zamfara", region: "north_west", zone: "sudan_savanna" },
    ];

    const cropsByZone = {
      forest: ["cassava", "yam", "plantain", "cocoa", "oil_palm", "maize"],
      derived_savanna: ["yam", "cassava", "maize", "rice", "cowpea"],
      guinea_savanna: [
        "yam",
        "maize",
        "rice",
        "sorghum",
        "millet",
        "groundnut",
      ],
      sudan_savanna: ["millet", "sorghum", "groundnut", "cowpea", "cotton"],
      sahel: ["millet", "sorghum", "groundnut"],
      coastal: ["rice", "cassava", "plantain", "vegetables"],
      mangrove: ["rice", "cassava", "plantain"],
    };

    res.json({
      success: true,
      data: {
        states: nigerianStates,
        cropsByZone,
        languages: [
          { code: "en", name: "English" },
          { code: "ha", name: "Hausa" },
          { code: "ig", name: "Igbo" },
          { code: "yo", name: "Yoruba" },
        ],
      },
    });
  } catch (error) {
    console.error("Nigeria data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Nigeria data",
    });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
