import React, { useState, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  CloudUpload,
  Camera,
  CheckCircle,
  Warning,
  Healing,
  LocationOn,
  Agriculture,
  ExpandMore,
  Spa,
  LocalFlorist,
} from "@mui/icons-material";
import { cropsAPI } from "../utils/api";

interface DiagnosisResult {
  success: boolean;
  diagnosisId: string;
  diagnosis: {
    disease: string;
    confidence: number;
    description: string;
    severity: string;
    possibleCauses: string[];
  };
  treatment: {
    immediate: string[];
    longTerm: string[];
    organic: string[];
    chemical: string[];
    traditional: string[];
  };
  recommendations: string[];
  economicImpact: string;
  locationContext?: {
    zone: string;
    suitableCrops: string[];
    plantingSeason: any;
  };
  supportContact: {
    message: string;
    phone: string;
    whatsapp: string;
  };
}

const CropDiagnosis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [location, setLocation] = useState("");
  const [cropType, setCropType] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [growthStage, setGrowthStage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    if (!cropType) {
      setError("Please select the crop type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("location", JSON.stringify({ state: location }));
      formData.append("cropType", cropType);
      formData.append("symptoms", symptoms);
      formData.append("plantingDate", plantingDate);
      formData.append("growthStage", growthStage);
      formData.append("userId", "current-user-id"); // Replace with actual user ID

      const response = await cropsAPI.diagnoseCrop(formData);

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.message || "Failed to analyze image");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to analyze image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "error";
      case "moderate":
      case "medium":
        return "warning";
      case "low":
      case "mild":
        return "info";
      case "none":
        return "success";
      default:
        return "default";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return <Warning color="error" />;
      case "moderate":
      case "medium":
        return <Warning color="warning" />;
      case "low":
      case "mild":
        return <CheckCircle color="info" />;
      case "none":
        return <CheckCircle color="success" />;
      default:
        return <CheckCircle />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        textAlign="center"
        gutterBottom
        fontWeight="bold"
      >
        🔬 AI Crop Disease Diagnosis
      </Typography>
      <Typography
        variant="h6"
        textAlign="center"
        color="textSecondary"
        sx={{ mb: 4 }}
      >
        Upload a photo of your crop to get instant AI-powered disease diagnosis
      </Typography>

      <Grid container spacing={4}>
        {/* Upload Section */}
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3, height: "fit-content" }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Upload Crop Image
            </Typography>

            {/* Additional Info Form */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <LocationOn sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Crop Type (optional)"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                margin="normal"
                variant="outlined"
                placeholder="e.g., Tomato, Maize, Bean"
                InputProps={{
                  startAdornment: (
                    <Agriculture sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Symptoms (optional)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                margin="normal"
                variant="outlined"
                multiline
                rows={2}
                placeholder="Describe what you observe..."
              />
              <TextField
                fullWidth
                label="Planting Date (optional)"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                margin="normal"
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Growth Stage (optional)"
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                margin="normal"
                variant="outlined"
                placeholder="e.g., Seedling, Flowering, Fruiting"
                InputProps={{
                  startAdornment: (
                    <Spa sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
            </Box>

            {/* File Upload Area */}
            <Box
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed",
                borderColor: selectedFile ? "primary.main" : "grey.300",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: selectedFile ? "primary.50" : "grey.50",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.50",
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: "none" }}
              />

              {previewUrl ? (
                <Box>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                  />
                  <Typography variant="body2" color="primary">
                    Click to change image
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUpload
                    sx={{ fontSize: 48, color: "grey.400", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Drag & drop an image here
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    or click to browse files
                  </Typography>
                  <Button variant="outlined" startIcon={<Camera />}>
                    Choose Image
                  </Button>
                </Box>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              sx={{ mt: 3 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Analyzing Image...
                </>
              ) : (
                "Analyze Crop"
              )}
            </Button>
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid xs={12} md={6}>
          {result ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                📋 Diagnosis Results
              </Typography>

              <Card
                sx={{
                  mb: 3,
                  border: "2px solid",
                  borderColor: `${getSeverityColor(
                    result.diagnosis.severity
                  )}.main`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {getSeverityIcon(result.diagnosis.severity)}
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
                      {result.diagnosis.disease}
                    </Typography>
                    <Chip
                      label={`${Math.round(
                        result.diagnosis.confidence * 100
                      )}% confidence`}
                      color="primary"
                      size="small"
                      sx={{ ml: "auto" }}
                    />
                  </Box>

                  <Chip
                    label={`${result.diagnosis.severity} severity`}
                    color={getSeverityColor(result.diagnosis.severity) as any}
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body1" paragraph>
                    {result.diagnosis.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Healing sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight="bold">
                      Treatment Options
                    </Typography>
                  </Box>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1">
                        Immediate Treatment
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {result.treatment.immediate.map((treatment, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText primary={treatment} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1">
                        Long-term Management
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {result.treatment.longTerm.map((treatment, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <LocalFlorist color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={treatment} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1">
                        Organic Options
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {result.treatment.organic.map((treatment, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Spa color="success" />
                            </ListItemIcon>
                            <ListItemText primary={treatment} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>

              {result.recommendations && result.recommendations.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      📝 Recommendations
                    </Typography>
                    <List dense>
                      {result.recommendations.map((recommendation, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={recommendation} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              <Camera sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                Upload an image to see diagnosis
              </Typography>
              <Typography variant="body2">
                Our AI will analyze your crop photo and provide detailed
                diagnosis results
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CropDiagnosis;
