const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "crop_disease",
        "pest_control",
        "soil_management",
        "irrigation",
        "fertilizers",
        "seeds",
        "harvesting",
        "storage",
        "marketing",
        "weather",
        "government_programs",
        "financing",
        "machinery",
        "organic_farming",
        "livestock",
        "general",
        "success_story",
      ],
    },
    cropType: {
      type: String,
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
        "livestock",
        "other",
      ],
    },
    location: {
      state: String,
      lga: String,
      region: {
        type: String,
        enum: [
          "north_central",
          "north_east",
          "north_west",
          "south_east",
          "south_south",
          "south_west",
        ],
      },
    },
    images: [String], // Image URLs
    tags: [String],
    language: {
      type: String,
      enum: ["en", "ha", "ig", "yo"],
      default: "en",
    },
    votes: {
      upvotes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      downvotes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      total: {
        type: Number,
        default: 0,
      },
    },
    replies: [
      {
        content: {
          type: String,
          required: true,
          maxlength: 1000,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        votes: {
          upvotes: [
            {
              user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
              timestamp: {
                type: Date,
                default: Date.now,
              },
            },
          ],
          total: {
            type: Number,
            default: 0,
          },
        },
        aiTag: {
          type: String,
          enum: [
            "verified",
            "helpful",
            "needs_verification",
            "flagged",
            "none",
          ],
          default: "none",
        },
        language: {
          type: String,
          enum: ["en", "ha", "ig", "yo"],
          default: "en",
        },
      },
    ],
    aiModeration: {
      status: {
        type: String,
        enum: ["pending", "approved", "flagged", "rejected"],
        default: "pending",
      },
      confidence: Number,
      flags: [String],
      reviewedAt: Date,
      reviewedBy: String, // AI model or admin ID
    },
    visibility: {
      type: String,
      enum: ["public", "state_only", "region_only", "private"],
      default: "public",
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
    },
    views: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
communityPostSchema.index({ author: 1 });
communityPostSchema.index({ category: 1 });
communityPostSchema.index({ "location.state": 1 });
communityPostSchema.index({ "location.region": 1 });
communityPostSchema.index({ cropType: 1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ "votes.total": -1 });
communityPostSchema.index({ views: -1 });

module.exports = mongoose.model("CommunityPost", communityPostSchema);
