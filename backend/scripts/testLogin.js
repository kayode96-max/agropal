const axios = require("axios");

async function testLogin() {
  try {
    console.log("🔑 Testing login API...");

    const response = await axios.post("http://localhost:5001/api/auth/login", {
      identifier: "adamu.ibrahim@example.com",
      password: "password123",
    });

    console.log("✅ Login successful!");
    console.log("Response:", response.data);

    // Test the token by making an authenticated request
    const token = response.data.token;
    console.log("\n🔍 Testing authenticated request...");

    const authResponse = await axios.get("http://localhost:5001/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Auth check successful!");
    console.log("User data:", authResponse.data);
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
  }
}

testLogin();
