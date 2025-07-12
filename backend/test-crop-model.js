require("dotenv").config();
const mongoose = require("mongoose");
const CropDiagnosis = require("./models/CropDiagnosis");

async function testCropDiagnosisModel() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connected");

    console.log("Testing CropDiagnosis model...");

    // Test data
    const testData = {
      imageUrl: "/uploads/crops/test-image.jpg",
      imageMetadata: {
        originalName: "test.jpg",
        size: 1024,
        mimeType: "image/jpeg",
        uploadTimestamp: new Date(),
      },
      cropInfo: {
        type: "cassava",
        variety: "local",
        plantingDate: new Date("2025-01-01"),
        growthStage: "vegetative",
        location: {
          state: "Lagos",
          lga: "Ikeja",
          coordinates: { lat: 6.5, lon: 3.3 },
        },
        symptoms: ["yellowing leaves", "leaf spots"],
        previousTreatments: ["watering", "weeding"],
      },
      diagnosis: {
        disease: "Leaf Spot Disease",
        confidence: 0.85,
        severity: "moderate",
        description: "Common fungal infection",
        possibleCauses: ["High humidity", "Poor air circulation"],
        processedAt: new Date(),
      },
      treatment: {
        immediate: ["Remove affected leaves"],
        longTerm: ["Apply fungicide"],
        prevention: ["Improve air circulation"],
        organicOptions: ["Neem oil"],
        chemicalOptions: ["Fungicide"],
        localRemedies: ["Garlic spray"],
      },
      location: {
        state: "Lagos",
        lga: "Ikeja",
        coordinates: { lat: 6.5, lon: 3.3 },
      },
      status: "diagnosed",
      tags: ["cassava", "leaf spot", "Lagos"],
    };

    console.log("Creating CropDiagnosis document...");
    const diagnosis = new CropDiagnosis(testData);

    console.log("Saving to database...");
    const saved = await diagnosis.save();
    console.log("✅ CropDiagnosis saved successfully!");
    console.log("Saved ID:", saved._id);

    // Clean up
    await CropDiagnosis.deleteOne({ _id: saved._id });
    console.log("✅ Test document cleaned up");

    await mongoose.disconnect();
    console.log("✅ Database disconnected");
  } catch (error) {
    console.error("❌ CropDiagnosis test failed:", error.message);
    console.error("Error details:", error);

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

testCropDiagnosisModel();
