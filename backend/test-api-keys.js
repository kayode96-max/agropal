const axios = require("axios");
require("dotenv").config();

console.log("🔑 Testing API Keys for Agropal...\n");

// Test OpenWeatherMap API
async function testOpenWeatherAPI() {
  console.log("🌤️  Testing OpenWeatherMap API...");
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === "your_openweather_api_key_here") {
    console.log("❌ OpenWeatherMap API key not configured");
    return false;
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=Lagos,NG&appid=${apiKey}&units=metric`
    );
    console.log("✅ OpenWeatherMap API working!");
    console.log(
      `   Current weather in Lagos: ${response.data.weather[0].description}, ${response.data.main.temp}°C`
    );
    return true;
  } catch (error) {
    console.log(
      "❌ OpenWeatherMap API failed:",
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Test Plant.id API
async function testPlantIdAPI() {
  console.log("🌱 Testing Plant.id API...");
  const apiKey = process.env.PLANT_ID_API_KEY;

  if (!apiKey || apiKey === "your_plant_id_api_key_here") {
    console.log("❌ Plant.id API key not configured");
    return false;
  }

  try {
    // Test with a simple API call to check if key is valid
    const response = await axios.post(
      "https://api.plant.id/v2/identify",
      {
        images: [
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        ], // Tiny test image
        modifiers: ["crops_fast", "similar_images", "health_only"],
        plant_language: "en",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": apiKey,
        },
      }
    );
    console.log("✅ Plant.id API working!");
    return true;
  } catch (error) {
    console.log(
      "❌ Plant.id API failed:",
      error.response?.data?.error || error.message
    );
    return false;
  }
}

// Test OpenAI API
async function testOpenAIAPI() {
  console.log("🤖 Testing OpenAI API...");
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "your_openai_api_key_here") {
    console.log("❌ OpenAI API key not configured");
    return false;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: "What is the capital of Nigeria?" },
        ],
        max_tokens: 10,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ OpenAI API working!");
    console.log(
      `   Test response: ${response.data.choices[0].message.content}`
    );
    return true;
  } catch (error) {
    console.log(
      "❌ OpenAI API failed:",
      error.response?.data?.error?.message || error.message
    );
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("🧪 Testing all API integrations for Agropal...\n");

  const results = {
    openweather: await testOpenWeatherAPI(),
    plantid: await testPlantIdAPI(),
    openai: await testOpenAIAPI(),
  };

  console.log("\n📊 API Test Results:");
  console.log("===================");
  console.log(
    `🌤️  OpenWeatherMap: ${
      results.openweather ? "✅ Working" : "❌ Not configured"
    }`
  );
  console.log(
    `🌱 Plant.id: ${results.plantid ? "✅ Working" : "❌ Not configured"}`
  );
  console.log(
    `🤖 OpenAI: ${results.openai ? "✅ Working" : "❌ Not configured"}`
  );

  const workingApis = Object.values(results).filter(Boolean).length;
  console.log(`\n📈 Status: ${workingApis}/3 APIs configured`);

  if (workingApis === 3) {
    console.log(
      "🎉 All APIs are working! Agropal is ready for full functionality!"
    );
  } else {
    console.log("\n💡 Next steps:");
    if (!results.openweather)
      console.log("   - Get OpenWeatherMap API key (free)");
    if (!results.plantid)
      console.log("   - Get Plant.id API key (free tier available)");
    if (!results.openai)
      console.log(
        "   - Get OpenAI API key (paid, but essential for advanced features)"
      );
  }
}

runAllTests().catch(console.error);
