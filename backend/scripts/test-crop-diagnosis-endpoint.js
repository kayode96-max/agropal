const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

async function testCropDiagnosisEndpoint() {
  console.log("Testing crop diagnosis endpoint with severity normalization...");

  const API_BASE = "http://localhost:5001/api";

  // First, test login to get token
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      identifier: "farmer@test.com",
      password: "password123",
    });

    const token = loginResponse.data.token;
    console.log("✓ Login successful");

    // Create form data with an image
    const form = new FormData();

    // Use the existing test image
    const imagePath = path.join(__dirname, "../test-crop-image.jpg");
    if (fs.existsSync(imagePath)) {
      form.append("image", fs.createReadStream(imagePath));
    } else {
      // Create a dummy image file for testing
      const dummyImagePath = path.join(__dirname, "dummy-crop.jpg");
      fs.writeFileSync(dummyImagePath, Buffer.from("dummy image data"));
      form.append("image", fs.createReadStream(dummyImagePath));
    }

    form.append("cropType", "tomato");
    form.append("location", JSON.stringify({ state: "Lagos", lga: "Ikeja" }));

    // Test the crop diagnosis endpoint
    const diagnosisResponse = await axios.post(
      `${API_BASE}/crops/diagnose`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✓ Crop diagnosis endpoint responded successfully");
    console.log("Response data:", {
      success: diagnosisResponse.data.success,
      disease: diagnosisResponse.data.diagnosis?.disease,
      confidence: diagnosisResponse.data.diagnosis?.confidence,
      severity: diagnosisResponse.data.diagnosis?.severity,
      description:
        diagnosisResponse.data.diagnosis?.description?.substring(0, 100) +
        "...",
    });

    // Verify severity is valid
    const validSeverities = ["low", "moderate", "high", "critical"];
    const severity = diagnosisResponse.data.diagnosis?.severity;

    if (validSeverities.includes(severity)) {
      console.log("✓ Returned severity is valid:", severity);
    } else {
      console.log("✗ Returned severity is invalid:", severity);
    }

    // Test without authentication (should fail gracefully)
    try {
      const unauthedResponse = await axios.post(
        `${API_BASE}/crops/diagnose`,
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        }
      );
      console.log("✗ Unauthenticated request should have failed");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✓ Unauthenticated request properly rejected");
      } else {
        console.log(
          "✗ Unexpected error for unauthenticated request:",
          error.message
        );
      }
    }
  } catch (error) {
    console.error("✗ Test failed:", error.message);
    if (error.response?.data) {
      console.error("Error response:", error.response.data);
    }
  }
}

async function testCropDiagnosisModel() {
  console.log("\\nTesting CropDiagnosis model validation...");

  // Load environment variables
  require("dotenv").config();

  const mongoose = require("mongoose");
  const CropDiagnosis = require("../models/CropDiagnosis");

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);

    // Test creating a diagnosis with valid severity
    const validDiagnosis = new CropDiagnosis({
      imageUrl: "test-image.jpg",
      cropInfo: {
        type: "tomato",
        variety: "Roma",
        growthStage: "maturity",
      },
      diagnosis: {
        disease: "Test Disease",
        confidence: 0.8,
        severity: "moderate",
        description: "Test description",
      },
      treatment: {
        immediate: ["Test treatment"],
        longTerm: ["Test long term"],
      },
    });

    await validDiagnosis.save();
    console.log("✓ Valid diagnosis saved successfully");

    // Test with invalid severity (should fail)
    try {
      const invalidDiagnosis = new CropDiagnosis({
        imageUrl: "test-image2.jpg",
        cropInfo: {
          type: "tomato",
          variety: "Roma",
          growthStage: "maturity",
        },
        diagnosis: {
          disease: "Test Disease",
          confidence: 0.8,
          severity: "mild", // Invalid severity
          description: "Test description",
        },
        treatment: {
          immediate: ["Test treatment"],
          longTerm: ["Test long term"],
        },
      });

      await invalidDiagnosis.save();
      console.log("✗ Invalid diagnosis should have failed validation");
    } catch (error) {
      console.log("✓ Invalid severity properly rejected:", error.message);
    }

    // Clean up
    await CropDiagnosis.deleteMany({
      imageUrl: { $in: ["test-image.jpg", "test-image2.jpg"] },
    });
  } catch (error) {
    console.error("✗ Model test failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

async function runTests() {
  console.log("=== Crop Diagnosis Endpoint Tests ===\\n");

  await testCropDiagnosisEndpoint();
  await testCropDiagnosisModel();

  console.log("\\n=== Tests completed ===");
}

runTests();
