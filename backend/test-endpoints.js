const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

console.log("🧪 Testing Agropal Crop Diagnosis API...\n");

// Test basic API health
async function testHealthEndpoint() {
  try {
    const response = await axios.get("http://localhost:5000/health");
    console.log("✅ Health endpoint working:", response.data);
    return true;
  } catch (error) {
    console.log("❌ Health endpoint failed:", error.message);
    return false;
  }
}

// Test crop diseases endpoint
async function testCropDiseasesEndpoint() {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/crops/diseases?cropType=cassava"
    );
    console.log("✅ Crop diseases endpoint working");
    console.log(`   Found ${response.data.diseases.length} cassava diseases`);
    return true;
  } catch (error) {
    console.log("❌ Crop diseases endpoint failed:", error.message);
    return false;
  }
}

// Test crop diagnosis with mock image
async function testCropDiagnosisEndpoint() {
  try {
    console.log("🌱 Testing crop diagnosis with mock data...");

    // Create a small test image file
    const testImagePath = path.join(__dirname, "test-crop-image.jpg");

    // Create a minimal JPEG file (1x1 pixel)
    const minimalJpeg = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
      0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
      0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
      0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xff, 0xc4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xda, 0x00, 0x0c,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, 0x8a, 0x00,
      0xff, 0xd9,
    ]);

    fs.writeFileSync(testImagePath, minimalJpeg);

    const formData = new FormData();
    formData.append("image", fs.createReadStream(testImagePath));
    formData.append("cropType", "cassava");
    formData.append("symptoms", "yellow leaves, stunted growth");
    formData.append(
      "location",
      JSON.stringify({
        state: "Lagos",
        lga: "Ikeja",
      })
    );

    const response = await axios.post(
      "http://localhost:5000/api/crops/diagnose",
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000,
      }
    );

    console.log("✅ Crop diagnosis working!");
    console.log(`   Disease: ${response.data.diagnosis.disease}`);
    console.log(`   Confidence: ${response.data.diagnosis.confidence}%`);
    console.log(
      `   Treatment options: ${response.data.treatment.immediate.length} immediate actions`
    );

    // Clean up test file
    fs.unlinkSync(testImagePath);

    return true;
  } catch (error) {
    console.log(
      "❌ Crop diagnosis failed:",
      error.response?.data?.error || error.message
    );
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("🧪 Testing Agropal Backend APIs...\n");

  const results = {
    health: await testHealthEndpoint(),
    diseases: await testCropDiseasesEndpoint(),
    diagnosis: await testCropDiagnosisEndpoint(),
  };

  console.log("\n📊 API Test Results:");
  console.log("===================");
  console.log(
    `🏥 Health Check: ${results.health ? "✅ Working" : "❌ Failed"}`
  );
  console.log(
    `🦠 Disease Database: ${results.diseases ? "✅ Working" : "❌ Failed"}`
  );
  console.log(
    `🔬 Crop Diagnosis: ${results.diagnosis ? "✅ Working" : "❌ Failed"}`
  );

  const workingEndpoints = Object.values(results).filter(Boolean).length;
  console.log(`\n📈 Status: ${workingEndpoints}/3 endpoints working`);

  if (workingEndpoints === 3) {
    console.log("🎉 All core APIs are working! Agropal backend is ready!");
    console.log(
      "💡 You can now start the frontend and test the full application!"
    );
  } else {
    console.log(
      "❌ Some endpoints are not working. Check if the backend server is running."
    );
  }
}

runAllTests().catch(console.error);
