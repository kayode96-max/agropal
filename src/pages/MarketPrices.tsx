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
  Tab,
  Tabs,
  LinearProgress,
  Alert,
  useTheme,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SelectChangeEvent,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Add,
  Refresh,
  Search,
  Timeline,
  ExpandMore,
  Info,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../utils/api";

interface MarketPrice {
  _id: string;
  crop: string;
  variety: string;
  market: {
    name: string;
    type: string;
    location: {
      state: string;
      lga: string;
      marketName: string;
    };
  };
  price: {
    current: number;
    currency: string;
    unit: string;
    quality: string;
  };
  trend: {
    direction: string;
    percentage: number;
    period: string;
  };
  forecast: {
    next7Days: number;
    next30Days: number;
    nextSeason: number;
    confidence: number;
  };
  metadata: {
    lastUpdated: string;
    reliability: string;
  };
}

interface PriceHistory {
  date: string;
  price: number;
  market: string;
  location: any;
  quality: string;
}

const MarketPricesPage: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [trendingPrices, setTrendingPrices] = useState<MarketPrice[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [forecastDialogOpen, setForecastDialogOpen] = useState(false);
  const [forecast, setForecast] = useState<any>(null);
  const [reportData, setReportData] = useState({
    crop: "",
    variety: "",
    market: {
      name: "",
      location: {
        state: "",
        lga: "",
        marketName: "",
      },
    },
    price: {
      current: 0,
      currency: "NGN",
      unit: "kg",
    },
    quality: "good",
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

  const qualityOptions = ["premium", "good", "fair", "poor"];

  useEffect(() => {
    fetchMarketData();
  }, [selectedCrop, selectedState]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMarketData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (selectedCrop) params.append("crop", selectedCrop);
      if (selectedState) params.append("state", selectedState);

      const [pricesResponse, trendingResponse] = await Promise.all([
        api.get(`/market/prices?${params.toString()}`),
        api.get(
          `/market/prices/trending?${
            selectedState ? `state=${selectedState}` : ""
          }`
        ),
      ]);

      setPrices(pricesResponse.data.prices);
      setTrendingPrices(trendingResponse.data);
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportPrice = async () => {
    try {
      await api.post("/market/prices", reportData);
      setDialogOpen(false);
      setReportData({
        crop: "",
        variety: "",
        market: {
          name: "",
          location: {
            state: "",
            lga: "",
            marketName: "",
          },
        },
        price: {
          current: 0,
          currency: "NGN",
          unit: "kg",
        },
        quality: "good",
      });
      fetchMarketData();
    } catch (error) {
      console.error("Error reporting price:", error);
    }
  };

  const fetchPriceHistory = async (crop: string) => {
    try {
      const params = new URLSearchParams();
      params.append("days", "30");
      if (selectedState) params.append("state", selectedState);

      const response = await api.get(
        `/market/prices/${crop}/history?${params.toString()}`
      );
      setPriceHistory(response.data.history);
      setHistoryDialogOpen(true);
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  const fetchForecast = async (crop: string) => {
    try {
      const params = new URLSearchParams();
      if (selectedState) params.append("state", selectedState);

      const response = await api.get(
        `/market/forecast/${crop}?${params.toString()}`
      );
      setForecast(response.data);
      setForecastDialogOpen(true);
    } catch (error) {
      console.error("Error fetching forecast:", error);
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <TrendingUp color="success" />;
      case "down":
        return <TrendingDown color="error" />;
      default:
        return <AttachMoney color="disabled" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case "up":
        return theme.palette.success.main;
      case "down":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const formatPriceData = (history: PriceHistory[]) => {
    return history.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      price: item.price,
      market: item.market,
    }));
  };

  const PriceCard: React.FC<{ price: MarketPrice }> = ({ price }) => (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {price.crop.charAt(0).toUpperCase() + price.crop.slice(1)}
            {price.variety && ` (${price.variety})`}
          </Typography>
          <Box display="flex" alignItems="center">
            {getTrendIcon(price.trend?.direction)}
            <Typography
              variant="body2"
              color={getTrendColor(price.trend?.direction)}
              ml={0.5}
            >
              {price.trend?.percentage
                ? `${price.trend.percentage.toFixed(1)}%`
                : ""}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h4" color="primary" gutterBottom>
          ₦{price.price.current.toLocaleString()}/{price.price.unit}
        </Typography>

        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            📍 {price.market.name}, {price.market.location.state}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            🏷️ Quality: {price.price.quality}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            📅 Updated:{" "}
            {new Date(price.metadata.lastUpdated).toLocaleDateString()}
          </Typography>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            size="small"
            variant="outlined"
            startIcon={<Timeline />}
            onClick={() => fetchPriceHistory(price.crop)}
          >
            History
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Info />}
            onClick={() => fetchForecast(price.crop)}
          >
            Forecast
          </Button>
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

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
        <Typography variant="h4">Market Prices</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchMarketData}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Report Price
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Crop</InputLabel>
              <Select
                value={selectedCrop}
                onChange={(e: SelectChangeEvent<string>) =>
                  setSelectedCrop(e.target.value)
                }
              >
                <MenuItem value="">All Crops</MenuItem>
                {cropTypes.map((crop) => (
                  <MenuItem key={crop} value={crop}>
                    {crop.replace("_", " ").toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by State</InputLabel>
              <Select
                value={selectedState}
                onChange={(e: SelectChangeEvent<string>) =>
                  setSelectedState(e.target.value)
                }
              >
                <MenuItem value="">All States</MenuItem>
                {nigerianStates.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              startIcon={<Search />}
              onClick={fetchMarketData}
              fullWidth
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Tabs
        value={tabValue}
        onChange={(_: SyntheticEvent, newValue: number) =>
          setTabValue(newValue)
        }
        sx={{ mb: 3 }}
      >
        <Tab label="All Prices" />
        <Tab label="Trending" />
        <Tab label="My Reports" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {prices.map((price) => (
            <Grid item xs={12} md={6} lg={4} key={price._id}>
              <PriceCard price={price} />
            </Grid>
          ))}
          {prices.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">
                No market prices found. Try adjusting your filters or report a
                price.
              </Alert>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {trendingPrices.map((price) => (
            <Grid item xs={12} md={6} lg={4} key={price._id}>
              <PriceCard price={price} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Alert severity="info">
          Your reported prices will appear here. Start reporting prices to help
          the community!
        </Alert>
      </TabPanel>

      {/* Report Price Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Report Market Price</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Crop</InputLabel>
                <Select
                  value={reportData.crop}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setReportData({ ...reportData, crop: e.target.value })
                  }
                >
                  {cropTypes.map((crop) => (
                    <MenuItem key={crop} value={crop}>
                      {crop.replace("_", " ").toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Variety (Optional)"
                value={reportData.variety}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReportData({ ...reportData, variety: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Market Name"
                value={reportData.market.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReportData({
                    ...reportData,
                    market: { ...reportData.market, name: e.target.value },
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>State</InputLabel>
                <Select
                  value={reportData.market.location.state}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setReportData({
                      ...reportData,
                      market: {
                        ...reportData.market,
                        location: {
                          ...reportData.market.location,
                          state: e.target.value,
                        },
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
                label="Price (₦)"
                type="number"
                value={reportData.price.current}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReportData({
                    ...reportData,
                    price: {
                      ...reportData.price,
                      current: Number(e.target.value),
                    },
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Quality</InputLabel>
                <Select
                  value={reportData.quality}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setReportData({ ...reportData, quality: e.target.value })
                  }
                >
                  {qualityOptions.map((quality) => (
                    <MenuItem key={quality} value={quality}>
                      {quality.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReportPrice} variant="contained">
            Report Price
          </Button>
        </DialogActions>
      </Dialog>

      {/* Price History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Price History</DialogTitle>
        <DialogContent>
          <Box height={400}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatPriceData(priceHistory)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={theme.palette.primary.main}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Forecast Dialog */}
      <Dialog
        open={forecastDialogOpen}
        onClose={() => setForecastDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Price Forecast</DialogTitle>
        <DialogContent>
          {forecast && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {forecast.crop.toUpperCase()} Price Forecast
              </Typography>

              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Current Price: ₦{forecast.currentPrice?.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Average Price: ₦{forecast.avgPrice?.toLocaleString()}
                </Typography>
              </Box>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>7-Day Forecast</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6" color="primary">
                    ₦{forecast.forecast?.next7Days?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Confidence: {forecast.forecast?.confidence}%
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>30-Day Forecast</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6" color="primary">
                    ₦{forecast.forecast?.next30Days?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Confidence: {forecast.forecast?.confidence}%
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Seasonal Forecast</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6" color="primary">
                    ₦{forecast.forecast?.nextSeason?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Based on historical seasonal patterns
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Forecasts are based on historical data and market trends.
                  Actual prices may vary due to various factors.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForecastDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MarketPricesPage;
