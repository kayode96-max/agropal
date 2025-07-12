const mongoose = require("mongoose");
const seedDatabase = require("./seedData");

async function runSeed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://kayode96max:Agropalai@agropal.khvjyoy.mongodb.net/?retryWrites=true&w=majority&appName=Agropal"
    );
    console.log("🗄️  MongoDB Connected");

    // Run the seed function
    const result = await seedDatabase();
    console.log("Seed results:", result);

    // Disconnect
    await mongoose.disconnect();
    console.log("✅ Database seeding completed and disconnected");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

runSeed();
