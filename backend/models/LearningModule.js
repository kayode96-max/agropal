const mongoose = require("mongoose");

const learningModuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "crop_production",
        "livestock_management",
        "soil_health",
        "pest_disease_management",
        "irrigation",
        "organic_farming",
        "post_harvest",
        "marketing",
        "finance",
        "climate_smart_agriculture",
        "mechanization",
        "government_programs",
      ],
    },
    targetCrops: [String],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: Number, // in minutes
    language: {
      type: String,
      enum: ["en", "ha", "ig", "yo"],
      default: "en",
    },
    content: {
      video: {
        url: String,
        duration: Number,
        subtitles: [
          {
            language: String,
            url: String,
          },
        ],
      },
      audio: {
        url: String,
        duration: Number,
      },
      text: String,
      images: [String],
      downloadableResources: [
        {
          title: String,
          url: String,
          type: String, // pdf, doc, etc.
        },
      ],
    },
    quiz: {
      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: Number,
          explanation: String,
          language: {
            type: String,
            enum: ["en", "ha", "ig", "yo"],
            default: "en",
          },
        },
      ],
      passingScore: {
        type: Number,
        default: 70,
      },
    },
    regionalRelevance: {
      states: [String],
      climateZones: [String],
      soilTypes: [String],
    },
    prerequisites: [String],
    learningObjectives: [String],
    keyTopics: [String],
    practicalExercises: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    enrollments: {
      type: Number,
      default: 0,
    },
    completions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// User progress tracking
const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningModule",
      required: true,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0, // in minutes
    },
    quizAttempts: [
      {
        score: Number,
        totalQuestions: Number,
        correctAnswers: Number,
        attemptDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bestQuizScore: {
      type: Number,
      default: 0,
    },
    completedAt: Date,
    certificateEarned: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
learningModuleSchema.index({ category: 1 });
learningModuleSchema.index({ targetCrops: 1 });
learningModuleSchema.index({ difficulty: 1 });
learningModuleSchema.index({ language: 1 });
learningModuleSchema.index({ "regionalRelevance.states": 1 });
learningModuleSchema.index({ averageRating: -1 });
learningModuleSchema.index({ enrollments: -1 });

userProgressSchema.index({ user: 1, module: 1 }, { unique: true });
userProgressSchema.index({ user: 1 });
userProgressSchema.index({ module: 1 });

const LearningModule = mongoose.model("LearningModule", learningModuleSchema);
const UserProgress = mongoose.model("UserProgress", userProgressSchema);

module.exports = { LearningModule, UserProgress };
