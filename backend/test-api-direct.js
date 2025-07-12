const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

async function testCropDiagnosisAPI() {
  try {
    console.log("Testing Crop Diagnosis API...");

    // Create a small test image file
    const testImagePath = path.join(__dirname, "test-image.jpg");
    const testImageData = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
      0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
      0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
      0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xd9,
    ]);

    fs.writeFileSync(testImagePath, testImageData);
    console.log("✅ Test image created");

    // Create form data
    const formData = new FormData();
    formData.append("image", fs.createReadStream(testImagePath));
    formData.append("cropType", "cassava");
    formData.append("location", JSON.stringify({ state: "Lagos" }));
    formData.append("symptoms", "yellowing leaves");
    formData.append("plantingDate", "2025-01-01");
    formData.append("growthStage", "vegetative");
    formData.append("userId", "test-user-id");

    console.log("Sending request to crop diagnosis API...");

    const response = await axios.post(
      "http://localhost:5001/api/crops/diagnose",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    console.log("✅ API Response received");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data, null, 2));

    // Clean up test image
    fs.unlinkSync(testImagePath);
    console.log("✅ Test image cleaned up");
  } catch (error) {
    console.error("❌ API Test failed");
    console.error("Error message:", error.message);
    console.error("Response status:", error.response?.status);
    console.error("Response data:", error.response?.data);

    // Clean up test image if it exists
    const testImagePath = path.join(__dirname, "test-image.jpg");
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  }
}

testCropDiagnosisAPI();
