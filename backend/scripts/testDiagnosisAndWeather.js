const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

async function testCropDiagnosis() {
  try {
    console.log("🔬 Testing crop diagnosis API...");

    // Check if there's a test image in uploads
    const testImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      "crops",
      "crop-1751740338721-942807440.jpg"
    );

    if (!fs.existsSync(testImagePath)) {
      console.log("⚠️  No test image found, skipping diagnosis test");
      return;
    }

    // Use actual test image
    const formData = new FormData();
    formData.append("image", fs.createReadStream(testImagePath));
    formData.append("cropType", "tomato");
    formData.append("location", JSON.stringify({ state: "Lagos" }));
    formData.append("symptoms", "Yellow leaves, brown spots");
    formData.append("plantingDate", "2025-01-01");
    formData.append("growthStage", "flowering");
    // Remove userId or use a valid ObjectId format
    // formData.append("userId", "test-user-id");

    const response = await axios.post(
      "http://localhost:5001/api/crops/diagnose",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    console.log("✅ Diagnosis successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Diagnosis failed:",
      error.response?.data || error.message
    );
  }
}

// Test weather API
async function testWeatherAPI() {
  try {
    console.log("\n🌤️  Testing weather API...");

    const response = await axios.get(
      "http://localhost:5001/api/weather/current/Lagos"
    );

    console.log("✅ Weather API successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "❌ Weather API failed:",
      error.response?.data || error.message
    );
  }
}

async function runTests() {
  await testCropDiagnosis();
  await testWeatherAPI();
}

runTests();
