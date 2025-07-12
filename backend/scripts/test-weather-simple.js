const axios = require("axios");

async function testWeatherEndpoint() {
  console.log("Testing weather endpoint...");

  const API_BASE = "http://localhost:5001/api";

  try {
    // Test without authentication first
    const response = await axios.get(`${API_BASE}/weather/current/Lagos`);
    console.log("Weather API Response:", response.data);
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);
  }
}

testWeatherEndpoint();
