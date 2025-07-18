import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  Chip,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Mic,
  MicOff,
  Send,
  VolumeUp,
  Agriculture,
  Psychology,
} from "@mui/icons-material";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  language?: string;
}

// Helper function to get language codes
const getLanguageCode = (lang: string) => {
  const langMap: { [key: string]: string } = {
    en: "en-US",
    ha: "ha-NG",
    ig: "ig-NG",
    yo: "yo-NG",
  };
  return langMap[lang] || "en-US";
};

const VoiceChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ha", name: "Hausa", flag: "🇳🇬" },
    { code: "ig", name: "Igbo", flag: "🇳🇬" },
    { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  ];

  const addMessage = useCallback((
    text: string,
    sender: "user" | "ai",
    language?: string
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      language,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Check if speech recognition is supported
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechSupported(true);
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getLanguageCode(selectedLanguage);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [selectedLanguage]);

  useEffect(() => {
    // Add welcome message only once
    addMessage(
      "Welcome to Agropal Voice Assistant! I can help you with farming questions in multiple Nigerian languages. How can I assist you today?",
      "ai"
    );
  }, [addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(selectedLanguage);
    }
  }, [selectedLanguage]);

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setError(null);
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      setError("Speech recognition is not supported in your browser");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage(text, "user", selectedLanguage);
    setInputText("");
    setIsLoading(true);
    setError(null);

    try {
      // Simulate AI processing with Nigerian agricultural context
      const response = await simulateAIResponse(text, selectedLanguage);
      addMessage(response, "ai", selectedLanguage);
    } catch (err) {
      setError("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (
    input: string,
    language: string
  ): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lowerInput = input.toLowerCase();

    // Nigerian agricultural knowledge base
    if (lowerInput.includes("rice") || lowerInput.includes("rice farming")) {
      return language === "ha"
        ? "Shinkafan ya fi dacewa a lokacin damina. Ka tabbata ka yi amfani da iri mai kyau kuma ka kiyaye ruwa sosai."
        : "Rice farming in Nigeria is best during rainy season (May-October). Use certified seeds, maintain proper water levels, and watch for blast disease. Popular varieties include FARO-44 and NERICA.";
    }

    if (lowerInput.includes("yam") || lowerInput.includes("yam cultivation")) {
      return language === "yo"
        ? "Isu ni ọkan ninu awọn ọja to ṣe pataki ni Nigeria. E gbin ni February si March, ki e si ko nipa awọn ọna lati dena arun."
        : "Yam is a major crop in Nigeria. Plant during February-March dry season. Use disease-free sets, practice crop rotation, and harvest after 9-12 months.";
    }

    if (lowerInput.includes("weather") || lowerInput.includes("climate")) {
      return "Current weather conditions vary across Nigeria. Northern states are experiencing dry season while southern states have higher humidity. Check specific forecasts for your location.";
    }

    if (lowerInput.includes("disease") || lowerInput.includes("pest")) {
      return "Common crop diseases in Nigeria include cassava mosaic virus, rice blast, and yam anthracnose. Upload crop images in our diagnosis section for specific identification and treatment.";
    }

    if (lowerInput.includes("fertilizer") || lowerInput.includes("manure")) {
      return "Use both organic and inorganic fertilizers. NPK 20-10-10 is good for most crops. Apply organic manure 2-3 weeks before planting. Soil testing helps determine specific needs.";
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question about farming. Could you be more specific about the crop or farming practice you're asking about?",
      "I can help you with information about Nigerian agriculture, crops, weather, and farming techniques. What would you like to know?",
      "For detailed crop diagnosis, you can upload images in our diagnosis section. Is there something specific about farming I can help you with?",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(selectedLanguage);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processMessage(inputText);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Psychology sx={{ mr: 1, verticalAlign: "middle" }} />
          Voice Assistant for Nigerian Farmers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get farming advice in your preferred language - English, Hausa, Igbo,
          or Yoruba
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!speechSupported && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Speech recognition is not supported in your browser. You can still
          type your questions.
        </Alert>
      )}

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={selectedLanguage}
              label="Language"
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Chip
            icon={<Agriculture />}
            label="Nigerian Agriculture"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Box
          sx={{
            height: 400,
            overflowY: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            p: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: "column",
                  alignItems:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  py: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: "80%",
                    backgroundColor:
                      message.sender === "user" ? "primary.light" : "grey.100",
                    color: message.sender === "user" ? "white" : "text.primary",
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                    {message.sender === "ai" && (
                      <IconButton
                        size="small"
                        onClick={() => speakText(message.text)}
                        sx={{ color: "inherit", opacity: 0.7 }}
                      >
                        <VolumeUp fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Paper>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem
                sx={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <Paper elevation={1} sx={{ p: 2, backgroundColor: "grey.100" }}>
                  <Typography variant="body1">AI is thinking...</Typography>
                </Paper>
              </ListItem>
            )}
          </List>
          <div ref={messagesEndRef} />
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask about farming in ${
                languages.find((l) => l.code === selectedLanguage)?.name
              }...`}
              disabled={isLoading}
            />

            {speechSupported && (
              <IconButton
                color={isListening ? "secondary" : "primary"}
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                sx={{ mb: 1 }}
              >
                {isListening ? <MicOff /> : <Mic />}
              </IconButton>
            )}

            <Button
              type="submit"
              variant="contained"
              endIcon={<Send />}
              disabled={!inputText.trim() || isLoading}
              sx={{ mb: 1 }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, backgroundColor: "grey.50" }}>
        <Typography variant="h6" gutterBottom>
          🌾 Sample Questions
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {[
            "How to grow rice in Nigeria?",
            "Best time for yam planting?",
            "Weather forecast for farming",
            "Common crop diseases",
            "Fertilizer recommendations",
          ].map((question) => (
            <Chip
              key={question}
              label={question}
              onClick={() => setInputText(question)}
              clickable
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default VoiceChat;
