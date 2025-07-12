const express = require("express");
const router = express.Router();

// Mock learning modules data
const learningModules = [
  {
    id: 1,
    title: "Sustainable Farming Basics",
    description: "Learn the fundamentals of sustainable agriculture practices",
    category: "fundamentals",
    duration: "15 minutes",
    level: "beginner",
    language: "English",
    thumbnail: "/images/sustainable-farming.jpg",
    videoUrl: "https://example.com/video1.mp4", // Placeholder
    transcripts: {
      en: "Welcome to sustainable farming basics...",
      sw: "Karibu kwenye msingi wa kilimo endelevu...",
    },
    quiz: [
      {
        id: 1,
        question: "What is the main goal of sustainable farming?",
        options: [
          "Maximum short-term profit",
          "Long-term environmental and economic balance",
          "Using only traditional methods",
          "Avoiding all technology",
        ],
        correctAnswer: 1,
        explanation:
          "Sustainable farming aims to balance environmental health, economic profitability, and social equity.",
      },
      {
        id: 2,
        question: "Which practice helps maintain soil health?",
        options: [
          "Monoculture farming",
          "Crop rotation",
          "Excessive tilling",
          "Overuse of chemicals",
        ],
        correctAnswer: 1,
        explanation:
          "Crop rotation helps maintain soil nutrients and breaks pest cycles.",
      },
    ],
    resources: [
      {
        type: "pdf",
        title: "Sustainable Farming Guide",
        url: "/resources/sustainable-farming-guide.pdf",
      },
      {
        type: "link",
        title: "FAO Sustainable Agriculture",
        url: "https://www.fao.org/sustainability/en/",
      },
    ],
    completed: false,
    rating: 4.5,
    enrollments: 1250,
  },
  {
    id: 2,
    title: "Crop Disease Identification",
    description: "Learn to identify common crop diseases and their symptoms",
    category: "disease-management",
    duration: "20 minutes",
    level: "intermediate",
    language: "English",
    thumbnail: "/images/crop-diseases.jpg",
    videoUrl: "https://example.com/video2.mp4",
    transcripts: {
      en: "In this module, we will learn about crop diseases...",
      sw: "Katika somo hili, tutajifunza kuhusu magonjwa ya mazao...",
    },
    quiz: [
      {
        id: 1,
        question: "What are the main types of plant diseases?",
        options: [
          "Only fungal diseases",
          "Fungal, bacterial, and viral diseases",
          "Only bacterial diseases",
          "Only viral diseases",
        ],
        correctAnswer: 1,
        explanation:
          "Plant diseases can be caused by fungi, bacteria, viruses, and other pathogens.",
      },
    ],
    resources: [
      {
        type: "image-gallery",
        title: "Disease Symptom Gallery",
        url: "/resources/disease-gallery",
      },
    ],
    completed: false,
    rating: 4.7,
    enrollments: 980,
  },
  {
    id: 3,
    title: "Water Management Techniques",
    description: "Efficient irrigation and water conservation methods",
    category: "water-management",
    duration: "18 minutes",
    level: "intermediate",
    language: "English",
    thumbnail: "/images/water-management.jpg",
    videoUrl: "https://example.com/video3.mp4",
    transcripts: {
      en: "Water is a precious resource in agriculture...",
      sw: "Maji ni rasilimali muhimu katika kilimo...",
    },
    quiz: [
      {
        id: 1,
        question: "Which irrigation method is most water-efficient?",
        options: [
          "Flood irrigation",
          "Sprinkler irrigation",
          "Drip irrigation",
          "Furrow irrigation",
        ],
        correctAnswer: 2,
        explanation:
          "Drip irrigation delivers water directly to plant roots, minimizing waste.",
      },
    ],
    resources: [
      {
        type: "calculator",
        title: "Irrigation Calculator",
        url: "/tools/irrigation-calculator",
      },
    ],
    completed: false,
    rating: 4.3,
    enrollments: 756,
  },
];

// Mock user progress data
let userProgress = {
  "mock-user-id": {
    "module-1": {
      completed: true,
      progress: 100,
      score: 85,
      lastAccessed: "2024-01-15T10:30:00Z",
    },
    "module-2": {
      completed: false,
      progress: 60,
      lastAccessed: "2024-01-14T15:20:00Z",
    },
    "module-3": {
      completed: true,
      progress: 100,
      score: 92,
      lastAccessed: "2024-01-13T09:45:00Z",
    },
  },
};

// GET /api/learning/modules - Get all learning modules
router.get("/modules", (req, res) => {
  try {
    const { category, level, language = "English" } = req.query;

    let filteredModules = [...learningModules];

    if (category) {
      filteredModules = filteredModules.filter(
        (module) => module.category === category
      );
    }

    if (level) {
      filteredModules = filteredModules.filter(
        (module) => module.level === level
      );
    }

    if (language) {
      filteredModules = filteredModules.filter(
        (module) => module.language.toLowerCase() === language.toLowerCase()
      );
    }

    // Sort by rating and enrollments
    filteredModules.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.enrollments - a.enrollments;
    });

    res.json({
      success: true,
      modules: filteredModules,
      total: filteredModules.length,
      categories: [
        "fundamentals",
        "disease-management",
        "water-management",
        "pest-control",
        "soil-health",
      ],
      levels: ["beginner", "intermediate", "advanced"],
      languages: ["English", "Swahili", "French"],
    });
  } catch (error) {
    console.error("Get modules error:", error);
    res.status(500).json({
      error: "Failed to fetch learning modules",
      message: error.message,
    });
  }
});

// GET /api/learning/modules/:id - Get specific module
router.get("/modules/:id", (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    const module = learningModules.find((m) => m.id === moduleId);

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.json({
      success: true,
      module: module,
    });
  } catch (error) {
    console.error("Get module error:", error);
    res.status(500).json({
      error: "Failed to fetch module",
      message: error.message,
    });
  }
});

// POST /api/learning/modules/:id/enroll - Enroll in a module
router.post("/modules/:id/enroll", (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    const { userId = "user1" } = req.body; // Mock user ID

    const module = learningModules.find((m) => m.id === moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Initialize user progress if not exists
    if (!userProgress[userId]) {
      userProgress[userId] = {};
    }

    if (!userProgress[userId][moduleId]) {
      userProgress[userId][moduleId] = {
        enrolled: true,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completed: false,
        quizScore: null,
        lastAccessed: new Date().toISOString(),
      };

      // Increment enrollment count
      module.enrollments += 1;
    }

    res.json({
      success: true,
      message: "Successfully enrolled in module",
      progress: userProgress[userId][moduleId],
    });
  } catch (error) {
    console.error("Enroll error:", error);
    res.status(500).json({
      error: "Failed to enroll in module",
      message: error.message,
    });
  }
});

// POST /api/learning/modules/:id/progress - Update learning progress
router.post("/modules/:id/progress", (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    const { userId = "user1", progress, completed = false } = req.body;

    if (progress < 0 || progress > 100) {
      return res
        .status(400)
        .json({ error: "Progress must be between 0 and 100" });
    }

    // Initialize user progress if not exists
    if (!userProgress[userId]) {
      userProgress[userId] = {};
    }

    if (!userProgress[userId][moduleId]) {
      userProgress[userId][moduleId] = {
        enrolled: true,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completed: false,
        quizScore: null,
      };
    }

    userProgress[userId][moduleId].progress = progress;
    userProgress[userId][moduleId].completed = completed;
    userProgress[userId][moduleId].lastAccessed = new Date().toISOString();

    if (completed) {
      userProgress[userId][moduleId].completedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      message: "Progress updated successfully",
      progress: userProgress[userId][moduleId],
    });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({
      error: "Failed to update progress",
      message: error.message,
    });
  }
});

// POST /api/learning/modules/:id/quiz - Submit quiz answers
router.post("/modules/:id/quiz", (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    const { userId = "user1", answers } = req.body;

    const module = learningModules.find((m) => m.id === moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    if (!module.quiz || module.quiz.length === 0) {
      return res
        .status(400)
        .json({ error: "No quiz available for this module" });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = module.quiz.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const score = Math.round((correctAnswers / module.quiz.length) * 100);
    const passed = score >= 70; // 70% passing score

    // Update user progress
    if (!userProgress[userId]) {
      userProgress[userId] = {};
    }
    if (!userProgress[userId][moduleId]) {
      userProgress[userId][moduleId] = {
        enrolled: true,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completed: false,
      };
    }

    userProgress[userId][moduleId].quizScore = score;
    userProgress[userId][moduleId].quizCompleted = true;
    userProgress[userId][moduleId].quizCompletedAt = new Date().toISOString();

    if (passed) {
      userProgress[userId][moduleId].progress = 100;
      userProgress[userId][moduleId].completed = true;
      userProgress[userId][moduleId].completedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      quiz: {
        score,
        passed,
        correctAnswers,
        totalQuestions: module.quiz.length,
        results,
      },
      progress: userProgress[userId][moduleId],
      message: passed
        ? "Congratulations! You passed the quiz."
        : "Quiz completed. You need 70% to pass.",
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({
      error: "Failed to submit quiz",
      message: error.message,
    });
  }
});

// GET /api/learning/progress/:userId - Get user learning progress
router.get("/progress/:userId", (req, res) => {
  try {
    const { userId } = req.params;

    const userProgressData = userProgress[userId] || {};

    // Calculate overall statistics
    const totalEnrolled = Object.keys(userProgressData).length;
    const completed = Object.values(userProgressData).filter(
      (p) => p.completed
    ).length;
    const inProgress = totalEnrolled - completed;
    const averageProgress =
      totalEnrolled > 0
        ? Object.values(userProgressData).reduce(
            (sum, p) => sum + p.progress,
            0
          ) / totalEnrolled
        : 0;

    res.json({
      success: true,
      progress: userProgressData,
      statistics: {
        totalEnrolled,
        completed,
        inProgress,
        averageProgress: Math.round(averageProgress),
      },
    });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({
      error: "Failed to fetch progress",
      message: error.message,
    });
  }
});

module.exports = router;
