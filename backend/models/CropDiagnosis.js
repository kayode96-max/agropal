const mongoose = require("mongoose");

const cropDiagnosisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageMetadata: {
      originalName: String,
      size: Number,
      mimeType: String,
      uploadTimestamp: Date,
    },
    cropInfo: {
      type: {
        type: String,
        required: true,
        enum: [
          "cassava",
          "yam",
          "maize",
          "rice",
          "millet",
          "sorghum",
          "cowpea",
          "groundnut",
          "soybean",
          "cocoa",
          "oil_palm",
          "plantain",
          "banana",
          "tomato",
          "pepper",
          "okra",
          "onion",
          "garlic",
          "ginger",
          "potato",
          "sweet_potato",
          "cotton",
          "sugarcane",
          "other",
        ],
      },
      variety: String,
      plantingDate: Date,
      growthStage: {
        type: String,
        enum: ["seedling", "vegetative", "flowering", "fruiting", "maturity"],
      },
    },
    symptoms: {
      description: String,
      userReported: [String], // User-reported symptoms
      aiDetected: [String], // AI-detected symptoms
    },
    diagnosis: {
      disease: String,
      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },
      severity: {
        type: String,
        enum: ["low", "moderate", "high", "critical"],
      },
      description: String,
      possibleCauses: [String],
      aiModel: String,
      processedAt: Date,
    },
    treatment: {
      immediate: [String],
      longTerm: [String],
      prevention: [String],
      organicOptions: [String],
      chemicalOptions: [String],
      localRemedies: [String], // Traditional Nigerian remedies
      cost: {
        low: String,
        medium: String,
        high: String,
      },
    },
    location: {
      state: String,
      lga: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      weatherConditions: {
        temperature: Number,
        humidity: Number,
        rainfall: Number,
      },
    },
    status: {
      type: String,
      enum: ["pending", "diagnosed", "treated", "resolved"],
      default: "pending",
    },
    feedback: {
      wasHelpful: Boolean,
      treatmentEffective: Boolean,
      additionalNotes: String,
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes
cropDiagnosisSchema.index({ userId: 1 });
cropDiagnosisSchema.index({ "cropInfo.type": 1 });
cropDiagnosisSchema.index({ "diagnosis.disease": 1 });
cropDiagnosisSchema.index({ "location.state": 1 });
cropDiagnosisSchema.index({ createdAt: -1 });

module.exports = mongoose.model("CropDiagnosis", cropDiagnosisSchema);
