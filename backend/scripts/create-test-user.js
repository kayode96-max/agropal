const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Load environment variables
require("dotenv").config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if farmer@test.com already exists
    const existingUser = await User.findOne({ email: "farmer@test.com" });
    if (existingUser) {
      console.log("Test user already exists");
      await mongoose.connection.close();
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("password123", 10);

    const testUser = new User({
      name: "Test Farmer",
      email: "farmer@test.com",
      phone: "+2348012345678",
      password: hashedPassword,
      location: {
        state: "Lagos",
        lga: "Ikeja",
        coordinates: {
          latitude: 6.5244,
          longitude: 3.3792,
        },
      },
      profile: {
        farmSize: 2,
        experience: 5,
        primaryCrops: ["tomato", "maize"],
        farmingType: "mixed",
        language: "en",
        communicationPreference: "voice",
      },
      isVerified: true,
      isActive: true,
    });

    await testUser.save();
    console.log("Test user created successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating test user:", error.message);
  }
}

createTestUser();
