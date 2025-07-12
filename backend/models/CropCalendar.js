const mongoose = require("mongoose");

const cropCalendarSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cropType: { type: String, required: true },
    variety: String,
    season: {
      type: String,
      enum: ["dry", "wet", "harmattan", "year-round"],
      required: true,
    },
    plantingDate: { type: Date, required: true },
    expectedHarvestDate: Date,
    actualHarvestDate: Date,
    farmLocation: {
      state: String,
      lga: String,
      village: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      farmSize: Number, // in hectares
      plotName: String,
    },
    activities: [
      {
        type: {
          type: String,
          enum: [
            "land_preparation",
            "planting",
            "weeding",
            "fertilizing",
            "pest_control",
            "disease_treatment",
            "irrigation",
            "harvesting",
            "post_harvest",
            "storage",
            "marketing",
          ],
        },
        name: String,
        description: String,
        scheduledDate: Date,
        completedDate: Date,
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed", "overdue", "cancelled"],
          default: "pending",
        },
        cost: Number,
        notes: String,
        photos: [String],
        reminders: [
          {
            type: {
              type: String,
              enum: ["email", "sms", "push"],
            },
            time: Date,
            sent: { type: Boolean, default: false },
          },
        ],
      },
    ],
    inputs: [
      {
        type: {
          type: String,
          enum: [
            "seed",
            "fertilizer",
            "pesticide",
            "herbicide",
            "fungicide",
            "labor",
            "equipment",
          ],
        },
        name: String,
        quantity: Number,
        unit: String,
        cost: Number,
        supplier: String,
        applicationDate: Date,
        notes: String,
      },
    ],
    monitoring: {
      soilHealth: {
        pH: Number,
        nitrogen: Number,
        phosphorus: Number,
        potassium: Number,
        organicMatter: Number,
        lastTested: Date,
      },
      weatherConditions: {
        rainfall: Number,
        temperature: {
          min: Number,
          max: Number,
          average: Number,
        },
        humidity: Number,
        sunlight: Number,
      },
      cropHealth: {
        germination: Number,
        growth: String,
        pests: [String],
        diseases: [String],
        overallHealth: {
          type: String,
          enum: ["excellent", "good", "fair", "poor", "critical"],
        },
      },
    },
    harvest: {
      expectedYield: Number,
      actualYield: Number,
      quality: {
        type: String,
        enum: ["premium", "good", "fair", "poor"],
      },
      harvestCost: Number,
      storageMethod: String,
      storageCost: Number,
      marketPrice: Number,
      buyer: String,
      totalIncome: Number,
      netProfit: Number,
    },
    lessons: [
      {
        observation: String,
        lesson: String,
        improvement: String,
        category: String,
        date: { type: Date, default: Date.now },
      },
    ],
    shared: {
      isPublic: { type: Boolean, default: false },
      sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      permissions: {
        view: { type: Boolean, default: true },
        comment: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
      },
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed", "failed", "abandoned"],
      default: "planning",
    },
    tags: [String],
    certifications: [String], // organic, fair trade, etc.
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual fields
cropCalendarSchema.virtual("totalCost").get(function () {
  const inputsCost = this.inputs.reduce(
    (sum, input) => sum + (input.cost || 0),
    0
  );
  const activitiesCost = this.activities.reduce(
    (sum, activity) => sum + (activity.cost || 0),
    0
  );
  const harvestCost = this.harvest?.harvestCost || 0;
  const storageCost = this.harvest?.storageCost || 0;
  return inputsCost + activitiesCost + harvestCost + storageCost;
});

cropCalendarSchema.virtual("profitMargin").get(function () {
  const totalIncome = this.harvest?.totalIncome || 0;
  const totalCost = this.totalCost;
  return totalIncome - totalCost;
});

cropCalendarSchema.virtual("roi").get(function () {
  const totalCost = this.totalCost;
  const profitMargin = this.profitMargin;
  return totalCost > 0 ? (profitMargin / totalCost) * 100 : 0;
});

// Indexes
cropCalendarSchema.index({ userId: 1, status: 1 });
cropCalendarSchema.index({ cropType: 1, season: 1 });
cropCalendarSchema.index({ plantingDate: 1 });
cropCalendarSchema.index({ "farmLocation.state": 1 });
cropCalendarSchema.index({ "activities.scheduledDate": 1 });

module.exports = mongoose.model("CropCalendar", cropCalendarSchema);
