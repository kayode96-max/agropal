import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  LinearProgress,
  Alert,
  IconButton,
  Collapse,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  Paper,
} from "@mui/material";
import {
  PlayArrow,
  School,
  CheckCircle,
  Star,
  QuestionAnswer,
  ExpandMore,
  ExpandLess,
  Language,
  Agriculture,
  MenuBook,
  Timer,
  Download,
} from "@mui/icons-material";
import axios from "axios";

interface Module {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  language: string;
  videoUrl: string;
  thumbnailUrl: string;
  rating?: number;
  enrollments?: number;
  completed?: boolean;
  topics: string[];
  targetAudience: string[];
  resources: Array<{
    type: string;
    title: string;
    url: string;
    language: string;
  }>;
}

interface Quiz {
  _id: string;
  moduleId: string;
  title: string;
  questions: Array<{
    _id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
}

interface UserProgress {
  moduleId: string;
  completed: boolean;
  score?: number;
  lastAccessed: string;
  timeSpent?: number;
  certificateEarned?: boolean;
}

const Learning: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "crop-production", label: "Crop Production" },
    { value: "livestock", label: "Livestock" },
    { value: "disease-management", label: "Disease Management" },
    { value: "water-management", label: "Water Management" },
    { value: "pest-control", label: "Pest Control" },
    { value: "soil-health", label: "Soil Health" },
    { value: "business", label: "Agribusiness" },
    { value: "technology", label: "Farm Technology" },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "ha", label: "Hausa" },
    { value: "ig", label: "Igbo" },
    { value: "yo", label: "Yoruba" },
  ];

  useEffect(() => {
    fetchModules();
    fetchProgress();
  }, [selectedCategory, selectedLanguage]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (selectedLanguage !== "en") params.language = selectedLanguage;

      const response = await axios.get("/api/learning/modules", { params });
      setModules(response.data.data || []);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch modules:", err);
      setError(
        err.response?.data?.message || "Failed to load learning modules"
      );

      // Fallback to mock data for development
      const mockModules: Module[] = [
        {
          _id: "1",
          title: "Introduction to Maize Farming in Nigeria",
          description:
            "Learn the basics of growing maize in Nigerian climate conditions, from seed selection to harvest.",
          category: "crop-production",
          level: "beginner",
          duration: 45,
          language: selectedLanguage,
          videoUrl: "https://example.com/maize-farming.mp4",
          thumbnailUrl: "/images/maize-farming.jpg",
          rating: 4.8,
          enrollments: 1250,
          completed: false,
          topics: [
            "Seed Selection",
            "Land Preparation",
            "Planting",
            "Pest Control",
            "Harvesting",
          ],
          targetAudience: ["Smallholder Farmers", "New Farmers"],
          resources: [
            {
              type: "pdf",
              title: "Maize Farming Guide",
              url: "/resources/maize-guide.pdf",
              language: "en",
            },
          ],
        },
        {
          _id: "2",
          title: "Cassava Production and Processing",
          description:
            "Comprehensive guide to cassava farming, from planting to processing for maximum yield and profit.",
          category: "crop-production",
          level: "intermediate",
          duration: 60,
          language: selectedLanguage,
          videoUrl: "https://example.com/cassava-production.mp4",
          thumbnailUrl: "/images/cassava-production.jpg",
          rating: 4.6,
          enrollments: 890,
          completed: true,
          topics: [
            "Cassava Varieties",
            "Processing Techniques",
            "Value Addition",
            "Market Access",
          ],
          targetAudience: ["Commercial Farmers", "Processors"],
          resources: [
            {
              type: "video",
              title: "Cassava Processing Demo",
              url: "/resources/cassava-processing.mp4",
              language: "en",
            },
          ],
        },
        {
          _id: "3",
          title: "Sustainable Farming Practices",
          description:
            "Learn eco-friendly farming methods that improve soil health and increase long-term productivity.",
          category: "soil-health",
          level: "beginner",
          duration: 35,
          language: selectedLanguage,
          videoUrl: "https://example.com/sustainable-farming.mp4",
          thumbnailUrl: "/images/sustainable-farming.jpg",
          rating: 4.9,
          enrollments: 2100,
          completed: false,
          topics: [
            "Crop Rotation",
            "Organic Fertilizers",
            "Conservation Agriculture",
          ],
          targetAudience: ["All Farmers", "Agricultural Students"],
          resources: [
            {
              type: "audio",
              title: "Sustainable Farming Podcast",
              url: "/resources/sustainable-farming.mp3",
              language: "en",
            },
          ],
        },
      ];
      setModules(mockModules);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      // This would fetch user progress from backend
      // For now, using mock data
      const mockProgress: UserProgress[] = [
        {
          moduleId: "2",
          completed: true,
          score: 85,
          lastAccessed: "2025-07-05",
          timeSpent: 3600,
          certificateEarned: true,
        },
      ];
      setProgress(mockProgress);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  };

  const fetchQuiz = async (moduleId: string) => {
    try {
      const response = await axios.get(`/api/learning/quiz/${moduleId}`);
      setCurrentQuiz(response.data.data);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
    } catch (err) {
      console.error("Error fetching quiz:", err);
      // Mock quiz for development
      const mockQuiz: Quiz = {
        _id: "quiz1",
        moduleId: moduleId,
        title: "Maize Farming Quiz",
        questions: [
          {
            _id: "q1",
            question: "What is the best time to plant maize in Nigeria?",
            options: [
              "Dry season (November - March)",
              "Early rainy season (April - June)",
              "Late rainy season (July - September)",
              "Any time of the year",
            ],
            correctAnswer: 1,
            explanation:
              "The early rainy season provides optimal moisture conditions for maize germination and growth.",
          },
          {
            _id: "q2",
            question:
              "Which maize variety is most suitable for Nigerian conditions?",
            options: [
              "Temperate varieties",
              "Tropical varieties",
              "Arctic varieties",
              "Desert varieties",
            ],
            correctAnswer: 1,
            explanation:
              "Tropical varieties are adapted to Nigerian climate and soil conditions.",
          },
        ],
      };
      setCurrentQuiz(mockQuiz);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
    }
  };

  const handleStartModule = (module: Module) => {
    setSelectedModule(module);
  };

  const handleTakeQuiz = (moduleId: string) => {
    fetchQuiz(moduleId);
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;

    let correctAnswers = 0;
    currentQuiz.questions.forEach((question) => {
      if (quizAnswers[question._id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round(
      (correctAnswers / currentQuiz.questions.length) * 100
    );
    setQuizScore(score);
    setQuizSubmitted(true);

    // Update progress
    // In real app, this would be sent to backend
  };

  const getModuleProgress = (moduleId: string): UserProgress | undefined => {
    return progress.find((p) => p.moduleId === moduleId);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "error";
      default:
        return "primary";
    }
  };

  const filteredModules = modules.filter((module) => {
    if (selectedCategory !== "all" && module.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          🎓 Nigerian Agricultural Learning Hub
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Master modern farming techniques with courses designed for Nigerian
          farmers
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          📚 Filter Courses
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={selectedLanguage}
                label="Language"
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    <Language sx={{ mr: 1 }} />
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
            Loading learning modules...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Modules Grid */}
      <Grid container spacing={3}>
        {filteredModules.map((module) => {
          const moduleProgress = getModuleProgress(module._id);
          const isCompleted = moduleProgress?.completed || false;

          return (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={module._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={module.thumbnailUrl || "/images/default-course.jpg"}
                  alt={module.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    {isCompleted && (
                      <CheckCircle sx={{ color: "success.main", mr: 1 }} />
                    )}
                    <Chip
                      label={module.level}
                      size="small"
                      color={getLevelColor(module.level) as any}
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={module.category.replace("-", " ")}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {module.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    {module.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Timer
                        sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {module.duration} min
                      </Typography>
                    </Box>
                    {module.rating && (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Star
                          sx={{ fontSize: 16, mr: 0.5, color: "warning.main" }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {module.rating}
                        </Typography>
                      </Box>
                    )}
                    {module.enrollments && (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <School
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {module.enrollments}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Module Topics */}
                  <Box sx={{ mb: 2 }}>
                    <IconButton
                      onClick={() =>
                        setExpandedModule(
                          expandedModule === module._id ? null : module._id
                        )
                      }
                      size="small"
                    >
                      <MenuBook sx={{ mr: 1 }} />
                      <Typography variant="body2">Topics</Typography>
                      {expandedModule === module._id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                    <Collapse in={expandedModule === module._id}>
                      <Box sx={{ mt: 1 }}>
                        {module.topics.map((topic, index) => (
                          <Chip
                            key={index}
                            label={topic}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Collapse>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={() => handleStartModule(module)}
                      size="small"
                      sx={{ flexGrow: 1 }}
                    >
                      {isCompleted ? "Review" : "Start"}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<QuestionAnswer />}
                      onClick={() => handleTakeQuiz(module._id)}
                      size="small"
                    >
                      Quiz
                    </Button>
                  </Box>

                  {/* Progress Bar */}
                  {moduleProgress && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Progress: {moduleProgress.score || 0}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={moduleProgress.score || 0}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Module Detail Dialog */}
      <Dialog
        open={!!selectedModule}
        onClose={() => setSelectedModule(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedModule && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Agriculture color="primary" />
                {selectedModule.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedModule.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Resources:
              </Typography>
              {selectedModule.resources.map((resource, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <Download sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2">
                    {resource.title} ({resource.type.toUpperCase()})
                  </Typography>
                </Box>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedModule(null)}>Close</Button>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                href={selectedModule.videoUrl}
                target="_blank"
              >
                Watch Video
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog
        open={!!currentQuiz}
        onClose={() => setCurrentQuiz(null)}
        maxWidth="sm"
        fullWidth
      >
        {currentQuiz && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <QuestionAnswer color="primary" />
                {currentQuiz.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              {!quizSubmitted ? (
                <>
                  {currentQuiz.questions.map((question, index) => (
                    <Box key={question._id} sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {index + 1}. {question.question}
                      </Typography>
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={quizAnswers[question._id] ?? ""}
                          onChange={(e) =>
                            handleQuizAnswer(
                              question._id,
                              parseInt(e.target.value)
                            )
                          }
                        >
                          {question.options.map((option, optionIndex) => (
                            <FormControlLabel
                              key={optionIndex}
                              value={optionIndex}
                              control={<Radio />}
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  ))}
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {quizScore}%
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {(quizScore ?? 0) >= 70
                      ? "Congratulations! 🎉"
                      : "Keep Learning! 📚"}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {(quizScore ?? 0) >= 70
                      ? "You've successfully completed this quiz!"
                      : "You can retake the quiz to improve your score."}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCurrentQuiz(null)}>Close</Button>
              {!quizSubmitted ? (
                <Button
                  variant="contained"
                  onClick={handleSubmitQuiz}
                  disabled={
                    Object.keys(quizAnswers).length !==
                    currentQuiz.questions.length
                  }
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                    setQuizScore(null);
                  }}
                >
                  Retake Quiz
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Learning;
