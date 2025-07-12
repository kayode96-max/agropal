const express = require("express");
const { LearningModule, UserProgress } = require("../models/LearningModule");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Authentication middleware (simplified for demo)
const authenticateToken = (req, res, next) => {
  // In production, verify JWT token
  req.user = { userId: "507f1f77bcf86cd799439011" }; // Mock user ID
  next();
};

// Get all learning modules with filters
router.get("/modules", async (req, res) => {
  try {
    const {
      category,
      difficulty,
      language = "en",
      state,
      crop,
      page = 1,
      limit = 10,
    } = req.query;

    // Mock data for MVP - in production this would come from database
    const mockModules = [
      {
        _id: "1",
        title: "Cassava Farming in Nigeria",
        description:
          "Complete guide to cassava cultivation from planting to harvesting",
        category: "crop_production",
        targetCrops: ["cassava"],
        difficulty: "beginner",
        duration: 45,
        language: "en",
        averageRating: 4.5,
        enrollments: 1250,
        completions: 890,
        author: { name: "Dr. Adebayo Ogundimu", role: "extension_worker" },
        regionalRelevance: {
          states: ["Ogun", "Ondo", "Cross River", "Akwa Ibom", "Enugu"],
        },
        content: {
          video: { url: "/videos/cassava-farming.mp4", duration: 45 },
          images: [
            "/images/cassava-varieties.jpg",
            "/images/cassava-planting.jpg",
          ],
        },
      },
      {
        _id: "2",
        title: "Maize Production in Northern Nigeria",
        description:
          "Comprehensive guide to maize cultivation in savanna regions",
        category: "crop_production",
        targetCrops: ["maize"],
        difficulty: "intermediate",
        duration: 60,
        language: "en",
        averageRating: 4.2,
        enrollments: 980,
        completions: 720,
        author: { name: "Mallam Usman Aliyu", role: "extension_worker" },
        regionalRelevance: {
          states: ["Kano", "Kaduna", "Niger", "Sokoto", "Kebbi"],
        },
        content: {
          video: { url: "/videos/maize-farming.mp4", duration: 60 },
          images: [
            "/images/maize-varieties.jpg",
            "/images/maize-irrigation.jpg",
          ],
        },
      },
      {
        _id: "3",
        title: "Integrated Pest Management for Yam",
        description:
          "Learn sustainable pest control methods for yam cultivation",
        category: "pest_disease_management",
        targetCrops: ["yam"],
        difficulty: "intermediate",
        duration: 40,
        language: "en",
        averageRating: 4.7,
        enrollments: 650,
        completions: 520,
        author: { name: "Prof. Ngozi Okafor", role: "extension_worker" },
        regionalRelevance: {
          states: ["Enugu", "Anambra", "Imo", "Abia", "Benue"],
        },
        content: {
          video: { url: "/videos/yam-pest-management.mp4", duration: 40 },
          images: ["/images/yam-pests.jpg", "/images/organic-spray.jpg"],
        },
      },
      {
        _id: "4",
        title: "Climate-Smart Agriculture Techniques",
        description: "Adapting farming practices to climate change in Nigeria",
        category: "climate_smart_agriculture",
        targetCrops: ["maize", "cassava", "yam", "rice"],
        difficulty: "advanced",
        duration: 75,
        language: "en",
        averageRating: 4.6,
        enrollments: 420,
        completions: 380,
        author: { name: "Dr. Fatima Umar", role: "extension_worker" },
        regionalRelevance: {
          states: ["FCT", "Plateau", "Kwara", "Oyo", "Ekiti"],
        },
        content: {
          video: { url: "/videos/climate-smart-farming.mp4", duration: 75 },
          images: [
            "/images/drought-resistant-crops.jpg",
            "/images/rainwater-harvesting.jpg",
          ],
        },
      },
      {
        _id: "5",
        title: "Post-Harvest Handling and Storage",
        description: "Reduce losses through proper post-harvest techniques",
        category: "post_harvest",
        targetCrops: ["rice", "maize", "millet", "sorghum"],
        difficulty: "beginner",
        duration: 35,
        language: "en",
        averageRating: 4.3,
        enrollments: 850,
        completions: 670,
        author: { name: "Hajiya Aisha Mohammed", role: "extension_worker" },
        regionalRelevance: {
          states: ["Borno", "Yobe", "Bauchi", "Gombe", "Adamawa"],
        },
        content: {
          video: { url: "/videos/post-harvest.mp4", duration: 35 },
          images: [
            "/images/grain-storage.jpg",
            "/images/drying-techniques.jpg",
          ],
        },
      },
      {
        _id: "6",
        title: "Market Linkage and Value Addition",
        description: "Connect with buyers and add value to your produce",
        category: "marketing",
        targetCrops: ["tomato", "pepper", "onion", "vegetables"],
        difficulty: "intermediate",
        duration: 50,
        language: "en",
        averageRating: 4.4,
        enrollments: 550,
        completions: 410,
        author: { name: "Mrs. Chioma Eze", role: "extension_worker" },
        regionalRelevance: {
          states: ["Lagos", "Ogun", "Osun", "Ondo", "Ekiti"],
        },
        content: {
          video: { url: "/videos/market-linkage.mp4", duration: 50 },
          images: ["/images/market-analysis.jpg", "/images/value-addition.jpg"],
        },
      },
    ];

    // Filter modules based on query parameters
    let filteredModules = mockModules;

    if (category) {
      filteredModules = filteredModules.filter((m) => m.category === category);
    }

    if (difficulty) {
      filteredModules = filteredModules.filter(
        (m) => m.difficulty === difficulty
      );
    }

    if (state) {
      filteredModules = filteredModules.filter((m) =>
        m.regionalRelevance.states.includes(state)
      );
    }

    if (crop) {
      filteredModules = filteredModules.filter((m) =>
        m.targetCrops.includes(crop)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedModules = filteredModules.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        modules: paginatedModules,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredModules.length / limit),
          totalModules: filteredModules.length,
          hasNext: endIndex < filteredModules.length,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Modules fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch learning modules",
    });
  }
});

// Get featured modules for Nigerian farmers
router.get("/featured", async (req, res) => {
  try {
    const { state, language = "en" } = req.query;

    // Mock featured modules
    const featuredModules = [
      {
        _id: "1",
        title: "Cassava Farming in Nigeria",
        description: "Complete guide to cassava cultivation",
        category: "crop_production",
        averageRating: 4.5,
        enrollments: 1250,
        author: { name: "Dr. Adebayo Ogundimu" },
      },
      {
        _id: "3",
        title: "Integrated Pest Management for Yam",
        description: "Sustainable pest control methods",
        category: "pest_disease_management",
        averageRating: 4.7,
        enrollments: 650,
        author: { name: "Prof. Ngozi Okafor" },
      },
    ];

    const categoryModules = {
      crop_production: [
        { _id: "1", title: "Cassava Farming in Nigeria", averageRating: 4.5 },
        {
          _id: "2",
          title: "Maize Production in Northern Nigeria",
          averageRating: 4.2,
        },
      ],
      pest_disease_management: [
        {
          _id: "3",
          title: "Integrated Pest Management for Yam",
          averageRating: 4.7,
        },
      ],
      post_harvest: [
        {
          _id: "5",
          title: "Post-Harvest Handling and Storage",
          averageRating: 4.3,
        },
      ],
    };

    res.json({
      success: true,
      data: {
        featured: featuredModules,
        byCategory: categoryModules,
        totalModules: 6,
      },
    });
  } catch (error) {
    console.error("Featured modules error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured modules",
    });
  }
});

// Get single learning module
router.get("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Mock module data
    const module = {
      _id: id,
      title: "Cassava Farming in Nigeria",
      description:
        "Complete guide to cassava cultivation from planting to harvesting",
      category: "crop_production",
      targetCrops: ["cassava"],
      difficulty: "beginner",
      duration: 45,
      language: "en",
      averageRating: 4.5,
      enrollments: 1250,
      completions: 890,
      author: {
        name: "Dr. Adebayo Ogundimu",
        role: "extension_worker",
        location: { state: "Ogun" },
      },
      content: {
        video: { url: "/videos/cassava-farming.mp4", duration: 45 },
        text: "Cassava is one of Nigeria's most important food crops...",
        images: ["/images/cassava-varieties.jpg"],
        downloadableResources: [
          {
            title: "Cassava Farming Guide PDF",
            url: "/resources/cassava-guide.pdf",
            type: "pdf",
          },
        ],
      },
      quiz: {
        questions: [
          {
            question: "What is the best soil type for cassava cultivation?",
            options: [
              "Clay soil",
              "Sandy loam",
              "Waterlogged soil",
              "Rocky soil",
            ],
            explanation:
              "Sandy loam provides good drainage which cassava needs",
          },
          {
            question: "How long does cassava take to mature?",
            options: ["6 months", "8-12 months", "18-24 months", "3 years"],
            explanation: "Cassava typically matures in 18-24 months",
          },
        ],
        passingScore: 70,
      },
      learningObjectives: [
        "Understand cassava varieties suitable for Nigeria",
        "Learn proper planting techniques",
        "Identify common diseases and pests",
        "Master harvesting and storage methods",
      ],
      reviews: [
        {
          user: "Adamu Ibrahim",
          rating: 5,
          comment: "Very helpful for new cassava farmers",
          timestamp: new Date("2024-12-01"),
        },
      ],
    };

    res.json({
      success: true,
      data: {
        module,
        userProgress: null, // Mock - no progress yet
      },
    });
  } catch (error) {
    console.error("Module fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch learning module",
    });
  }
});

// Enroll in a learning module
router.post("/modules/:id/enroll", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Mock enrollment
    const userProgress = {
      _id: "progress_" + id,
      user: req.user.userId,
      module: id,
      status: "in_progress",
      progress: 0,
      enrolledAt: new Date(),
    };

    res.json({
      success: true,
      message: "Successfully enrolled in the module",
      data: userProgress,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enroll in module",
    });
  }
});

// Update learning progress
router.put(
  "/modules/:id/progress",
  authenticateToken,
  [
    body("progress").isNumeric().isInt({ min: 0, max: 100 }),
    body("timeSpent").optional().isNumeric(),
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

      const { id } = req.params;
      const { progress, timeSpent } = req.body;

      // Mock progress update
      const userProgress = {
        _id: "progress_" + id,
        user: req.user.userId,
        module: id,
        status: progress === 100 ? "completed" : "in_progress",
        progress,
        timeSpent: timeSpent || 0,
        completedAt: progress === 100 ? new Date() : null,
      };

      res.json({
        success: true,
        message: "Progress updated successfully",
        data: userProgress,
      });
    } catch (error) {
      console.error("Progress update error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update progress",
      });
    }
  }
);

// Submit quiz attempt
router.post(
  "/modules/:id/quiz",
  authenticateToken,
  [
    body("answers").isArray().withMessage("Answers must be an array"),
    body("answers.*.questionIndex").isNumeric(),
    body("answers.*.selectedAnswer").isNumeric(),
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

      const { id } = req.params;
      const { answers } = req.body;

      // Mock quiz questions and correct answers
      const correctAnswers = [1, 2]; // Indices of correct answers
      const totalQuestions = 2;

      let correctCount = 0;
      answers.forEach((answer) => {
        if (correctAnswers[answer.questionIndex] === answer.selectedAnswer) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / totalQuestions) * 100);
      const passed = score >= 70;

      res.json({
        success: true,
        data: {
          score,
          correctAnswers: correctCount,
          totalQuestions,
          passed,
          passingScore: 70,
          certificateEarned: passed,
          bestScore: score,
        },
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit quiz",
      });
    }
  }
);

// Get user's learning progress
router.get("/my-progress", authenticateToken, async (req, res) => {
  try {
    // Mock progress data
    const progressRecords = [
      {
        _id: "progress_1",
        module: {
          _id: "1",
          title: "Cassava Farming in Nigeria",
          category: "crop_production",
          difficulty: "beginner",
          duration: 45,
          averageRating: 4.5,
        },
        status: "completed",
        progress: 100,
        timeSpent: 50,
        completedAt: new Date("2024-12-01"),
      },
      {
        _id: "progress_2",
        module: {
          _id: "2",
          title: "Maize Production in Northern Nigeria",
          category: "crop_production",
          difficulty: "intermediate",
          duration: 60,
          averageRating: 4.2,
        },
        status: "in_progress",
        progress: 65,
        timeSpent: 35,
      },
    ];

    const statistics = {
      totalEnrolled: 2,
      totalCompleted: 1,
      totalTimeSpent: 85,
      averageProgress: 82.5,
      certificatesEarned: 1,
    };

    res.json({
      success: true,
      data: {
        progress: progressRecords,
        statistics,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: 2,
        },
      },
    });
  } catch (error) {
    console.error("Progress fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch learning progress",
    });
  }
});

// Get learning recommendations
router.get("/recommendations", authenticateToken, async (req, res) => {
  try {
    // Mock recommendations based on user profile
    const recommendations = [
      {
        _id: "4",
        title: "Climate-Smart Agriculture Techniques",
        description: "Adapting farming practices to climate change",
        category: "climate_smart_agriculture",
        averageRating: 4.6,
        author: { name: "Dr. Fatima Umar" },
      },
      {
        _id: "6",
        title: "Market Linkage and Value Addition",
        description: "Connect with buyers and add value to produce",
        category: "marketing",
        averageRating: 4.4,
        author: { name: "Mrs. Chioma Eze" },
      },
    ];

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
});

module.exports = router;
