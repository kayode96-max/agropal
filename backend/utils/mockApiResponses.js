// Mock API responses for testing without real API keys
const mockWeatherData = {
  lagos: {
    weather: [{ description: "partly cloudy", main: "Clouds" }],
    main: { temp: 28, humidity: 75 },
    wind: { speed: 3.5 },
    name: "Lagos",
  },
  kano: {
    weather: [{ description: "sunny", main: "Clear" }],
    main: { temp: 35, humidity: 45 },
    wind: { speed: 2.1 },
    name: "Kano",
  },
};

const mockPlantDiagnosis = {
  disease: "Cassava Mosaic Disease",
  confidence: 0.87,
  severity: "high",
  description:
    "Viral disease causing yellow mottling on leaves and reduced plant vigor",
  treatment: {
    immediate: ["Remove infected plants", "Apply neem oil spray"],
    preventive: ["Use resistant varieties", "Control whitefly vectors"],
    organic: ["Neem oil treatment", "Companion planting"],
  },
};

const mockOpenAIResponse = {
  choices: [
    {
      message: {
        content:
          "Based on the image analysis, this appears to be a cassava plant showing symptoms of mosaic disease. I recommend immediate treatment with organic methods suitable for Nigerian farmers.",
      },
    },
  ],
};

module.exports = {
  mockWeatherData,
  mockPlantDiagnosis,
  mockOpenAIResponse,
};
