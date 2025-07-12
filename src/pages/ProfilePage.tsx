import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tab,
  Tabs,
  Badge,
  useTheme,
} from "@mui/material";
import {
  Edit,
  CameraAlt,
  Agriculture,
  TrendingUp,
  LocationOn,
  Phone,
  Email,
  Person,
  Settings,
  Verified,
  Star,
  Group,
  School,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

interface UserProfile {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    profilePicture: string;
  };
  location: {
    state: string;
    lga: string;
    village: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  farmingInfo: {
    experienceYears: number;
    farmSize: number;
    farmType: string;
    primaryCrops: string[];
    secondaryCrops: string[];
    livestock: string[];
    farmingMethods: string[];
    challenges: string[];
    goals: string[];
  };
  preferences: {
    language: string;
    currency: string;
    units: string;
    notifications: any;
  };
  achievements: Array<{
    type: string;
    title: string;
    description: string;
    earnedAt: string;
    icon: string;
  }>;
  statistics: {
    totalDiagnoses: number;
    successfulTreatments: number;
    communityPosts: number;
    helpfulAnswers: number;
    coursesCompleted: number;
    loginStreak: number;
  };
  verificationStatus: {
    isVerified: boolean;
    verificationLevel: string;
    verificationDate: string;
  };
  socialConnections: {
    following: any[];
    followers: any[];
  };
  subscription: {
    plan: string;
    isActive: boolean;
  };
  fullName: string;
  farmingExperience: string;
}

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editData, setEditData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
    },
    location: {
      state: "",
      lga: "",
      village: "",
    },
    farmingInfo: {
      experienceYears: 0,
      farmSize: 0,
      farmType: "",
      primaryCrops: [],
      secondaryCrops: [],
      livestock: [],
      farmingMethods: [],
      challenges: [],
      goals: [],
    },
    preferences: {
      language: "en",
      currency: "NGN",
      units: "metric",
    },
  });

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const genderOptions = ["male", "female", "other"];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/profile");
      setProfile(response.data);

      // Initialize edit data with current profile data
      if (response.data) {
        setEditData({
          personalInfo: response.data.personalInfo || {},
          location: response.data.location || {},
          farmingInfo: response.data.farmingInfo || {},
          preferences: response.data.preferences || {},
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.post("/users/profile", editData);
      setEditDialogOpen(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      await api.post("/users/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPhotoDialogOpen(false);
      setSelectedFile(null);
      fetchProfile();
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "first_diagnosis":
        return "🔍";
      case "community_helper":
        return "🤝";
      case "learning_champion":
        return "🏆";
      case "weather_watcher":
        return "🌤️";
      case "crop_expert":
        return "🌾";
      case "social_connector":
        return "👥";
      default:
        return "🏅";
    }
  };

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case "expert":
        return (
          <Chip label="Expert" color="primary" size="small" icon={<Star />} />
        );
      case "advanced":
        return (
          <Chip
            label="Advanced"
            color="secondary"
            size="small"
            icon={<Verified />}
          />
        );
      case "intermediate":
        return (
          <Chip
            label="Intermediate"
            color="info"
            size="small"
            icon={<TrendingUp />}
          />
        );
      default:
        return <Chip label="Basic" color="default" size="small" />;
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: color }}>{icon}</Box>
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load profile. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box position="relative">
              <Avatar
                sx={{ width: 120, height: 120 }}
                src={profile.personalInfo?.profilePicture}
              >
                {profile.personalInfo?.firstName?.charAt(0) ||
                  user?.name?.charAt(0)}
              </Avatar>
              <Button
                size="small"
                variant="contained"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  minWidth: "auto",
                  borderRadius: "50%",
                  p: 1,
                }}
                onClick={() => setPhotoDialogOpen(true)}
              >
                <CameraAlt />
              </Button>
            </Box>
          </Grid>

          <Grid item xs>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography variant="h4">
                {profile.fullName || user?.name}
              </Typography>
              {profile.verificationStatus?.isVerified && (
                <Badge badgeContent={<Verified />} color="primary">
                  {getVerificationBadge(
                    profile.verificationStatus.verificationLevel
                  )}
                </Badge>
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn fontSize="small" />
                <Typography variant="body2" color="textSecondary">
                  {profile.location?.village}, {profile.location?.state}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Agriculture fontSize="small" />
                <Typography variant="body2" color="textSecondary">
                  {profile.farmingExperience} Farmer
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2} mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Group fontSize="small" />
                <Typography variant="body2">
                  {profile.socialConnections?.followers?.length || 0} Followers
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Person fontSize="small" />
                <Typography variant="body2">
                  {profile.socialConnections?.following?.length || 0} Following
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setEditDialogOpen(true)}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Diagnoses"
            value={profile.statistics?.totalDiagnoses || 0}
            icon={<Agriculture fontSize="large" />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Successful Treatments"
            value={profile.statistics?.successfulTreatments || 0}
            icon={<TrendingUp fontSize="large" />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Community Posts"
            value={profile.statistics?.communityPosts || 0}
            icon={<Group fontSize="large" />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Courses Completed"
            value={profile.statistics?.coursesCompleted || 0}
            icon={<School fontSize="large" />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_: SyntheticEvent, newValue: number) =>
          setTabValue(newValue)
        }
        sx={{ mb: 3 }}
      >
        <Tab label="Farm Details" />
        <Tab label="Achievements" />
        <Tab label="Settings" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Farming Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Experience"
                      secondary={`${
                        profile.farmingInfo?.experienceYears || 0
                      } years`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Farm Size"
                      secondary={`${
                        profile.farmingInfo?.farmSize || 0
                      } hectares`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Farm Type"
                      secondary={
                        profile.farmingInfo?.farmType || "Not specified"
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Primary Crops
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {profile.farmingInfo?.primaryCrops?.map((crop, index) => (
                    <Chip key={index} label={crop} color="primary" />
                  )) || (
                    <Typography color="textSecondary">
                      No crops specified
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {profile.achievements?.map((achievement, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {achievement.icon || getAchievementIcon(achievement.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{achievement.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">
                    {achievement.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {(!profile.achievements || profile.achievements.length === 0) && (
            <Grid item xs={12}>
              <Alert severity="info">
                Complete activities to earn achievements! Start by diagnosing
                crops or participating in the community.
              </Alert>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={user?.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={profile.personalInfo?.phone || "Not provided"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText
                      primary="Language"
                      secondary={profile.preferences?.language || "English"}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Subscription
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Chip
                    label={profile.subscription?.plan || "Free"}
                    color={
                      profile.subscription?.plan === "premium"
                        ? "primary"
                        : "default"
                    }
                  />
                  <Typography variant="body2" color="textSecondary">
                    {profile.subscription?.isActive ? "Active" : "Inactive"}
                  </Typography>
                </Box>
                <Button variant="outlined" fullWidth>
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="First Name"
                value={editData.personalInfo?.firstName || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    personalInfo: {
                      ...editData.personalInfo,
                      firstName: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Last Name"
                value={editData.personalInfo?.lastName || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    personalInfo: {
                      ...editData.personalInfo,
                      lastName: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                value={editData.personalInfo?.phone || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    personalInfo: {
                      ...editData.personalInfo,
                      phone: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={editData.personalInfo?.gender || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      personalInfo: {
                        ...editData.personalInfo,
                        gender: e.target.value,
                      },
                    })
                  }
                >
                  {genderOptions.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>State</InputLabel>
                <Select
                  value={editData.location?.state || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      location: { ...editData.location, state: e.target.value },
                    })
                  }
                >
                  {nigerianStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Village"
                value={editData.location?.village || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    location: { ...editData.location, village: e.target.value },
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo Upload Dialog */}
      <Dialog
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={2}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              style={{ marginBottom: 16 }}
            />
            {selectedFile && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Selected: {selectedFile.name}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePhotoUpload}
            variant="contained"
            disabled={!selectedFile}
          >
            Upload Photo
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
