import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Button,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Send,
  MoreVert,
  Person,
  Settings,
  Mic,
  MicOff,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

interface ChatMessage {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    location?: string;
    isOnline?: boolean;
  };
  timestamp: string;
  type: "text" | "image" | "voice" | "system";
  attachments?: string[];
  reactions?: { [emoji: string]: string[] }; // emoji -> user ids
  isEdited?: boolean;
  replyTo?: string;
  metadata?: {
    cropType?: string;
    category?: string;
    location?: string;
    aiTag?: string;
  };
}

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  location?: string;
  isTyping?: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  isActive: boolean;
}

// Nigerian chat rooms
const defaultRooms: ChatRoom[] = [
  {
    id: "general",
    name: "General Chat",
    description: "General farming discussions",
    icon: "💬",
    memberCount: 247,
    isActive: true,
  },
  {
    id: "cassava",
    name: "Cassava Farmers",
    description: "Cassava growing tips and issues",
    icon: "🍠",
    memberCount: 156,
    isActive: true,
  },
  {
    id: "rice",
    name: "Rice Farmers",
    description: "Rice cultivation and processing",
    icon: "🌾",
    memberCount: 98,
    isActive: true,
  },
  {
    id: "market",
    name: "Market Prices",
    description: "Current market prices and trends",
    icon: "💰",
    memberCount: 203,
    isActive: true,
  },
  {
    id: "weather",
    name: "Weather Updates",
    description: "Weather alerts and farming advice",
    icon: "🌦️",
    memberCount: 187,
    isActive: true,
  },
  {
    id: "help",
    name: "Help & Support",
    description: "Get help with farming issues",
    icon: "❓",
    memberCount: 134,
    isActive: true,
  },
];

const Community: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers] = useState<string[]>([]); // Removed setTypingUsers as it's not used
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Language options
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ha", name: "Hausa", flag: "🇳🇬" },
    { code: "ig", name: "Igbo", flag: "🇳🇬" },
    { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  ];

  // Initialize rooms and join general chat
  useEffect(() => {
    setRooms(defaultRooms);
    setCurrentRoom(defaultRooms[0]);

    // Mock online users for demonstration
    setOnlineUsers([
      { id: "1", name: "Adamu Ibrahim", location: "Kano" },
      { id: "2", name: "Ngozi Okafor", location: "Enugu" },
      { id: "3", name: "Fatima Aliyu", location: "Sokoto" },
      { id: "4", name: "Chike Okonkwo", location: "Anambra" },
      { id: "5", name: "Hauwa Bello", location: "Kaduna" },
    ]);

    // Mock messages for demonstration
    setMessages([
      {
        id: "1",
        content:
          "Good morning everyone! How is your cassava farm doing this season?",
        author: { id: "1", name: "Adamu Ibrahim", location: "Kano" },
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: "text",
        reactions: {},
        metadata: { cropType: "cassava" },
      },
      {
        id: "2",
        content:
          "Morning brother! My cassava is doing well. The rains have been good this year. How about yours?",
        author: { id: "2", name: "Ngozi Okafor", location: "Enugu" },
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        type: "text",
        reactions: {},
      },
      {
        id: "3",
        content:
          "I'm having some issues with pests. Any organic solutions you can recommend?",
        author: { id: "3", name: "Fatima Aliyu", location: "Sokoto" },
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: "text",
        reactions: {},
      },
    ]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentRoom || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      author: {
        id: user.id || "current-user",
        name: user.name || "Current User",
        avatar: user.avatar,
        location: user.location?.state,
        isOnline: true,
      },
      timestamp: new Date().toISOString(),
      type: "text",
      reactions: {},
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    scrollToBottom();
  };

  // Handle typing indicators
  const handleTyping = () => {
    if (!isTyping && currentRoom && user) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Handle room switching
  const handleRoomChange = (room: ChatRoom) => {
    setCurrentRoom(room);

    // Mock different messages for different rooms
    if (room.id === "cassava") {
      setMessages([
        {
          id: "c1",
          content:
            "Welcome to the Cassava Farmers chat! 🍠 Share your tips and experiences here.",
          author: { id: "system", name: "System", location: "Nigeria" },
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: "system",
          reactions: {},
        },
        {
          id: "c2",
          content:
            "Just harvested my cassava crop. The yield was amazing this season!",
          author: { id: "1", name: "Adamu Ibrahim", location: "Kano" },
          timestamp: new Date(Date.now() - 5400000).toISOString(),
          type: "text",
          reactions: {},
          metadata: { cropType: "cassava" },
        },
      ]);
    } else if (room.id === "market") {
      setMessages([
        {
          id: "m1",
          content:
            "Current cassava prices in Lagos: ₦180/kg. Up from last week!",
          author: { id: "2", name: "Ngozi Okafor", location: "Lagos" },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "text",
          reactions: {},
        },
        {
          id: "m2",
          content: "Tomato prices are also rising. ₦250/kg in Kano market.",
          author: { id: "3", name: "Fatima Aliyu", location: "Kano" },
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          type: "text",
          reactions: {},
        },
      ]);
    } else {
      // Default general chat messages
      setMessages([
        {
          id: "g1",
          content: "Good morning farmers! How is everyone doing today?",
          author: { id: "1", name: "Adamu Ibrahim", location: "Kano" },
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "text",
          reactions: {},
        },
        {
          id: "g2",
          content: "Morning! Just checking the weather forecast for this week.",
          author: { id: "2", name: "Ngozi Okafor", location: "Enugu" },
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          type: "text",
          reactions: {},
        },
      ]);
    }
  };

  // Handle file attachment
  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement image upload and display
      console.log('Selected file:', file.name);
    }
  };

  // Handle voice recording
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  // Format time for messages
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get user display name
  const getUserDisplayName = (userId: string) => {
    const user = onlineUsers.find((u) => u.id === userId);
    return user?.name || "Unknown User";
  };

  const MessageBubble = ({
    message,
    isOwnMessage,
  }: {
    message: ChatMessage;
    isOwnMessage: boolean;
  }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        mb: 1,
        alignItems: "flex-end",
      }}
    >
      {!isOwnMessage && (
        <Avatar
          sx={{
            mr: 1,
            width: 32,
            height: 32,
            bgcolor: message.type === "system" ? "grey.500" : "primary.main",
          }}
        >
          {message.type === "system"
            ? "🤖"
            : message.author.name.charAt(0).toUpperCase()}
        </Avatar>
      )}

      <Box sx={{ maxWidth: "70%" }}>
        {!isOwnMessage && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
              {message.author.name}
            </Typography>
            {message.author.location && (
              <Chip
                label={message.author.location}
                size="small"
                variant="outlined"
                sx={{ height: 16, fontSize: "0.6rem" }}
              />
            )}
          </Box>
        )}

        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            bgcolor:
              message.type === "system"
                ? "info.light"
                : isOwnMessage
                ? "primary.main"
                : "grey.100",
            color:
              message.type === "system"
                ? "info.contrastText"
                : isOwnMessage
                ? "white"
                : "text.primary",
            borderRadius: 2,
            borderBottomRightRadius: isOwnMessage ? 0 : 2,
            borderBottomLeftRadius: isOwnMessage ? 2 : 0,
          }}
        >
          <Typography variant="body2">{message.content}</Typography>

          {message.metadata?.cropType && (
            <Chip
              label={message.metadata.cropType}
              size="small"
              sx={{
                mt: 0.5,
                height: 16,
                fontSize: "0.6rem",
                bgcolor: isOwnMessage ? "primary.dark" : "primary.light",
                color: "white",
              }}
            />
          )}
        </Paper>

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            display: "block",
            textAlign: isOwnMessage ? "right" : "left",
            mt: 0.5,
          }}
        >
          {formatTime(message.timestamp)}
        </Typography>
      </Box>
    </Box>
  );

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6">
          Please log in to join the farmers' community chat
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2, height: "calc(100vh - 100px)" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Sidebar with rooms and online users */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  🇳🇬 Farmers Chat
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                >
                  <MoreVert />
                </IconButton>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Language</InputLabel>
                <Select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Chat Rooms */}
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <Typography
                variant="subtitle2"
                sx={{ p: 2, pb: 1, fontWeight: "bold" }}
              >
                Chat Rooms
              </Typography>

              {rooms.map((room) => (
                <Box
                  key={room.id}
                  onClick={() => handleRoomChange(room)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    bgcolor:
                      currentRoom?.id === room.id
                        ? "primary.light"
                        : "transparent",
                    color:
                      currentRoom?.id === room.id
                        ? "primary.contrastText"
                        : "text.primary",
                    "&:hover": { bgcolor: "action.hover" },
                    borderLeft: currentRoom?.id === room.id ? 3 : 0,
                    borderColor: "primary.main",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {room.icon} {room.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {room.memberCount} members
                      </Typography>
                    </Box>
                    {room.isActive && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "success.main",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Online Users */}
              <Typography
                variant="subtitle2"
                sx={{ p: 2, pb: 1, fontWeight: "bold" }}
              >
                Online ({onlineUsers.length})
              </Typography>

              {onlineUsers.map((user) => (
                <Box
                  key={user.id}
                  sx={{ px: 2, py: 1, display: "flex", alignItems: "center" }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    sx={{
                      "& .MuiBadge-badge": {
                        bgcolor: "success.main",
                        color: "success.main",
                        "&::after": {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          animation: "ripple 1.2s infinite ease-in-out",
                          border: "1px solid currentColor",
                          content: '""',
                        },
                      },
                    }}
                  >
                    <Avatar
                      sx={{ width: 24, height: 24, bgcolor: "secondary.main" }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      {user.name}
                    </Typography>
                    {user.location && (
                      <Typography variant="caption" color="textSecondary">
                        {user.location}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Main Chat Area */}
        <Grid item xs={12} md={9}>
          <Paper
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Chat Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {currentRoom?.icon} {currentRoom?.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {currentRoom?.description} • {currentRoom?.memberCount}{" "}
                    members
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Tooltip title="Voice Chat">
                    <IconButton size="small">
                      <Mic />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Settings">
                    <IconButton
                      size="small"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Settings />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {messages.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Welcome to {currentRoom?.name}! 👋
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start a conversation with fellow farmers
                  </Typography>
                </Box>
              ) : (
                messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={message.author.id === user.id}
                  />
                ))
              )}

              {/* Typing indicators */}
              {typingUsers.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    {typingUsers.map(getUserDisplayName).join(", ")}{" "}
                    {typingUsers.length === 1 ? "is" : "are"} typing...
                  </Typography>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  variant="outlined"
                  size="small"
                  multiline
                  maxRows={4}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />

                <Tooltip title="Attach Image">
                  <IconButton onClick={handleFileAttach} color="primary">
                    <ImageIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title={
                    isRecording ? "Stop Recording" : "Record Voice Message"
                  }
                >
                  <IconButton
                    onClick={handleVoiceRecord}
                    color={isRecording ? "error" : "primary"}
                  >
                    {isRecording ? <MicOff /> : <Mic />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Send Message">
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    color="primary"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                      "&:disabled": { bgcolor: "action.disabled" },
                    }}
                  >
                    <Send />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />

      {/* Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <MenuItem>
          <Person sx={{ mr: 1 }} />
          Profile
        </MenuItem>
      </Menu>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chat Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Customize your chat experience
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2" color="textSecondary">
            More settings coming soon...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Community;
