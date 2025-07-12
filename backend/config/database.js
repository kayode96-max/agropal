const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);

    // Create indexes for better performance
    await createIndexes();

    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // Text search indexes for community posts
    await mongoose.model("CommunityPost").collection.createIndex({
      title: "text",
      content: "text",
      tags: "text",
    });

    // Text search indexes for learning modules
    await mongoose.model("LearningModule").collection.createIndex({
      title: "text",
      description: "text",
      keyTopics: "text",
    });

    console.log("📊 Database indexes created successfully");
  } catch (error) {
    console.error("❌ Error creating indexes:", error.message);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed through app termination");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error.message);
    process.exit(1);
  }
});

module.exports = connectDB;
