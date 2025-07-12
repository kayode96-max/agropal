const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "weather_alert",
        "crop_diagnosis",
        "community_mention",
        "community_reply",
        "learning_reminder",
        "achievement",
        "system_update",
        "crop_calendar",
        "market_price",
        "pest_outbreak",
        "seasonal_advice",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["info", "warning", "success", "error"],
      default: "info",
    },
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    channels: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "read", "failed"],
      default: "pending",
    },
    readAt: Date,
    sentAt: Date,
    deliveredAt: Date,
    scheduledFor: Date,
    expiresAt: Date,
    actionUrl: String,
    actionText: String,
    imageUrl: String,
    relatedEntity: {
      type: String,
      entityId: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ scheduledFor: 1 });

// Auto-expire notifications (TTL index)
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Notification", notificationSchema);
