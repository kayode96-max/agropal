const express = require("express");
const multer = require("multer");
const CropDiagnosisAI = require("./utils/aiDiagnosis");

// Test the AI diagnosis service
async function testAIDiagnosis() {
  try {
    console.log("Testing AI Diagnosis service...");

    const diagnosisAI = new CropDiagnosisAI();

    // Create a mock image buffer
    const mockImageBuffer = Buffer.from("mock image data");

    // Test metadata
    const metadata = {
      cropType: "cassava",
      location: { state: "Lagos" },
      symptoms: "yellowing leaves",
      plantingDate: "2025-01-01",
      growthStage: "vegetative",
    };

    console.log("Calling diagnoseCrop...");
    const result = await diagnosisAI.diagnoseCrop(mockImageBuffer, metadata);

    console.log("AI Diagnosis result:", JSON.stringify(result, null, 2));
    console.log("✅ AI Diagnosis test passed!");
  } catch (error) {
    console.error("❌ AI Diagnosis test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Test multer upload
function testMulter() {
  try {
    console.log("Testing multer configuration...");

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadDir = "uploads/crops";
        if (!require("fs").existsSync(uploadDir)) {
          require("fs").mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = require("path").extname(file.originalname);
        cb(null, "crop-" + uniqueSuffix + ext);
      },
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: function (req, file, cb) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type"));
        }
      },
    });

    console.log("✅ Multer configuration test passed!");
  } catch (error) {
    console.error("❌ Multer configuration test failed:", error.message);
  }
}

// Run tests
async function runTests() {
  console.log("=== Crop Diagnosis Backend Tests ===");

  testMulter();
  await testAIDiagnosis();

  console.log("=== Tests completed ===");
}

runTests();
