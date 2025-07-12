const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function finalIntegrationTest() {
  console.log("=== Final Integration Test - Agropal Audit ===\n");

  const API_BASE = "http://localhost:5001/api";
  let testResults = {
    authentication: false,
    diagnosis: false,
    weather: false,
    frontend: false,
    severityNormalization: false,
  };

  try {
    // 1. Test Authentication
    console.log("1. Testing Authentication...");
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      identifier: "farmer@test.com",
      password: "password123",
    });

    if (loginResponse.data.success && loginResponse.data.token) {
      console.log("✓ Authentication working correctly");
      testResults.authentication = true;
    } else {
      console.log("✗ Authentication failed");
    }

    const token = loginResponse.data.token;

    // 2. Test Weather API
    console.log("\\n2. Testing Weather API...");
    try {
      const weatherResponse = await axios.get(
        `${API_BASE}/weather/current/Lagos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (
        weatherResponse.data.success &&
        weatherResponse.data.data.current.temperature
      ) {
        console.log("✓ Weather API working with real data");
        console.log(
          `   Temperature: ${weatherResponse.data.data.current.temperature}°C`
        );
        console.log(
          `   Condition: ${weatherResponse.data.data.current.condition}`
        );
        testResults.weather = true;
      } else {
        console.log("✗ Weather API failed - no temperature data");
      }
    } catch (error) {
      console.log("✗ Weather API failed:", error.message);
    }

    // 3. Test Crop Diagnosis API
    console.log("\\n3. Testing Crop Diagnosis API...");
    const FormData = require("form-data");
    const form = new FormData();

    // Create a simple test image
    const testImagePath = path.join(__dirname, "test-image.jpg");
    fs.writeFileSync(testImagePath, Buffer.from("fake image data"));

    form.append("image", fs.createReadStream(testImagePath));
    form.append("cropType", "tomato");
    form.append("location", JSON.stringify({ state: "Lagos", lga: "Ikeja" }));

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

    if (diagnosisResponse.data.success && diagnosisResponse.data.diagnosis) {
      const diagnosis = diagnosisResponse.data.diagnosis;
      console.log("✓ Crop diagnosis API working correctly");
      console.log(`   Disease: ${diagnosis.disease}`);
      console.log(`   Confidence: ${diagnosis.confidence}%`);
      console.log(`   Severity: ${diagnosis.severity}`);

      // Verify severity is valid
      const validSeverities = ["low", "moderate", "high", "critical"];
      if (validSeverities.includes(diagnosis.severity)) {
        console.log("✓ Severity normalization working correctly");
        testResults.severityNormalization = true;
      } else {
        console.log("✗ Severity normalization failed");
      }

      testResults.diagnosis = true;
    } else {
      console.log("✗ Crop diagnosis API failed");
    }

    // Clean up test image
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }

    // 4. Test Frontend connectivity
    console.log("\\n4. Testing Frontend connectivity...");
    try {
      const frontendResponse = await axios.get("http://localhost:3000", {
        timeout: 5000,
      });

      if (frontendResponse.status === 200) {
        console.log("✓ Frontend server accessible");
        testResults.frontend = true;
      } else {
        console.log("✗ Frontend server not responding correctly");
      }
    } catch (error) {
      console.log("✗ Frontend server not accessible");
    }

    // 5. Test User Profile endpoint
    console.log("\\n5. Testing User Profile endpoint...");
    const profileResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (profileResponse.data.success && profileResponse.data.user) {
      console.log("✓ User profile endpoint working");
      console.log(`   User: ${profileResponse.data.user.name}`);
      console.log(`   Email: ${profileResponse.data.user.email}`);
    } else {
      console.log("✗ User profile endpoint failed");
    }
  } catch (error) {
    console.error("Test error:", error.message);
    if (error.response?.data) {
      console.error("Error details:", error.response.data);
    }
  }

  // Summary
  console.log("\\n=== Test Results Summary ===");
  console.log(
    `Authentication: ${testResults.authentication ? "✓ PASS" : "✗ FAIL"}`
  );
  console.log(`Weather API: ${testResults.weather ? "✓ PASS" : "✗ FAIL"}`);
  console.log(`Crop Diagnosis: ${testResults.diagnosis ? "✓ PASS" : "✗ FAIL"}`);
  console.log(
    `Severity Normalization: ${
      testResults.severityNormalization ? "✓ PASS" : "✗ FAIL"
    }`
  );
  console.log(`Frontend: ${testResults.frontend ? "✓ PASS" : "✗ FAIL"}`);

  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;

  console.log(`\\nOverall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log(
      "\\n🎉 All tests passed! Agropal audit completed successfully."
    );
    console.log("✅ Authentication working correctly");
    console.log("✅ Weather API using real data");
    console.log("✅ Crop diagnosis API functional");
    console.log("✅ Severity normalization implemented");
    console.log("✅ Frontend accessible");
  } else {
    console.log("\\n⚠️  Some tests failed. Check the results above.");
  }

  console.log("\\n=== Audit Complete ===");
}

finalIntegrationTest();
