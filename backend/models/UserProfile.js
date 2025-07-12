const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      dateOfBirth: Date,
      gender: { type: String, enum: ["male", "female", "other"] },
      profilePicture: String,
    },
    location: {
      state: { type: String, required: true },
      lga: String, // Local Government Area
      village: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      timezone: { type: String, default: "Africa/Lagos" },
    },
    farmingInfo: {
      experienceYears: { type: Number, default: 0 },
      farmSize: { type: Number, default: 0 }, // in hectares
      farmType: {
        type: String,
        enum: ["subsistence", "commercial", "mixed", "organic"],
        default: "subsistence",
      },
      primaryCrops: [String],
      secondaryCrops: [String],
      livestock: [String],
      farmingMethods: [String],
      challenges: [String],
      goals: [String],
    },
    preferences: {
      language: { type: String, default: "en" },
      currency: { type: String, default: "NGN" },
      units: { type: String, default: "metric" },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        weather: { type: Boolean, default: true },
        community: { type: Boolean, default: true },
        learning: { type: Boolean, default: true },
      },
    },
    achievements: [
      {
        type: {
          type: String,
          enum: [
            "first_diagnosis",
            "community_helper",
            "learning_champion",
            "weather_watcher",
            "crop_expert",
            "social_connector",
          ],
        },
        title: String,
        description: String,
        earnedAt: { type: Date, default: Date.now },
        icon: String,
      },
    ],
    statistics: {
      totalDiagnoses: { type: Number, default: 0 },
      successfulTreatments: { type: Number, default: 0 },
      communityPosts: { type: Number, default: 0 },
      helpfulAnswers: { type: Number, default: 0 },
      coursesCompleted: { type: Number, default: 0 },
      loginStreak: { type: Number, default: 0 },
      lastLoginDate: Date,
    },
    verificationStatus: {
      isVerified: { type: Boolean, default: false },
      verificationMethod: String,
      verificationDate: Date,
      verificationLevel: {
        type: String,
        enum: ["basic", "intermediate", "advanced", "expert"],
        default: "basic",
      },
    },
    socialConnections: {
      following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free",
      },
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual fields
userProfileSchema.virtual("fullName").get(function () {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

userProfileSchema.virtual("farmingExperience").get(function () {
  const years = this.farmingInfo.experienceYears;
  if (years < 1) return "Beginner";
  if (years < 5) return "Intermediate";
  if (years < 10) return "Experienced";
  return "Expert";
});

// Indexes for better query performance
userProfileSchema.index({ "location.state": 1 });
userProfileSchema.index({ "farmingInfo.primaryCrops": 1 });
userProfileSchema.index({ "verificationStatus.isVerified": 1 });

module.exports = mongoose.model("UserProfile", userProfileSchema);
