const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Notification = require("../models/Notification");

class SocketManager {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    this.connectedUsers = new Map();
    this.setupSocketAuthentication();
    this.setupSocketHandlers();
  }

  setupSocketAuthentication() {
    this.io.use(async (socket, next) => {
      try {
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.split(" ")[1];

        if (!token) {
          return next(new Error("Authentication error"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
          return next(new Error("User not found"));
        }

        socket.userId = user._id.toString();
        socket.userEmail = user.email;
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    });
  }

  setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.userEmail}`);

      // Store the connection
      this.connectedUsers.set(socket.userId, socket.id);

      // Join user to their personal room
      socket.join(`user_${socket.userId}`);

      // Handle joining community rooms
      socket.on("join_community", (communityId) => {
        socket.join(`community_${communityId}`);
        console.log(`User ${socket.userEmail} joined community ${communityId}`);
      });

      // Handle leaving community rooms
      socket.on("leave_community", (communityId) => {
        socket.leave(`community_${communityId}`);
        console.log(`User ${socket.userEmail} left community ${communityId}`);
      });

      // Handle new community posts
      socket.on("new_community_post", (data) => {
        socket
          .to(`community_${data.communityId}`)
          .emit("community_post_created", data);
      });

      // Handle private messages
      socket.on("private_message", async (data) => {
        const { recipientId, message } = data;
        const recipientSocketId = this.connectedUsers.get(recipientId);

        if (recipientSocketId) {
          this.io.to(recipientSocketId).emit("private_message_received", {
            senderId: socket.userId,
            senderEmail: socket.userEmail,
            message,
            timestamp: new Date(),
          });
        }

        // Create notification for offline user
        if (!recipientSocketId) {
          await this.createNotification(
            recipientId,
            "message",
            "New Message",
            `You have a new message from ${socket.userEmail}`,
            { senderId: socket.userId }
          );
        }
      });

      // Handle typing indicators
      socket.on("typing_start", (data) => {
        socket.to(data.roomId).emit("user_typing", {
          userId: socket.userId,
          userEmail: socket.userEmail,
        });
      });

      socket.on("typing_stop", (data) => {
        socket.to(data.roomId).emit("user_stopped_typing", {
          userId: socket.userId,
        });
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.userEmail}`);
        this.connectedUsers.delete(socket.userId);

        // Notify others in community rooms about user going offline
        socket.rooms.forEach((room) => {
          if (room.startsWith("community_")) {
            socket.to(room).emit("user_offline", {
              userId: socket.userId,
              userEmail: socket.userEmail,
            });
          }
        });
      });
    });
  }

  // Send notification to specific user
  async sendNotificationToUser(userId, notification) {
    const userSocketId = this.connectedUsers.get(userId.toString());

    if (userSocketId) {
      this.io.to(userSocketId).emit("notification_received", notification);
      return true;
    }

    return false;
  }

  // Send notification to all users in a community
  async sendNotificationToCommunity(communityId, notification) {
    this.io
      .to(`community_${communityId}`)
      .emit("community_notification", notification);
  }

  // Broadcast system-wide notifications
  async broadcastSystemNotification(notification) {
    this.io.emit("system_notification", notification);
  }

  // Send crop diagnosis result
  async sendCropDiagnosisResult(userId, diagnosisResult) {
    const userSocketId = this.connectedUsers.get(userId.toString());

    if (userSocketId) {
      this.io.to(userSocketId).emit("crop_diagnosis_result", diagnosisResult);
      return true;
    }

    return false;
  }

  // Send weather alerts
  async sendWeatherAlert(userId, weatherAlert) {
    const userSocketId = this.connectedUsers.get(userId.toString());

    if (userSocketId) {
      this.io.to(userSocketId).emit("weather_alert", weatherAlert);
      return true;
    }

    return false;
  }

  // Send market price updates
  async sendMarketPriceUpdate(userId, priceUpdate) {
    const userSocketId = this.connectedUsers.get(userId.toString());

    if (userSocketId) {
      this.io.to(userSocketId).emit("market_price_update", priceUpdate);
      return true;
    }

    return false;
  }

  // Create notification in database
  async createNotification(userId, type, title, message, data = {}) {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        message,
        data,
        createdAt: new Date(),
      });

      await notification.save();

      // Try to send real-time notification
      await this.sendNotificationToUser(userId, notification);

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get connected users list
  getConnectedUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId.toString());
  }

  // Send calendar reminders
  async sendCalendarReminder(userId, reminder) {
    const userSocketId = this.connectedUsers.get(userId.toString());

    if (userSocketId) {
      this.io.to(userSocketId).emit("calendar_reminder", reminder);
      return true;
    }

    return false;
  }

  // Send learning module completion
  async sendLearningProgress(userId, progress) {
    const userSocketId = this.connectedUsers.get(userId.toString());

    if (userSocketId) {
      this.io.to(userSocketId).emit("learning_progress", progress);
      return true;
    }

    return false;
  }
}

module.exports = SocketManager;
