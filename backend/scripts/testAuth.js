const mongoose = require("mongoose");
const User = require("../models/User");

async function testAuth() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://kayode96max:Agropalai@agropal.khvjyoy.mongodb.net/?retryWrites=true&w=majority&appName=Agropal"
    );
    console.log("🗄️  MongoDB Connected");

    // Find all users
    const users = await User.find({}, { name: 1, email: 1, phone: 1 });
    console.log("📋 Available test users:");
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Password: password123`);
      console.log("---");
    });

    // Disconnect
    await mongoose.disconnect();
    console.log("✅ Database query completed");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testAuth();
