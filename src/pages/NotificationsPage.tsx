import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  Container,
  Typography,
  Box,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Tab,
  Tabs,
  Badge,
  Avatar,
  Alert,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  Notifications,
  Info,
  CheckCircle,
  Delete,
  Settings,
  MarkEmailRead,
  Agriculture,
  Forum,
  WbSunny,
  TrendingUp,
  School,
} from "@mui/icons-material";
import api from "../utils/api";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  category: string;
  status: string;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  actionText?: string;
  imageUrl?: string;
  data?: any;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  weather: boolean;
  community: boolean;
  learning: boolean;
  crops: boolean;
  market: boolean;
}

const NotificationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    push: true,
    weather: true,
    community: true,
    learning: true,
    crops: true,
    market: true,
  });

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications");
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await api.get("/users/profile");
      if (response.data.preferences?.notifications) {
        setPreferences(response.data.preferences.notifications);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId
            ? { ...n, status: "read", readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(
        notifications.map((n) => ({
          ...n,
          status: "read",
          readAt: new Date().toISOString(),
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      if (
        notifications.find((n) => n._id === notificationId)?.status !== "read"
      ) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const updatePreferences = async () => {
    try {
      await api.post("/notifications/preferences", {
        notifications: preferences,
      });
      setSettingsOpen(false);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "weather_alert":
        return <WbSunny />;
      case "crop_diagnosis":
        return <Agriculture />;
      case "community_mention":
      case "community_reply":
        return <Forum />;
      case "learning_reminder":
        return <School />;
      case "market_price":
        return <TrendingUp />;
      case "achievement":
        return <CheckCircle />;
      case "system_update":
        return <Info />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationColor = (category: string) => {
    switch (category) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "info";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      default:
        return "default";
    }
  };

  const filterNotifications = (status: string) => {
    switch (status) {
      case "unread":
        return notifications.filter((n) => n.status !== "read");
      case "read":
        return notifications.filter((n) => n.status === "read");
      default:
        return notifications;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const NotificationItem: React.FC<{ notification: Notification }> = ({
    notification,
  }) => (
    <Card
      sx={{
        mb: 1,
        bgcolor:
          notification.status === "read" ? "grey.50" : "background.paper",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Avatar
            sx={{
              bgcolor: `${getNotificationColor(notification.category)}.main`,
            }}
          >
            {getNotificationIcon(notification.type)}
          </Avatar>

          <Box flex={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {notification.title}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={notification.priority}
                  size="small"
                  color={getPriorityColor(notification.priority)}
                />
                <Typography variant="caption" color="textSecondary">
                  {formatTimeAgo(notification.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="textSecondary" mb={2}>
              {notification.message}
            </Typography>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" gap={1}>
                {notification.actionUrl && (
                  <Button size="small" variant="outlined">
                    {notification.actionText || "View"}
                  </Button>
                )}
                {notification.status !== "read" && (
                  <Button
                    size="small"
                    onClick={() => markAsRead(notification._id)}
                    startIcon={<MarkEmailRead />}
                  >
                    Mark as Read
                  </Button>
                )}
              </Box>

              <IconButton
                size="small"
                onClick={() => deleteNotification(notification._id)}
                color="error"
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const TabPanel: React.FC<{
    children?: React.ReactNode;
    index: number;
    value: number;
  }> = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
          <Typography variant="h4">Notifications</Typography>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            startIcon={<MarkEmailRead />}
          >
            Mark All Read
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSettingsOpen(true)}
            startIcon={<Settings />}
          >
            Settings
          </Button>
        </Box>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_: SyntheticEvent, newValue: number) =>
          setTabValue(newValue)
        }
        sx={{ mb: 3 }}
      >
        <Tab label={`All (${notifications.length})`} />
        <Tab label={`Unread (${unreadCount})`} />
        <Tab label={`Read (${notifications.length - unreadCount})`} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {notifications.length === 0 ? (
          <Alert severity="info">
            No notifications yet. We'll notify you about important updates!
          </Alert>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {filterNotifications("unread").map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
          />
        ))}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {filterNotifications("read").map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
          />
        ))}
      </TabPanel>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Choose how you'd like to receive notifications
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Delivery Methods
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.email}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        email: e.target.checked,
                      })
                    }
                  />
                }
                label="Email notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.sms}
                    onChange={(e) =>
                      setPreferences({ ...preferences, sms: e.target.checked })
                    }
                  />
                }
                label="SMS notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.push}
                    onChange={(e) =>
                      setPreferences({ ...preferences, push: e.target.checked })
                    }
                  />
                }
                label="Push notifications"
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Notification Types
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.weather}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        weather: e.target.checked,
                      })
                    }
                  />
                }
                label="Weather alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.community}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        community: e.target.checked,
                      })
                    }
                  />
                }
                label="Community updates"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.learning}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        learning: e.target.checked,
                      })
                    }
                  />
                }
                label="Learning reminders"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.crops}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        crops: e.target.checked,
                      })
                    }
                  />
                }
                label="Crop alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.market}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        market: e.target.checked,
                      })
                    }
                  />
                }
                label="Market price alerts"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={updatePreferences} variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NotificationsPage;
