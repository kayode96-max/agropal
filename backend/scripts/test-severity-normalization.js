const CropDiagnosisAI = require("../utils/aiDiagnosis");

// Test the severity normalization function
async function testSeverityNormalization() {
  console.log("Testing severity normalization...");

  const aiDiagnosis = new CropDiagnosisAI();

  // Test various input severities
  const testCases = [
    { input: "mild", expected: "low" },
    { input: "minor", expected: "low" },
    { input: "slight", expected: "low" },
    { input: "low", expected: "low" },
    { input: "moderate", expected: "moderate" },
    { input: "medium", expected: "moderate" },
    { input: "average", expected: "moderate" },
    { input: "high", expected: "high" },
    { input: "severe", expected: "high" },
    { input: "serious", expected: "high" },
    { input: "major", expected: "high" },
    { input: "critical", expected: "critical" },
    { input: "extreme", expected: "critical" },
    { input: "urgent", expected: "critical" },
    { input: "emergency", expected: "critical" },
    { input: "none", expected: "low" },
    { input: "unknown", expected: "moderate" },
    { input: "", expected: "moderate" },
    { input: null, expected: "moderate" },
    { input: undefined, expected: "moderate" },
    { input: "invalid_value", expected: "moderate" },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = aiDiagnosis.normalizeSeverity(testCase.input);
    if (result === testCase.expected) {
      console.log(`✓ ${testCase.input} -> ${result}`);
      passed++;
    } else {
      console.log(
        `✗ ${testCase.input} -> ${result} (expected: ${testCase.expected})`
      );
      failed++;
    }
  }

  console.log(
    `\nSeverity normalization test results: ${passed} passed, ${failed} failed`
  );

  // Test with mock diagnosis
  console.log("\nTesting mock diagnosis with severity normalization...");
  const mockDiagnosis = aiDiagnosis.getMockDiagnosis({ cropType: "tomato" });

  console.log("Mock diagnosis severity:", mockDiagnosis.severity);

  // Verify it's a valid severity
  const validSeverities = ["low", "moderate", "high", "critical"];
  if (validSeverities.includes(mockDiagnosis.severity)) {
    console.log("✓ Mock diagnosis severity is valid");
  } else {
    console.log(
      "✗ Mock diagnosis severity is invalid:",
      mockDiagnosis.severity
    );
  }
}

// Test the complete diagnosis flow
async function testCompleteFlow() {
  console.log("\nTesting complete diagnosis flow...");

  const aiDiagnosis = new CropDiagnosisAI();

  // Mock image buffer
  const mockImageBuffer = Buffer.from("fake image data");

  // Test metadata
  const metadata = {
    cropType: "tomato",
    location: { state: "Lagos" },
  };

  try {
    const result = await aiDiagnosis.diagnoseCrop(mockImageBuffer, metadata);

    console.log("Diagnosis result:", {
      disease: result.disease,
      confidence: result.confidence,
      severity: result.severity,
      description: result.description?.substring(0, 100) + "...",
    });

    // Verify severity is valid
    const validSeverities = ["low", "moderate", "high", "critical"];
    if (validSeverities.includes(result.severity)) {
      console.log("✓ Diagnosis severity is valid");
    } else {
      console.log("✗ Diagnosis severity is invalid:", result.severity);
    }

    console.log("✓ Complete diagnosis flow test passed");
  } catch (error) {
    console.error("✗ Complete diagnosis flow test failed:", error.message);
  }
}

// Run tests
async function runTests() {
  console.log("=== AI Diagnosis Severity Normalization Tests ===\n");

  await testSeverityNormalization();
  await testCompleteFlow();

  console.log("\n=== Tests completed ===");
}

runTests();
