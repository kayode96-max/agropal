const express = require("express");
const CommunityPost = require("../models/CommunityPost");
const User = require("../models/User");
const {
  getStateInfo,
  getAllStates,
  getStateCrops,
} = require("../utils/nigerianAgricultureData");
const router = express.Router();

// Simple auth middleware (replace with proper JWT auth)
const authenticateUser = async (req, res, next) => {
  try {
    // For now, create a mock user if none exists
    const userId = req.headers["user-id"] || "mock-user-id";
    req.user = {
      id: userId,
      name: "Nigerian Farmer",
      role: "farmer",
      location: { state: "Lagos", zone: "south_west" },
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Authentication required" });
  }
};

// AI content moderation for Nigerian agricultural context
function moderateContent(content, category = "general") {
  const contentLower = content.toLowerCase();

  // Nigerian agricultural keywords
  const agriculturalTerms = [
    "cassava",
    "yam",
    "maize",
    "rice",
    "plantain",
    "cocoa",
    "palm oil",
    "fertilizer",
    "farming",
    "harvest",
    "planting",
    "irrigation",
    "pest",
  ];

  const helpfulIndicators = [
    "organic",
    "natural",
    "sustainable",
    "experience",
    "works well",
    "tried and tested",
    "local variety",
    "extension office",
  ];

  const flaggedTerms = [
    "guaranteed profit",
    "get rich quick",
    "miracle cure",
    "buy now",
    "dangerous chemical",
    "illegal",
  ];

  let flags = [];
  let confidence = 0.7;
  let status = "approved";
  let aiTag = "none";

  // Check for agricultural relevance
  const hasAgricultureTerms = agriculturalTerms.some((term) =>
    contentLower.includes(term)
  );

  // Check for helpful content
  const isHelpful = helpfulIndicators.some((term) =>
    contentLower.includes(term)
  );

  // Check for flagged content
  const isFlagged = flaggedTerms.some((term) => contentLower.includes(term));

  if (isFlagged) {
    status = "flagged";
    aiTag = "needs_verification";
    flags.push("potentially_harmful");
    confidence = 0.9;
  } else if (hasAgricultureTerms && isHelpful && content.length > 30) {
    aiTag = "verified";
    confidence = 0.85;
  } else if (hasAgricultureTerms) {
    aiTag = "helpful";
    confidence = 0.75;
  }

  return {
    status,
    confidence,
    flags,
    aiTag,
    reviewedAt: new Date(),
    reviewedBy: "Agropal AI Moderator",
  };
}

// GET /api/community/posts - Get community posts with Nigerian context
router.get("/posts", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      state,
      cropType,
      language = "en",
      sortBy = "recent", // recent, popular, votes
    } = req.query;

    // For now, return mock data until MongoDB is properly connected
    const mockPosts = [
      {
        id: 1,
        title: "Best cassava varieties for Lagos State",
        content:
          "I want to plant cassava in Lagos. Which varieties work best for our soil and climate?",
        author: "Adebayo Farmer",
        location: "Ikorodu, Lagos",
        createdAt: "2025-01-10T10:00:00Z",
        votes: 15,
        replies: [
          {
            id: 1,
            content:
              "TME 419 is very good for Lagos. Disease resistant and high yielding.",
            author: "Extension Officer",
            createdAt: "2025-01-10T11:00:00Z",
            votes: 12,
            aiTag: "verified",
          },
          {
            id: 2,
            content:
              "I grow TMS 98/0505 in Epe area. Very good yield after 12 months.",
            author: "Mama Kudi",
            createdAt: "2025-01-10T12:00:00Z",
            votes: 8,
            aiTag: "helpful",
          },
        ],
        tags: ["cassava", "varieties", "lagos", "planting"],
        category: "seeds",
        cropType: "cassava",
        aiModeration: {
          status: "approved",
          confidence: 0.95,
        },
      },
      {
        id: 2,
        title: "Yam anthracnose treatment using local methods",
        content:
          "My yam plants have dark spots on leaves. Looking for organic treatment options.",
        author: "Chike Okoro",
        location: "Nsukka, Enugu",
        createdAt: "2025-01-09T14:30:00Z",
        votes: 22,
        replies: [
          {
            id: 3,
            content:
              "Mix neem leaves with wood ash. Spray early morning. Very effective.",
            author: "Nkem",
            createdAt: "2025-01-09T15:00:00Z",
            votes: 18,
            aiTag: "verified",
          },
          {
            id: 4,
            content:
              "Also improve drainage around the plants. Remove infected leaves immediately.",
            author: "ADP Officer Enugu",
            createdAt: "2025-01-09T16:00:00Z",
            votes: 14,
            aiTag: "verified",
          },
        ],
        tags: ["yam", "disease", "organic", "anthracnose"],
        category: "crop_disease",
        cropType: "yam",
        aiModeration: {
          status: "approved",
          confidence: 0.92,
        },
      },
      {
        id: 3,
        title: "Maize planting calendar for Northern Nigeria",
        content:
          "When is the best time to plant maize in Kaduna State? First rains or wait longer?",
        author: "Musa Ibrahim",
        location: "Zaria, Kaduna",
        createdAt: "2025-01-08T09:00:00Z",
        votes: 19,
        replies: [
          {
            id: 5,
            content:
              "Wait for steady rains in May. Too early planting can cause crop failure.",
            author: "Mallam Sani",
            createdAt: "2025-01-08T10:00:00Z",
            votes: 16,
            aiTag: "verified",
          },
        ],
        tags: ["maize", "planting", "kaduna", "timing", "northern"],
        category: "crop_production",
        cropType: "maize",
        aiModeration: {
          status: "approved",
          confidence: 0.88,
        },
      },
    ];

    // Filter posts based on query parameters
    let filteredPosts = mockPosts;

    if (search) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    if (category) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === category
      );
    }

    if (state) {
      filteredPosts = filteredPosts.filter((post) =>
        post.location.toLowerCase().includes(state.toLowerCase())
      );
    }

    if (cropType) {
      filteredPosts = filteredPosts.filter(
        (post) => post.cropType === cropType
      );
    }

    // Sort posts
    switch (sortBy) {
      case "popular":
        filteredPosts.sort(
          (a, b) =>
            b.votes + b.replies.length * 2 - (a.votes + a.replies.length * 2)
        );
        break;
      case "votes":
        filteredPosts.sort((a, b) => b.votes - a.votes);
        break;
      default:
        filteredPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    res.json({
      success: true,
      posts: paginatedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalItems: filteredPosts.length,
        itemsPerPage: parseInt(limit),
      },
      filters: { category, state, cropType, language, search, sortBy },
    });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch community posts",
    });
  }
});

// POST /api/community/posts - Create new post
router.post("/posts", authenticateUser, async (req, res) => {
  try {
    const {
      title,
      content,
      category = "general",
      cropType,
      location,
      tags,
      language = "en",
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required",
      });
    }

    // AI moderation
    const moderation = moderateContent(content, category);

    // Mock creating a new post
    const newPost = {
      id: Date.now(), // Mock ID
      title: title.trim(),
      content: content.trim(),
      author: req.user.name,
      location: location || "Nigeria",
      category,
      cropType,
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? tags.split(",").map((t) => t.trim())
        : [],
      language,
      votes: 0,
      replies: [],
      createdAt: new Date().toISOString(),
      aiModeration: moderation,
    };

    res.status(201).json({
      success: true,
      message:
        moderation.status === "approved"
          ? "Post created and published successfully"
          : "Post created and is under review",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create post",
    });
  }
});

// POST /api/community/posts/:id/reply - Add reply to post
router.post("/posts/:id/reply", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, language = "en" } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Reply content is required",
      });
    }

    // AI moderation for reply
    const moderation = moderateContent(content);

    const newReply = {
      id: Date.now(),
      content: content.trim(),
      author: req.user.name,
      createdAt: new Date().toISOString(),
      votes: 0,
      aiTag: moderation.aiTag,
      language,
    };

    res.json({
      success: true,
      message: "Reply added successfully",
      reply: newReply,
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add reply",
    });
  }
});

// POST /api/community/posts/:id/vote - Vote on post
router.post("/posts/:id/vote", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'up' or 'down'

    if (!["up", "down"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Vote type must be 'up' or 'down'",
      });
    }

    // Mock vote counting
    const voteChange = type === "up" ? 1 : -1;
    const newVoteCount = Math.max(0, 15 + voteChange); // Mock current votes

    res.json({
      success: true,
      votes: newVoteCount,
      userVote: type,
    });
  } catch (error) {
    console.error("Error voting on post:", error);
    res.status(500).json({
      success: false,
      error: "Failed to vote on post",
    });
  }
});

// GET /api/community/categories - Get post categories relevant to Nigerian agriculture
router.get("/categories", (req, res) => {
  const categories = [
    {
      id: "crop_disease",
      name: "Crop Diseases",
      description: "Disease identification and treatment",
      icon: "🦠",
    },
    {
      id: "pest_control",
      name: "Pest Control",
      description: "Pest management strategies",
      icon: "🐛",
    },
    {
      id: "soil_management",
      name: "Soil Management",
      description: "Soil health and fertility",
      icon: "🌱",
    },
    {
      id: "irrigation",
      name: "Irrigation & Water",
      description: "Water management techniques",
      icon: "💧",
    },
    {
      id: "fertilizers",
      name: "Fertilizers",
      description: "Organic and chemical fertilizers",
      icon: "🧪",
    },
    {
      id: "seeds",
      name: "Seeds & Varieties",
      description: "Seed selection and varieties",
      icon: "🌾",
    },
    {
      id: "harvesting",
      name: "Harvesting",
      description: "Harvest timing and techniques",
      icon: "🚜",
    },
    {
      id: "storage",
      name: "Storage",
      description: "Post-harvest storage methods",
      icon: "🏪",
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Selling and market prices",
      icon: "💰",
    },
    {
      id: "weather",
      name: "Weather & Climate",
      description: "Weather patterns and climate",
      icon: "🌤️",
    },
    {
      id: "government_programs",
      name: "Government Programs",
      description: "Agricultural policies and support",
      icon: "🏛️",
    },
    {
      id: "financing",
      name: "Financing",
      description: "Loans and agricultural financing",
      icon: "🏦",
    },
    {
      id: "machinery",
      name: "Machinery & Tools",
      description: "Farm equipment and tools",
      icon: "⚙️",
    },
    {
      id: "organic_farming",
      name: "Organic Farming",
      description: "Sustainable farming practices",
      icon: "🌿",
    },
    {
      id: "livestock",
      name: "Livestock",
      description: "Animal husbandry",
      icon: "🐄",
    },
    {
      id: "success_story",
      name: "Success Stories",
      description: "Inspiring farming success stories",
      icon: "🏆",
    },
  ];

  res.json({
    success: true,
    categories,
  });
});

// GET /api/community/states - Get Nigerian states for location filter
router.get("/states", (req, res) => {
  const states = getAllStates().map((state) => ({
    code: state,
    name: state,
    zone: getStateInfo(state)?.zone,
    crops: getStateCrops(state),
  }));

  res.json({
    success: true,
    states,
  });
});

// GET /api/community/trending - Get trending topics
router.get("/trending", (req, res) => {
  const trending = [
    { tag: "cassava", count: 45, growth: "+15%" },
    { tag: "yam disease", count: 32, growth: "+8%" },
    { tag: "fertilizer prices", count: 28, growth: "+22%" },
    { tag: "maize varieties", count: 24, growth: "+5%" },
    { tag: "organic farming", count: 19, growth: "+12%" },
  ];

  res.json({
    success: true,
    trending,
  });
});

module.exports = router;
