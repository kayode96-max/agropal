const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const http = require("http");

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require("./config/database");
const SocketManager = require("./utils/socketManager");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize Socket Manager
const socketManager = new SocketManager(server);

// Make socket manager available globally
global.socketManager = socketManager;

// Security middleware
app.use(helmet());

// Rate limiting - More lenient for rural areas with poor connectivity
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200, // Increased for rural users
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" })); // Increased for image uploads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("combined"));

// Serve static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/crops", require("./routes/crops"));
app.use("/api/community", require("./routes/community"));
app.use("/api/weather", require("./routes/weather_nigeria"));
app.use("/api/learning", require("./routes/learning_nigeria"));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/users", require("./routes/users"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/market", require("./routes/market"));
app.use("/api/calendar", require("./routes/calendar"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Agropal backend is running - Supporting Nigerian farmers! 🇳🇬🌾",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    database: "Connected",
    features: [
      "AI Crop Disease Diagnosis",
      "Community Discussion Board",
      "E-Learning Modules",
      "Weather Dashboard",
      "Voice-to-Text Support",
      "Multilingual Support (EN, HA, IG, YO)",
    ],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server - using server.listen for Socket.IO support
server.listen(PORT, () => {
  console.log(`🌱 Agropal backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🇳🇬 Supporting Nigerian farmers with AI-powered agriculture`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔌 Socket.IO server initialized for real-time features`);
});

module.exports = app;
