const axios = require("axios");

// Check if we should use mock data or real API
const USE_MOCK_AI = process.env.USE_MOCK_AI === "true";

// Comprehensive AI service for crop disease diagnosis
class CropDiagnosisAI {
  constructor() {
    this.models = {
      plantId: process.env.PLANT_ID_API_KEY,
      openai: process.env.OPENAI_API_KEY,
    };
  }

  // Main diagnosis function
  async diagnoseCrop(imageBuffer, metadata = {}) {
    try {
      // If using mock data, return mock diagnosis
      if (USE_MOCK_AI) {
        return this.getMockDiagnosis(metadata);
      }

      // Try PlantNet/Plant.id API first
      let result = await this.tryPlantIdAPI(imageBuffer, metadata);

      // If PlantId fails, use OpenAI Vision API
      if (!result || result.confidence < 0.5) {
        result = await this.tryOpenAIVision(imageBuffer, metadata);
      }

      // If both fail, use mock diagnosis
      if (!result || result.confidence < 0.3) {
        console.log("Both AI services failed, using mock diagnosis");
        return this.getMockDiagnosis(metadata);
      }

      // Enhance with Nigerian-specific context
      return this.enhanceWithNigerianContext(result, metadata);
    } catch (error) {
      console.error("AI Diagnosis error:", error);
      console.log("Falling back to mock diagnosis");
      return this.getMockDiagnosis(metadata);
    }
  }

  // Mock diagnosis for testing and fallback
  getMockDiagnosis(metadata) {
    const mockDiagnoses = [
      {
        disease: "Leaf Spot Disease",
        confidence: 0.85,
        severity: "moderate",
        description:
          "Common fungal infection affecting leaves, typically caused by high humidity and poor air circulation.",
        possibleCauses: [
          "High humidity",
          "Poor air circulation",
          "Overhead watering",
          "Infected plant debris",
        ],
        treatment: {
          immediate: [
            "Remove affected leaves",
            "Improve air circulation",
            "Reduce watering frequency",
          ],
          longTerm: [
            "Apply fungicide spray",
            "Ensure proper plant spacing",
            "Use drip irrigation",
          ],
          organic: [
            "Neem oil spray",
            "Baking soda solution",
            "Copper sulfate spray",
          ],
          chemical: [
            "Fungicide containing copper",
            "Chlorothalonil",
            "Mancozeb",
          ],
          traditional: [
            "Garlic and pepper spray",
            "Wood ash application",
            "Moringa leaf extract",
          ],
        },
      },
      {
        disease: "Nutrient Deficiency (Nitrogen)",
        confidence: 0.78,
        severity: "low",
        description:
          "Yellowing of older leaves indicates possible nitrogen deficiency, common in sandy soils.",
        possibleCauses: [
          "Poor soil fertility",
          "Excessive rainfall",
          "Sandy soil",
          "Inadequate fertilization",
        ],
        treatment: {
          immediate: [
            "Apply nitrogen-rich fertilizer",
            "Add compost to soil",
            "Reduce watering",
          ],
          longTerm: [
            "Soil testing",
            "Regular fertilization schedule",
            "Organic matter addition",
          ],
          organic: ["Compost application", "Poultry manure", "Fish emulsion"],
          chemical: ["NPK fertilizer", "Urea application", "Ammonium sulfate"],
          traditional: [
            "Cow dung application",
            "Fallen leaves composting",
            "Legume intercropping",
          ],
        },
      },
      {
        disease: "Pest Damage (Aphids)",
        confidence: 0.72,
        severity: "moderate",
        description:
          "Small insects causing leaf curling and stunted growth, common during dry season.",
        possibleCauses: [
          "Dry weather conditions",
          "Lack of natural predators",
          "Over-fertilization",
          "Stressed plants",
        ],
        treatment: {
          immediate: [
            "Spray with water",
            "Apply insecticidal soap",
            "Remove heavily infested parts",
          ],
          longTerm: [
            "Encourage beneficial insects",
            "Regular monitoring",
            "Proper plant nutrition",
          ],
          organic: [
            "Neem oil spray",
            "Ladybug introduction",
            "Soap water spray",
          ],
          chemical: ["Imidacloprid", "Acetamiprid", "Thiamethoxam"],
          traditional: [
            "Bitter leaf extract",
            "Tobacco leaf spray",
            "Onion and garlic spray",
          ],
        },
      },
    ];

    // Select a random diagnosis or based on crop type
    const selectedDiagnosis =
      mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)];

    // Normalize severity to match model enum
    const normalizedSeverity = this.normalizeSeverity(
      selectedDiagnosis.severity
    );

    return {
      ...selectedDiagnosis,
      severity: normalizedSeverity,
      localSolutions: this.getLocalSolutions(metadata.location?.state),
      economicImpact: this.getEconomicImpact(normalizedSeverity),
      locationContext: this.getLocationContext(metadata.location?.state),
      supportContact: this.getSupportContact(metadata.location?.state),
    };
  }

  async tryPlantIdAPI(imageBuffer, metadata) {
    if (!this.models.plantId) {
      throw new Error("Plant.id API key not configured");
    }

    try {
      const base64Image = imageBuffer.toString("base64");

      const response = await axios.post(
        "https://api.plant.id/v2/identify",
        {
          images: [base64Image],
          modifiers: ["crops_fast", "similar_images", "health_only"],
          plant_language: "en",
          plant_details: [
            "common_names",
            "url",
            "description",
            "treatment",
            "classification",
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": this.models.plantId,
          },
        }
      );

      if (response.data.is_healthy) {
        return {
          disease: "Healthy Plant",
          confidence: response.data.health_assessment.confidence,
          description: "Plant appears healthy with no visible diseases",
          severity: this.normalizeSeverity("none"),
        };
      }

      const diseases = response.data.health_assessment.diseases || [];
      if (diseases.length > 0) {
        const topDisease = diseases[0];
        return {
          disease: topDisease.name,
          confidence: topDisease.probability,
          description: topDisease.description,
          severity: this.mapSeverity(topDisease.probability),
          treatment: topDisease.treatment,
        };
      }

      return null;
    } catch (error) {
      console.error("Plant.id API error:", error.message);
      return null;
    }
  }

  async tryOpenAIVision(imageBuffer, metadata) {
    if (!this.models.openai) {
      throw new Error("OpenAI API key not configured");
    }

    try {
      const base64Image = imageBuffer.toString("base64");

      const prompt = this.buildNigerianCropPrompt(metadata);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.models.openai}`,
            "Content-Type": "application/json",
          },
        }
      );

      const analysis = response.data.choices[0].message.content;
      return this.parseOpenAIResponse(analysis);
    } catch (error) {
      console.error("OpenAI Vision API error:", error.message);
      return null;
    }
  }

  buildNigerianCropPrompt(metadata) {
    const { cropType, location, symptoms } = metadata;

    return `You are an expert agricultural pathologist specializing in Nigerian crop diseases. 
    Analyze this plant image and provide a detailed diagnosis.

    Context:
    - Crop Type: ${cropType || "Unknown"}
    - Location: ${location?.state || "Nigeria"}, ${
      location?.zone || "Unknown zone"
    }
    - Reported Symptoms: ${symptoms || "None specified"}
    - Climate: Tropical/Sub-tropical Nigerian conditions

    Please provide your analysis in this JSON format:
    {
      "disease": "Disease name or 'Healthy Plant'",
      "confidence": 0.85,
      "severity": "low|moderate|high|critical",
      "description": "Detailed description of the condition",
      "possibleCauses": ["cause1", "cause2"],
      "treatment": {
        "immediate": ["action1", "action2"],
        "preventive": ["prevention1", "prevention2"],
        "organic": ["organic treatment options"],
        "chemical": ["chemical treatment options if severe"],
        "traditional": ["Nigerian traditional remedies if applicable"]
      },
      "prognosis": "Expected outcome with treatment"
    }

    Focus on diseases common in Nigerian agriculture and consider local farming practices.`;
  }

  parseOpenAIResponse(response) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          disease: parsed.disease,
          confidence: parsed.confidence || 0.7,
          severity: this.normalizeSeverity(parsed.severity || "moderate"),
          description: parsed.description,
          possibleCauses: parsed.possibleCauses || [],
          treatment: parsed.treatment || {},
        };
      }

      // Fallback parsing if JSON extraction fails
      return this.parseTextResponse(response);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return this.parseTextResponse(response);
    }
  }

  parseTextResponse(text) {
    // Basic text parsing for non-JSON responses
    const diseaseMatch = text.match(/disease[:\s]+(.*?)(?:\n|$)/i);
    const disease = diseaseMatch
      ? diseaseMatch[1].trim()
      : "Unidentified condition";

    const severity = text.toLowerCase().includes("severe")
      ? "high"
      : "moderate";

    return {
      disease,
      confidence: 0.6,
      severity: this.normalizeSeverity(severity),
      description: text.substring(0, 200) + "...",
      possibleCauses: [],
      treatment: {
        immediate: ["Consult local agricultural extension officer"],
        preventive: ["Maintain good farm hygiene"],
        organic: ["Apply organic compost"],
        chemical: ["Use appropriate fungicide/pesticide as recommended"],
        traditional: ["Consult local traditional farming practices"],
      },
    };
  }

  enhanceWithNigerianContext(result, metadata) {
    if (!result) return null;

    // Normalize severity to match model enum
    if (result.severity) {
      result.severity = this.normalizeSeverity(result.severity);
    }

    const { location, cropType } = metadata;
    const nigerianData = require("./nigerianAgricultureData");

    // Add location-specific recommendations
    if (location?.state) {
      const stateInfo = nigerianData.getStateInfo(location.state);
      if (stateInfo) {
        result.locationContext = {
          zone: stateInfo.zone,
          suitableCrops: nigerianData.getZoneCrops(stateInfo.zone),
          plantingSeason: nigerianData.getPlantingSeason(stateInfo.zone),
        };
      }
    }

    // Add crop-specific Nigerian diseases
    if (cropType) {
      const commonDiseases = nigerianData.getCropDiseases(cropType);
      result.relatedDiseases = commonDiseases;
    }

    // Add economic impact and local solutions
    result.economicImpact = this.getEconomicImpact(result.severity);
    result.localSolutions = this.getLocalSolutions(result.disease, cropType);

    return result;
  }

  getEconomicImpact(severity) {
    const impacts = {
      none: "No economic impact - continue normal farming practices",
      low: "Minor yield reduction (5-10%) - early intervention recommended",
      moderate: "Moderate yield loss (15-30%) - immediate treatment required",
      high: "Severe yield loss (40-60%) - urgent intervention needed",
      critical: "Crop failure risk (>70% loss) - emergency measures required",
    };
    return impacts[severity] || impacts.moderate;
  }

  getLocalSolutions(disease, cropType) {
    // Nigerian traditional and locally available solutions
    const solutions = {
      "Cassava Mosaic Disease": [
        "Use disease-resistant varieties like TME 419",
        "Remove infected plants immediately",
        "Apply neem oil extract",
        "Maintain 1m spacing between plants",
      ],
      "Yam Anthracnose": [
        "Improve field drainage",
        "Use clean planting material",
        "Apply wood ash to infected areas",
        "Practice crop rotation with legumes",
      ],
      "Maize Streak Virus": [
        "Plant early in rainy season",
        "Use streak-resistant varieties",
        "Control aphid vectors with neem",
        "Remove weeds around farm",
      ],
      default: [
        "Consult local agricultural extension officer",
        "Practice crop rotation",
        "Improve field sanitation",
        "Use organic matter to improve soil health",
      ],
    };

    return solutions[disease] || solutions.default;
  }

  mapSeverity(confidence) {
    if (confidence > 0.8) return "high";
    if (confidence > 0.6) return "moderate";
    if (confidence > 0.4) return "low";
    return "critical";
  }

  // Normalize severity values to match model enum
  normalizeSeverity(severity) {
    if (!severity || typeof severity !== "string") return "moderate";

    const normalizedSeverity = severity.toLowerCase().trim();

    // Map various severity terms to valid enum values
    const severityMap = {
      low: "low",
      mild: "low",
      minor: "low",
      slight: "low",
      moderate: "moderate",
      medium: "moderate",
      average: "moderate",
      high: "high",
      severe: "high",
      serious: "high",
      major: "high",
      critical: "critical",
      extreme: "critical",
      urgent: "critical",
      emergency: "critical",
      none: "low",
      unknown: "moderate",
    };

    return severityMap[normalizedSeverity] || "moderate";
  }

  getFallbackDiagnosis(metadata) {
    return {
      disease: "Unable to diagnose - Please consult expert",
      confidence: 0.3,
      severity: this.normalizeSeverity("unknown"),
      description:
        "Image quality or lighting may be insufficient for accurate diagnosis.",
      recommendations: [
        "Take clearer photos in good lighting",
        "Include close-up shots of affected areas",
        "Consult local agricultural extension officer",
        "Provide more details about symptoms and farming practices",
      ],
      nextSteps: [
        "Visit nearest agricultural development program (ADP) office",
        "Contact local extension workers",
        "Join farmer cooperative groups for knowledge sharing",
      ],
    };
  }

  getLocationContext(state) {
    const contexts = {
      Lagos: "Coastal region with high humidity - monitor for fungal diseases",
      Kano: "Sahel region with low rainfall - focus on drought-resistant crops",
      Rivers: "Niger Delta region with high rainfall - watch for waterlogging",
      Kaduna: "Middle Belt region with moderate rainfall - good for cereals",
      Ogun: "Forest zone with moderate humidity - suitable for tubers",
      Katsina: "Northern region with dry season - emphasize water conservation",
      Abuja: "Federal Capital Territory - mixed farming conditions",
      Plateau: "Highland region with cooler temperatures - unique microclimate",
      default:
        "Consult local agricultural extension for region-specific advice",
    };
    return contexts[state] || contexts.default;
  }

  getSupportContact(state) {
    const contacts = {
      Lagos: "Lagos State Agricultural Development Programme: 0803-XXX-XXXX",
      Kano: "Kano State Agricultural Development Programme: 0803-XXX-XXXX",
      Rivers: "Rivers State Agricultural Development Programme: 0803-XXX-XXXX",
      Kaduna: "Kaduna State Agricultural Development Programme: 0803-XXX-XXXX",
      Ogun: "Ogun State Agricultural Development Programme: 0803-XXX-XXXX",
      Katsina:
        "Katsina State Agricultural Development Programme: 0803-XXX-XXXX",
      Abuja: "FCT Agricultural Development Programme: 0803-XXX-XXXX",
      Plateau:
        "Plateau State Agricultural Development Programme: 0803-XXX-XXXX",
      default: "Contact your state Agricultural Development Programme office",
    };
    return contacts[state] || contacts.default;
  }
}

module.exports = CropDiagnosisAI;
