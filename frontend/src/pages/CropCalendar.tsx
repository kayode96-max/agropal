import React, { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tab,
  Tabs,
  LinearProgress,
  Avatar,
  useTheme,
  SelectChangeEvent,
} from "@mui/material";
import {
  Add,
  CheckCircle,
  Schedule,
  Agriculture,
  TrendingUp,
  Event,
  LocalFlorist,
} from "@mui/icons-material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import api from "../utils/api";

interface CropCalendar {
  _id: string;
  cropType: string;
  variety: string;
  season: string;
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate: string;
  farmLocation: {
    state: string;
    lga: string;
    village: string;
    farmSize: number;
    plotName: string;
  };
  activities: Activity[];
  status: string;
  totalCost: number;
  profitMargin: number;
  roi: number;
}

interface Activity {
  _id: string;
  type: string;
  name: string;
  description: string;
  scheduledDate: string;
  completedDate: string;
  status: string;
  cost: number;
  notes: string;
}

const CropCalendarPage: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [calendars, setCalendars] = useState<CropCalendar[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<CropCalendar | null>(
    null
  );
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [harvestDialogOpen, setHarvestDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cropType: "",
    variety: "",
    season: "",
    plantingDate: new Date(),
    expectedHarvestDate: new Date(),
    farmLocation: {
      state: "",
      lga: "",
      village: "",
      farmSize: 0,
      plotName: "",
    },
  });
  const [activityData, setActivityData] = useState({
    type: "",
    name: "",
    description: "",
    scheduledDate: new Date(),
    cost: 0,
    notes: "",
  });
  const [harvestData, setHarvestData] = useState({
    actualYield: 0,
    quality: "good",
    harvestCost: 0,
    storageMethod: "",
    storageCost: 0,
    marketPrice: 0,
    buyer: "",
    totalIncome: 0,
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

  const cropTypes = [
    "cassava",
    "yam",
    "maize",
    "rice",
    "plantain",
    "cocoa",
    "oil_palm",
    "tomato",
    "pepper",
    "okra",
    "onion",
    "cowpea",
    "groundnut",
    "soybean",
    "millet",
    "sorghum",
    "sweet_potato",
    "banana",
    "ginger",
    "garlic",
    "cotton",
  ];

  const seasons = ["dry", "wet", "harmattan", "year-round"];

  const activityTypes = [
    "land_preparation",
    "planting",
    "weeding",
    "fertilizing",
    "pest_control",
    "disease_treatment",
    "irrigation",
    "harvesting",
    "post_harvest",
    "storage",
    "marketing",
  ];

  const qualityOptions = ["premium", "good", "fair", "poor"];

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      setLoading(true);
      const response = await api.get("/calendar");
      setCalendars(response.data.calendars);
    } catch (error) {
      console.error("Error fetching calendars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCalendar = async () => {
    try {
      await api.post("/calendar", formData);
      setDialogOpen(false);
      setFormData({
        cropType: "",
        variety: "",
        season: "",
        plantingDate: new Date(),
        expectedHarvestDate: new Date(),
        farmLocation: {
          state: "",
          lga: "",
          village: "",
          farmSize: 0,
          plotName: "",
        },
      });
      fetchCalendars();
    } catch (error) {
      console.error("Error creating calendar:", error);
    }
  };

  const handleAddActivity = async () => {
    if (!selectedCalendar) return;

    try {
      await api.post(
        `/calendar/${selectedCalendar._id}/activities`,
        activityData
      );
      setActivityDialogOpen(false);
      setActivityData({
        type: "",
        name: "",
        description: "",
        scheduledDate: new Date(),
        cost: 0,
        notes: "",
      });
      fetchCalendars();
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const handleUpdateActivity = async (activityId: string, updates: any) => {
    if (!selectedCalendar) return;

    try {
      await api.put(
        `/calendar/${selectedCalendar._id}/activities/${activityId}`,
        updates
      );
      fetchCalendars();
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const handleRecordHarvest = async () => {
    if (!selectedCalendar) return;

    try {
      await api.post(`/calendar/${selectedCalendar._id}/harvest`, harvestData);
      setHarvestDialogOpen(false);
      setHarvestData({
        actualYield: 0,
        quality: "good",
        harvestCost: 0,
        storageMethod: "",
        storageCost: 0,
        marketPrice: 0,
        buyer: "",
        totalIncome: 0,
      });
      fetchCalendars();
    } catch (error) {
      console.error("Error recording harvest:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return theme.palette.success.main;
      case "in_progress":
        return theme.palette.warning.main;
      case "overdue":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "planting":
        return <LocalFlorist />;
      case "weeding":
        return <Agriculture />;
      case "fertilizing":
        return <TrendingUp />;
      case "harvesting":
        return <Event />;
      default:
        return <Schedule />;
    }
  };

  const CalendarCard: React.FC<{ calendar: CropCalendar }> = ({ calendar }) => (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {calendar.cropType} {calendar.variety && `(${calendar.variety})`}
          </Typography>
          <Chip
            label={calendar.status}
            color={
              calendar.status === "completed"
                ? "success"
                : calendar.status === "active"
                ? "primary"
                : "default"
            }
            size="small"
          />
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            📍 {calendar.farmLocation.plotName}, {calendar.farmLocation.state}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            🌾 {calendar.farmLocation.farmSize} hectares
          </Typography>
          <Typography variant="body2" color="textSecondary">
            📅 Planted: {new Date(calendar.plantingDate).toLocaleDateString()}
          </Typography>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Investment
            </Typography>
            <Typography variant="h6" color="error">
              ₦{calendar.totalCost?.toLocaleString() || 0}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              ROI
            </Typography>
            <Typography
              variant="h6"
              color={calendar.roi > 0 ? "success.main" : "error.main"}
            >
              {calendar.roi?.toFixed(1) || 0}%
            </Typography>
          </Grid>
        </Grid>

        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedCalendar(calendar)}
          >
            View Details
          </Button>
          {calendar.status === "active" && (
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                setSelectedCalendar(calendar);
                setHarvestDialogOpen(true);
              }}
            >
              Record Harvest
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const TabPanel: React.FC<{
    children?: React.ReactNode;
    index: number;
    value: number;
  }> = (props) => {
    const { children, value, index } = props;
    return (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4">Crop Calendar</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          New Calendar
        </Button>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_: SyntheticEvent, newValue: number) =>
          setTabValue(newValue)
        }
        sx={{ mb: 3 }}
      >
        <Tab label="All Calendars" />
        <Tab label="Active" />
        <Tab label="Completed" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {calendars.map((calendar) => (
            <Grid item xs={12} md={6} lg={4} key={calendar._id}>
              <CalendarCard calendar={calendar} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {calendars
            .filter((c) => c.status === "active")
            .map((calendar) => (
              <Grid item xs={12} md={6} lg={4} key={calendar._id}>
                <CalendarCard calendar={calendar} />
              </Grid>
            ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {calendars
            .filter((c) => c.status === "completed")
            .map((calendar) => (
              <Grid item xs={12} md={6} lg={4} key={calendar._id}>
                <CalendarCard calendar={calendar} />
              </Grid>
            ))}
        </Grid>
      </TabPanel>

      {/* Calendar Details Dialog */}
      <Dialog
        open={!!selectedCalendar}
        onClose={() => setSelectedCalendar(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedCalendar && (
          <>
            <DialogTitle>
              {selectedCalendar.cropType} Calendar
              <Button
                onClick={() => {
                  setActivityDialogOpen(true);
                }}
                variant="outlined"
                size="small"
                sx={{ ml: 2 }}
              >
                Add Activity
              </Button>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Farm Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong>{" "}
                    {selectedCalendar.farmLocation.plotName},{" "}
                    {selectedCalendar.farmLocation.state}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Size:</strong>{" "}
                    {selectedCalendar.farmLocation.farmSize} hectares
                  </Typography>
                  <Typography variant="body2">
                    <strong>Season:</strong> {selectedCalendar.season}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Planted:</strong>{" "}
                    {new Date(
                      selectedCalendar.plantingDate
                    ).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Financial Summary
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Investment:</strong> ₦
                    {selectedCalendar.totalCost?.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Profit Margin:</strong> ₦
                    {selectedCalendar.profitMargin?.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="body2">
                    <strong>ROI:</strong>{" "}
                    {selectedCalendar.roi?.toFixed(1) || 0}%
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Activities
              </Typography>
              <List>
                {selectedCalendar.activities.map((activity) => (
                  <ListItem key={activity._id} divider>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: getStatusColor(activity.status) }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.name}
                      secondary={`${activity.type} • ${new Date(
                        activity.scheduledDate
                      ).toLocaleDateString()} • ₦${activity.cost}`}
                    />
                    <Box>
                      <Chip
                        label={activity.status}
                        color={
                          activity.status === "completed"
                            ? "success"
                            : activity.status === "in_progress"
                            ? "warning"
                            : "default"
                        }
                        size="small"
                      />
                      {activity.status === "pending" && (
                        <IconButton
                          onClick={() =>
                            handleUpdateActivity(activity._id, {
                              status: "completed",
                              completedDate: new Date(),
                            })
                          }
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedCalendar(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create Calendar Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Crop Calendar</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Crop Type</InputLabel>
                <Select
                  value={formData.cropType}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setFormData({ ...formData, cropType: e.target.value })
                  }
                >
                  {cropTypes.map((crop) => (
                    <MenuItem key={crop} value={crop}>
                      {crop.replace("_", " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Variety"
                value={formData.variety}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, variety: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Season</InputLabel>
                <Select
                  value={formData.season}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setFormData({ ...formData, season: e.target.value })
                  }
                >
                  {seasons.map((season) => (
                    <MenuItem key={season} value={season}>
                      {season}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Planting Date"
                type="date"
                value={formData.plantingDate?.toISOString().split("T")[0] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    plantingDate: new Date(e.target.value),
                  })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.farmLocation.state}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setFormData({
                      ...formData,
                      farmLocation: {
                        ...formData.farmLocation,
                        state: e.target.value,
                      },
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
                label="Farm Size (hectares)"
                type="number"
                value={formData.farmLocation.farmSize}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    farmLocation: {
                      ...formData.farmLocation,
                      farmSize: Number(e.target.value),
                    },
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCalendar} variant="contained">
            Create Calendar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog
        open={activityDialogOpen}
        onClose={() => setActivityDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Activity</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={activityData.type}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setActivityData({ ...activityData, type: e.target.value })
                  }
                >
                  {activityTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Activity Name"
                value={activityData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setActivityData({ ...activityData, name: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                multiline
                rows={3}
                value={activityData.description}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setActivityData({
                    ...activityData,
                    description: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Scheduled Date"
                type="date"
                value={
                  activityData.scheduledDate?.toISOString().split("T")[0] || ""
                }
                onChange={(e) =>
                  setActivityData({
                    ...activityData,
                    scheduledDate: new Date(e.target.value),
                  })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Estimated Cost (₦)"
                type="number"
                value={activityData.cost}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setActivityData({
                    ...activityData,
                    cost: Number(e.target.value),
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActivityDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddActivity} variant="contained">
            Add Activity
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Harvest Dialog */}
      <Dialog
        open={harvestDialogOpen}
        onClose={() => setHarvestDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Record Harvest</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Actual Yield (kg)"
                type="number"
                value={harvestData.actualYield}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setHarvestData({
                    ...harvestData,
                    actualYield: Number(e.target.value),
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Quality</InputLabel>
                <Select
                  value={harvestData.quality}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setHarvestData({ ...harvestData, quality: e.target.value })
                  }
                >
                  {qualityOptions.map((quality) => (
                    <MenuItem key={quality} value={quality}>
                      {quality}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Market Price (₦/kg)"
                type="number"
                value={harvestData.marketPrice}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setHarvestData({
                    ...harvestData,
                    marketPrice: Number(e.target.value),
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Total Income (₦)"
                type="number"
                value={harvestData.totalIncome}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setHarvestData({
                    ...harvestData,
                    totalIncome: Number(e.target.value),
                  })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Buyer"
                value={harvestData.buyer}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setHarvestData({ ...harvestData, buyer: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHarvestDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRecordHarvest} variant="contained">
            Record Harvest
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CropCalendarPage;
