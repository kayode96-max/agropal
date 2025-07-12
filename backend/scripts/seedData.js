const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { LearningModule } = require("../models/LearningModule");
const CommunityPost = require("../models/CommunityPost");
const User = require("../models/User");
const { SeasonalCalendar } = require("../models/Weather");

// Nigerian agricultural sample data
const sampleUsers = [
  {
    name: "Adamu Ibrahim",
    email: "adamu.ibrahim@example.com",
    phone: "+2348123456789",
    password: "password123",
    role: "farmer",
    location: {
      state: "Kano",
      lga: "Kano Municipal",
      ward: "Fagge",
      village: "Sabon Gari",
      coordinates: {
        latitude: 12.0022,
        longitude: 8.592,
      },
    },
    profile: {
      farmSize: 5.5,
      primaryCrops: ["millet", "sorghum", "groundnut"],
      farmingExperience: 15,
      educationLevel: "primary",
      preferredLanguage: "ha",
      phoneType: "feature_phone",
      internetAccess: "poor",
    },
    isVerified: true,
  },
  {
    name: "Ngozi Okafor",
    email: "ngozi.okafor@example.com",
    phone: "+2348234567890",
    password: "password123",
    role: "farmer",
    location: {
      state: "Enugu",
      lga: "Nsukka",
      ward: "University",
      village: "Obukpa",
      coordinates: {
        latitude: 6.8567,
        longitude: 7.3958,
      },
    },
    profile: {
      farmSize: 3.2,
      primaryCrops: ["cassava", "yam", "maize", "plantain"],
      farmingExperience: 8,
      educationLevel: "secondary",
      preferredLanguage: "ig",
      phoneType: "smartphone",
      internetAccess: "good",
    },
    isVerified: true,
  },
  {
    name: "Fatima Aliyu",
    email: "fatima.aliyu@example.com",
    phone: "+2348345678901",
    password: "password123",
    role: "extension_worker",
    location: {
      state: "Kaduna",
      lga: "Kaduna North",
      ward: "Malali",
      village: "Barnawa",
      coordinates: {
        latitude: 10.5105,
        longitude: 7.4165,
      },
    },
    profile: {
      farmSize: 0,
      primaryCrops: [],
      farmingExperience: 12,
      educationLevel: "tertiary",
      preferredLanguage: "en",
      phoneType: "smartphone",
      internetAccess: "good",
    },
    isVerified: true,
  },
];

const sampleLearningModules = [
  {
    title: "Cassava Production in Nigeria",
    description:
      "Complete guide to cassava farming from planting to harvesting",
    category: "crop_production",
    targetCrops: ["cassava"],
    difficulty: "beginner",
    duration: 45,
    language: "en",
    content: {
      text: "Cassava is one of Nigeria's most important food crops...",
      images: ["/images/cassava-farming.jpg"],
      downloadableResources: [
        {
          title: "Cassava Farming Guide PDF",
          url: "/resources/cassava-guide.pdf",
          type: "pdf",
        },
      ],
    },
    quiz: {
      questions: [
        {
          question: "What is the best soil type for cassava cultivation?",
          options: [
            "Clay soil",
            "Sandy loam",
            "Waterlogged soil",
            "Rocky soil",
          ],
          correctAnswer: 1,
          explanation: "Sandy loam provides good drainage which cassava needs",
          language: "en",
        },
        {
          question: "How long does cassava take to mature?",
          options: ["6 months", "8-12 months", "18-24 months", "3 years"],
          correctAnswer: 2,
          explanation: "Cassava typically matures in 18-24 months",
          language: "en",
        },
      ],
      passingScore: 70,
    },
    regionalRelevance: {
      states: ["Ogun", "Ondo", "Cross River", "Akwa Ibom", "Enugu"],
      climateZones: ["forest", "derived_savanna"],
      soilTypes: ["sandy_loam", "loamy"],
    },
    learningObjectives: [
      "Understand cassava varieties suitable for Nigeria",
      "Learn proper planting techniques",
      "Identify common diseases and pests",
      "Master harvesting and storage methods",
    ],
    keyTopics: [
      "varieties",
      "land_preparation",
      "planting",
      "maintenance",
      "harvesting",
    ],
    isPublished: true,
    averageRating: 4.5,
    enrollments: 1250,
    completions: 890,
  },
  {
    title: "Maize Farming in Northern Nigeria",
    description:
      "Comprehensive guide to maize cultivation in the savanna regions",
    category: "crop_production",
    targetCrops: ["maize"],
    difficulty: "intermediate",
    duration: 60,
    language: "en",
    content: {
      text: "Maize is a vital cereal crop in northern Nigeria...",
      images: ["/images/maize-farming.jpg"],
    },
    quiz: {
      questions: [
        {
          question: "What is the ideal rainfall for maize in northern Nigeria?",
          options: ["200-400mm", "600-1000mm", "1200-1500mm", "1800-2000mm"],
          correctAnswer: 1,
          explanation: "Maize requires 600-1000mm of rainfall annually",
          language: "en",
        },
      ],
      passingScore: 70,
    },
    regionalRelevance: {
      states: ["Kano", "Kaduna", "Niger", "Sokoto", "Kebbi"],
      climateZones: ["sahel", "sudan_savanna", "guinea_savanna"],
      soilTypes: ["sandy", "clay_loam"],
    },
    learningObjectives: [
      "Select appropriate maize varieties for northern conditions",
      "Implement proper irrigation techniques",
      "Manage pests and diseases common in the north",
    ],
    keyTopics: ["varieties", "irrigation", "pest_management", "fertilization"],
    isPublished: true,
    averageRating: 4.2,
    enrollments: 980,
    completions: 720,
  },
];

const sampleCommunityPosts = [
  {
    title: "My cassava plants are showing yellow leaves - need help!",
    content:
      "I planted cassava 8 months ago in Ogun state. Now the leaves are turning yellow and some are falling off. Is this normal or a disease? The rains have been irregular this season.",
    category: "crop_disease",
    cropType: "cassava",
    location: {
      state: "Ogun",
      lga: "Abeokuta South",
      region: "south_west",
    },
    tags: ["cassava", "yellow_leaves", "disease", "rainy_season"],
    language: "en",
    votes: {
      upvotes: [],
      downvotes: [],
      total: 0,
    },
    replies: [
      {
        content:
          "This could be cassava mosaic disease. Check if the leaves have mosaic patterns. You should remove affected plants to prevent spread.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        votes: {
          upvotes: [],
          total: 0,
        },
        aiTag: "helpful",
        language: "en",
      },
    ],
    aiModeration: {
      status: "approved",
      confidence: 0.9,
      flags: [],
      reviewedAt: new Date(),
      reviewedBy: "ai_moderator_v1",
    },
    visibility: "public",
    views: 45,
  },
  {
    title: "Best time to plant yam in Enugu state?",
    content:
      "When is the optimal time to plant yam in Enugu? I want to maximize my yield this season. Also, which variety gives the best results here?",
    category: "crop_production",
    cropType: "yam",
    location: {
      state: "Enugu",
      lga: "Nsukka",
      region: "south_east",
    },
    tags: ["yam", "planting_time", "varieties", "enugu"],
    language: "en",
    votes: {
      upvotes: [],
      downvotes: [],
      total: 0,
    },
    replies: [],
    aiModeration: {
      status: "approved",
      confidence: 0.95,
      flags: [],
      reviewedAt: new Date(),
      reviewedBy: "ai_moderator_v1",
    },
    visibility: "public",
    views: 23,
  },
];

const seasonalCalendarData = [
  {
    state: "Kano",
    month: 5, // May
    activities: [
      {
        crop: "millet",
        activity: "planting",
        timing: "early month",
        priority: "high",
        description: "Plant millet after first rains",
        tips: [
          "Ensure soil moisture",
          "Use certified seeds",
          "Apply basal fertilizer",
        ],
      },
      {
        crop: "sorghum",
        activity: "planting",
        timing: "mid month",
        priority: "high",
        description: "Plant sorghum varieties suitable for sahel",
        tips: ["Select drought-resistant varieties", "Maintain proper spacing"],
      },
    ],
    weatherPattern: {
      expectedRainfall: 120,
      temperatureRange: { min: 23, max: 38 },
      humidity: 45,
      commonConditions: ["hot", "beginning_of_rains"],
    },
  },
  {
    state: "Ogun",
    month: 3, // March
    activities: [
      {
        crop: "cassava",
        activity: "planting",
        timing: "late month",
        priority: "high",
        description: "Plant cassava stems before peak rains",
        tips: [
          "Select healthy stems",
          "Plant at 45-degree angle",
          "Ensure good drainage",
        ],
      },
      {
        crop: "maize",
        activity: "land_preparation",
        timing: "early month",
        priority: "medium",
        description: "Clear and prepare land for maize planting",
        tips: ["Remove weeds", "Till soil properly", "Apply organic matter"],
      },
    ],
    weatherPattern: {
      expectedRainfall: 180,
      temperatureRange: { min: 24, max: 32 },
      humidity: 65,
      commonConditions: ["moderate_rains", "humid"],
    },
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await User.deleteMany({});
    await LearningModule.deleteMany({});
    await CommunityPost.deleteMany({});
    await SeasonalCalendar.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12),
      }))
    );

    // Create users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Assign random authors to learning modules
    const modulesWithAuthors = sampleLearningModules.map((module) => ({
      ...module,
      author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
    }));

    // Create learning modules
    const createdModules = await LearningModule.insertMany(modulesWithAuthors);
    console.log(`📚 Created ${createdModules.length} learning modules`);

    // Assign random authors to community posts
    const postsWithAuthors = sampleCommunityPosts.map((post) => ({
      ...post,
      author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
      replies: post.replies.map((reply) => ({
        ...reply,
        author:
          createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
      })),
    }));

    // Create community posts
    const createdPosts = await CommunityPost.insertMany(postsWithAuthors);
    console.log(`💬 Created ${createdPosts.length} community posts`);

    // Create seasonal calendar data
    const createdCalendar = await SeasonalCalendar.insertMany(
      seasonalCalendarData
    );
    console.log(
      `📅 Created ${createdCalendar.length} seasonal calendar entries`
    );

    console.log("✅ Database seeding completed successfully!");
    console.log("🇳🇬 Nigerian agricultural platform is ready!");

    return {
      users: createdUsers.length,
      modules: createdModules.length,
      posts: createdPosts.length,
      calendar: createdCalendar.length,
    };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

module.exports = seedDatabase;
