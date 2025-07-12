import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  // Initialize socket connection
  connect(token: string) {
    this.token = token;

    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(
      process.env.REACT_APP_BACKEND_URL || "http://localhost:5001",
      {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    this.setupEventHandlers();
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Setup common event handlers
  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    this.socket.on("connect_error", (error: any) => {
      console.error("Connection error:", error);
    });

    this.socket.on("reconnect", () => {
      console.log("Reconnected to server");
    });

    this.socket.on("reconnect_error", (error: any) => {
      console.error("Reconnection error:", error);
    });
  }

  // Join a community room
  joinCommunity(communityId: string) {
    if (this.socket) {
      this.socket.emit("join_community", communityId);
    }
  }

  // Leave a community room
  leaveCommunity(communityId: string) {
    if (this.socket) {
      this.socket.emit("leave_community", communityId);
    }
  }

  // Send a private message
  sendPrivateMessage(recipientId: string, message: string) {
    if (this.socket) {
      this.socket.emit("private_message", {
        recipientId,
        message,
      });
    }
  }

  // Send typing indicator
  startTyping(roomId: string) {
    if (this.socket) {
      this.socket.emit("typing_start", { roomId });
    }
  }

  // Stop typing indicator
  stopTyping(roomId: string) {
    if (this.socket) {
      this.socket.emit("typing_stop", { roomId });
    }
  }

  // Listen for notifications
  onNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on("notification_received", callback);
    }
  }

  // Listen for community notifications
  onCommunityNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on("community_notification", callback);
    }
  }

  // Listen for system notifications
  onSystemNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on("system_notification", callback);
    }
  }

  // Listen for crop diagnosis results
  onCropDiagnosisResult(callback: (result: any) => void) {
    if (this.socket) {
      this.socket.on("crop_diagnosis_result", callback);
    }
  }

  // Listen for weather alerts
  onWeatherAlert(callback: (alert: any) => void) {
    if (this.socket) {
      this.socket.on("weather_alert", callback);
    }
  }

  // Listen for market price updates
  onMarketPriceUpdate(callback: (update: any) => void) {
    if (this.socket) {
      this.socket.on("market_price_update", callback);
    }
  }

  // Listen for calendar reminders
  onCalendarReminder(callback: (reminder: any) => void) {
    if (this.socket) {
      this.socket.on("calendar_reminder", callback);
    }
  }

  // Listen for learning progress updates
  onLearningProgress(callback: (progress: any) => void) {
    if (this.socket) {
      this.socket.on("learning_progress", callback);
    }
  }

  // Listen for community posts
  onCommunityPost(callback: (post: any) => void) {
    if (this.socket) {
      this.socket.on("community_post_created", callback);
    }
  }

  // Listen for private messages
  onPrivateMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on("private_message_received", callback);
    }
  }

  // Listen for typing indicators
  onUserTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("user_typing", callback);
    }
  }

  // Listen for stopped typing
  onUserStoppedTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("user_stopped_typing", callback);
    }
  }

  // Listen for user online status
  onUserOnline(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("user_online", callback);
    }
  }

  // Listen for user offline status
  onUserOffline(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("user_offline", callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Remove specific listener
  removeListener(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.removeAllListeners(event);
      }
    }
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket ? this.socket.connected : false;
  }

  // Get socket ID
  getSocketId(): string | null {
    return this.socket && typeof this.socket.id === "string"
      ? this.socket.id
      : null;
  }

  // Emit custom event
  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Listen for custom event
  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Listen for custom event once
  once(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.once(event, callback);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
