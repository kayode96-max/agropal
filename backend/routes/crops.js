const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const CropDiagnosisAI = require("../utils/aiDiagnosis");
const CropDiagnosis = require("../models/CropDiagnosis");
const User = require("../models/User");
const {
  getCropDiseases,
  isCropSuitableForState,
} = require("../utils/nigerianAgricultureData");

const router = express.Router();
const diagnosisAI = new CropDiagnosisAI();

// Configure multer for file uploads with image optimization
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/crops";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "crop-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for better image quality
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|heic/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error("Only image files (JPEG, JPG, PNG, WebP, HEIC) are allowed")
      );
    }
  },
});

// Image optimization function
async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(1024, 1024, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    // Remove original if optimization successful
    if (fs.existsSync(inputPath) && inputPath !== outputPath) {
      fs.unlinkSync(inputPath);
    }

    return outputPath;
  } catch (error) {
    console.error("Image optimization error:", error);
    return inputPath; // Return original if optimization fails
  }
}

// POST /api/crops/diagnose - Upload and analyze crop image with AI
router.post("/diagnose", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file uploaded",
        message: "Please upload a clear image of the affected plant",
      });
    }

    const {
      location,
      cropType,
      symptoms,
      userId,
      plantingDate,
      growthStage,
      previousTreatments,
    } = req.body;

    // Optimize uploaded image
    const originalPath = req.file.path;
    const optimizedPath = originalPath.replace(
      /\.(jpeg|jpg|png|webp)$/,
      "_optimized.jpg"
    );
    const finalImagePath = await optimizeImage(originalPath, optimizedPath);

    // Validate crop type for location
    if (cropType && location?.state) {
      const isSuitable = isCropSuitableForState(cropType, location.state);
      if (!isSuitable) {
        console.warn(
          `Warning: ${cropType} may not be suitable for ${location.state}`
        );
      }
    }

    // Prepare metadata for AI analysis
    const metadata = {
      cropType,
      location,
      symptoms,
      plantingDate,
      growthStage,
      previousTreatments,
      imageMetadata: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    };

    // Read optimized image for AI analysis
    const imageBuffer = fs.readFileSync(finalImagePath);

    // Get AI diagnosis
    const diagnosis = await diagnosisAI.diagnoseCrop(imageBuffer, metadata);

    if (!diagnosis) {
      return res.status(500).json({
        success: false,
        error: "AI diagnosis failed",
        message:
          "Unable to analyze the image. Please try with a clearer photo.",
      });
    }

    // Process userId - handle invalid ObjectIds
    let processedUserId = null;
    if (userId && userId !== "current-user-id") {
      try {
        // Check if it's a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(userId)) {
          processedUserId = new mongoose.Types.ObjectId(userId);
        } else {
          console.warn("Invalid userId provided, setting to null:", userId);
        }
      } catch (error) {
        console.warn(
          "Error processing userId, setting to null:",
          error.message
        );
      }
    }

    // Save diagnosis to database
    const cropDiagnosisData = {
      userId: processedUserId,
      imageUrl: finalImagePath,
      imageMetadata: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadTimestamp: new Date(),
      },
      cropInfo: {
        type: cropType,
        plantingDate: plantingDate ? new Date(plantingDate) : null,
        growthStage,
      },
      symptoms: {
        description: symptoms,
        userReported: symptoms ? symptoms.split(",").map((s) => s.trim()) : [],
      },
      diagnosis: {
        disease: diagnosis.disease,
        confidence: diagnosis.confidence,
        severity: diagnosis.severity,
        description: diagnosis.description,
        possibleCauses: diagnosis.possibleCauses || [],
        aiModel: "Agropal AI v1.0",
        processedAt: new Date(),
      },
      treatment: {
        immediate: diagnosis.treatment?.immediate || [],
        longTerm: diagnosis.treatment?.preventive || [],
        prevention: diagnosis.treatment?.preventive || [],
        organicOptions: diagnosis.treatment?.organic || [],
        chemicalOptions: diagnosis.treatment?.chemical || [],
        localRemedies: diagnosis.localSolutions || [],
      },
      location: {
        state: location?.state,
        lga: location?.lga,
        coordinates: location?.coordinates,
      },
      status: "diagnosed",
      tags: [cropType, diagnosis.disease, location?.state].filter(Boolean),
    };

    const savedDiagnosis = new CropDiagnosis(cropDiagnosisData);
    await savedDiagnosis.save();

    // Prepare response
    const result = {
      success: true,
      message: "Crop diagnosis completed successfully",
      diagnosisId: savedDiagnosis._id,
      diagnosis: {
        disease: diagnosis.disease,
        confidence: Math.round(diagnosis.confidence * 100),
        severity: diagnosis.severity,
        description: diagnosis.description,
        possibleCauses: diagnosis.possibleCauses,
      },
      treatment: {
        immediate: diagnosis.treatment?.immediate || [],
        longTerm: diagnosis.treatment?.preventive || [],
        organic: diagnosis.treatment?.organic || [],
        chemical: diagnosis.treatment?.chemical || [],
        traditional: diagnosis.localSolutions || [],
      },
      recommendations: diagnosis.recommendations || [
        "Monitor plant regularly for changes",
        "Ensure proper watering and drainage",
        "Consult local agricultural extension officer if condition worsens",
      ],
      economicImpact: diagnosis.economicImpact,
      locationContext: diagnosis.locationContext,
      timestamp: new Date().toISOString(),
      imageUrl: `/uploads/crops/${path.basename(finalImagePath)}`,
      supportContact: {
        message:
          "Need more help? Contact your local Agricultural Development Program (ADP)",
        phone: "Contact local extension officer",
        whatsapp: "Join our farmers WhatsApp group",
      },
    };

    res.json(result);
  } catch (error) {
    console.error("Crop diagnosis error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // More specific error messages
    let errorMessage = "Failed to process crop diagnosis. Please try again.";
    if (error.name === "ValidationError") {
      errorMessage = "Invalid data provided. Please check your inputs.";
    } else if (
      error.name === "MongoError" ||
      error.name === "MongoServerError"
    ) {
      errorMessage = "Database connection issue. Please try again later.";
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: errorMessage,
      supportMessage:
        "If the problem persists, please contact support or visit your local ADP office.",
      debugInfo:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET /api/crops/history/:userId - Get user's diagnosis history
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const diagnoses = await CropDiagnosis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("userId", "name location");

    const total = await CropDiagnosis.countDocuments({ userId });

    res.json({
      success: true,
      history: diagnoses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching diagnosis history:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch diagnosis history",
    });
  }
});

// GET /api/crops/statistics - Get crop diagnosis statistics
router.get("/statistics", async (req, res) => {
  try {
    const { state, cropType, timeframe = "30" } = req.query;

    const matchConditions = {};
    if (state) matchConditions["location.state"] = state;
    if (cropType) matchConditions["cropInfo.type"] = cropType;

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(timeframe));
    matchConditions.createdAt = { $gte: dateFrom };

    const statistics = await CropDiagnosis.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: "$diagnosis.disease",
          count: { $sum: 1 },
          averageConfidence: { $avg: "$diagnosis.confidence" },
          severityDistribution: {
            $push: "$diagnosis.severity",
          },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      statistics,
      timeframe: `${timeframe} days`,
      filters: { state, cropType },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
});

// GET /api/crops/diseases - Get Nigerian crop diseases information
router.get("/diseases", (req, res) => {
  const { cropType, state } = req.query;

  const nigerianDiseases = {
    cassava: [
      {
        name: "Cassava Mosaic Disease",
        symptoms: [
          "Yellow and green mottling on leaves",
          "Stunted growth",
          "Reduced tuber yield",
        ],
        prevention:
          "Use disease-resistant varieties, remove infected plants, control whitefly vectors",
        treatment:
          "Remove infected plants, apply neem oil, use resistant varieties like TME 419",
        severity: "high",
        prevalence: "Very common in Nigeria",
      },
      {
        name: "Cassava Brown Streak Disease",
        symptoms: [
          "Brown streaks on stems",
          "Necrotic lesions on tubers",
          "Leaf wilting",
        ],
        prevention: "Use clean planting materials, control vector insects",
        treatment: "Remove infected plants, use virus-free cuttings",
        severity: "critical",
        prevalence: "Emerging threat in Nigeria",
      },
    ],
    yam: [
      {
        name: "Yam Anthracnose",
        symptoms: ["Dark spots on leaves", "Stem lesions", "Tuber rot"],
        prevention: "Improve drainage, use clean seed yams, crop rotation",
        treatment: "Apply copper-based fungicides, improve field sanitation",
        severity: "moderate",
        prevalence: "Common during wet season",
      },
    ],
    maize: [
      {
        name: "Maize Streak Virus",
        symptoms: ["Light and dark green streaks on leaves", "Stunted growth"],
        prevention:
          "Plant early, use resistant varieties, control leafhopper vectors",
        treatment: "Remove infected plants, control vectors with neem",
        severity: "high",
        prevalence: "Major constraint in Nigeria",
      },
    ],
  };

  let diseases = [];
  if (cropType && nigerianDiseases[cropType]) {
    diseases = nigerianDiseases[cropType];
  } else {
    // Return all diseases if no specific crop requested
    diseases = Object.values(nigerianDiseases).flat();
  }

  res.json({
    success: true,
    diseases,
    cropType: cropType || "all",
    state: state || "Nigeria",
    source: "Nigerian Agricultural Research Institutes",
  });
});

module.exports = router;
