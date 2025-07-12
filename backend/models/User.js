const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["farmer", "extension_worker", "admin"],
      default: "farmer",
    },
    location: {
      state: {
        type: String,
        required: true,
        enum: [
          "Abia",
          "Adamawa",
          "Akwa Ibom",
          "Anambra",
          "Bauchi",
          "Bayelsa",
          "Benue",
          "Borno",
          "Cross River",
          "Delta",
          "Ebonyi",
          "Edo",
          "Ekiti",
          "Enugu",
          "FCT",
          "Gombe",
          "Imo",
          "Jigawa",
          "Kaduna",
          "Kano",
          "Katsina",
          "Kebbi",
          "Kogi",
          "Kwara",
          "Lagos",
          "Nasarawa",
          "Niger",
          "Ogun",
          "Ondo",
          "Osun",
          "Oyo",
          "Plateau",
          "Rivers",
          "Sokoto",
          "Taraba",
          "Yobe",
          "Zamfara",
        ],
      },
      lga: String, // Local Government Area
      ward: String,
      village: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    profile: {
      farmSize: Number, // in hectares
      primaryCrops: [String],
      farmingExperience: Number, // in years
      educationLevel: {
        type: String,
        enum: ["none", "primary", "secondary", "tertiary"],
      },
      preferredLanguage: {
        type: String,
        enum: ["en", "ha", "ig", "yo"], // English, Hausa, Igbo, Yoruba
        default: "en",
      },
      phoneType: {
        type: String,
        enum: ["smartphone", "feature_phone"],
        default: "smartphone",
      },
      internetAccess: {
        type: String,
        enum: ["good", "poor", "none"],
        default: "poor",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance (unique indexes already created by schema)
userSchema.index({ "location.state": 1 });
userSchema.index({ "profile.primaryCrops": 1 });

module.exports = mongoose.model("User", userSchema);
