const mongoose = require("mongoose");
const User = require("../models/User");

// Load environment variables
require("dotenv").config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const users = await User.find({});
    console.log("Found users:", users.length);

    if (users.length > 0) {
      console.log(
        "User emails:",
        users.map((u) => u.email)
      );
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkUsers();
