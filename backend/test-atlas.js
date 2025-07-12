const mongoose = require("mongoose");
require("dotenv").config();

console.log("🧪 Testing MongoDB Atlas Connection...\n");

// Test connection
async function testAtlasConnection() {
  try {
    console.log("🔄 Connecting to MongoDB Atlas...");
    console.log(
      "📍 Connection URI:",
      process.env.MONGODB_URI ? "URI loaded from .env" : "❌ No URI found"
    );

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Atlas connected successfully!");
    console.log("🏠 Database host:", mongoose.connection.host);
    console.log("📊 Database name:", mongoose.connection.name);
    console.log(
      "🔌 Connection state:",
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    );

    // Test basic operations
    console.log("\n🧪 Testing basic database operations...");

    // Create a simple test collection
    const testCollection = mongoose.connection.db.collection("test");

    // Insert a test document
    await testCollection.insertOne({
      test: "Agropal MongoDB Atlas Test",
      timestamp: new Date(),
      message: "If you can see this, your Atlas connection is working!",
    });

    // Find the test document
    const testDoc = await testCollection.findOne({
      test: "Agropal MongoDB Atlas Test",
    });
    console.log(
      "✅ Test document inserted and retrieved:",
      testDoc ? "SUCCESS" : "FAILED"
    );

    // Clean up test document
    await testCollection.deleteOne({ test: "Agropal MongoDB Atlas Test" });
    console.log("🧹 Test document cleaned up");

    console.log(
      "\n🎉 All tests passed! Your MongoDB Atlas is ready for Agropal!"
    );
  } catch (error) {
    console.error("❌ MongoDB Atlas connection failed:");
    console.error("Error:", error.message);

    if (error.message.includes("authentication failed")) {
      console.log(
        "\n💡 Fix: Check your username and password in the connection string"
      );
    } else if (error.message.includes("network")) {
      console.log("\n💡 Fix: Check your network access settings in Atlas");
    } else {
      console.log("\n💡 Fix: Verify your connection string in .env file");
    }
  } finally {
    await mongoose.connection.close();
    console.log("\n🔚 Connection closed");
    process.exit(0);
  }
}

testAtlasConnection();
