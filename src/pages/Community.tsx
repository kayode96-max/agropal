import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Pagination,
  InputAdornment,
  Fab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  Comment,
  Add,
  Search,
  LocationOn,
  AccessTime,
  Verified,
  Warning,
  HelpOutline,
  Translate,
  TrendingUp,
  Agriculture,
  GroupWork,
} from "@mui/icons-material";
import axios from "axios";

interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: string;
  location: string;
  createdAt: string;
  votes: number;
  replies: Reply[];
  tags: string[];
  category: string;
  cropType?: string;
  language?: string;
  aiModeration: {
    status: string;
    confidence: number;
  };
}

interface Reply {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  votes: number;
  aiTag: string;
  language?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface NigerianState {
  code: string;
  name: string;
  zone: string;
  crops: string[];
}

const Community: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [sortBy, setSortBy] = useState("recent");
  const [tabValue, setTabValue] = useState(0);

  // Nigerian-specific data
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<NigerianState[]>([]);
  const [trending, setTrending] = useState<any[]>([]);

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    cropType: "",
    tags: "",
    location: "",
    language: "en",
  });
  const [newReply, setNewReply] = useState("");

  // Nigerian crops list
  const nigerianCrops = [
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
  ];

  // Language options
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ha", name: "Hausa", flag: "🇳🇬" },
    { code: "ig", name: "Igbo", flag: "🇳🇬" },
    { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, statesRes, trendingRes] = await Promise.all([
          axios.get("http://localhost:5000/api/community/categories"),
          axios.get("http://localhost:5000/api/community/states"),
          axios.get("http://localhost:5000/api/community/trending"),
        ]);

        if (categoriesRes.data.success)
          setCategories(categoriesRes.data.categories);
        if (statesRes.data.success) setStates(statesRes.data.states);
        if (trendingRes.data.success) setTrending(trendingRes.data.trending);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/community/posts",
        {
          params: {
            page: currentPage,
            limit: 10,
            search: searchTerm,
            category: selectedCategory,
            state: selectedState,
            cropType: selectedCrop,
            language: selectedLanguage,
            sortBy,
          },
        }
      );

      if (response.data.success) {
        setPosts(response.data.posts);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    selectedState,
    selectedCrop,
    selectedLanguage,
    sortBy,
  ]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleVote = async (postId: number, type: "up" | "down") => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/community/posts/${postId}/vote`,
        {
          type,
        }
      );

      if (response.data.success) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, votes: response.data.votes } : post
          )
        );
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/community/posts",
        {
          ...newPost,
          tags: newPost.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        },
        {
          headers: {
            "user-id": "current-user-id", // Replace with actual user ID
          },
        }
      );

      if (response.data.success) {
        setPosts((prev) => [response.data.post, ...prev]);
        setNewPost({
          title: "",
          content: "",
          category: "",
          cropType: "",
          tags: "",
          location: "",
          language: "en",
        });
        setNewPostOpen(false);

        // Show success message
        if (response.data.post.aiModeration?.status === "flagged") {
          alert(
            "Post submitted for review. It will be published after moderation."
          );
        }
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleAddReply = async () => {
    if (!selectedPost || !newReply.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/community/posts/${selectedPost.id}/reply`,
        {
          content: newReply,
          language: selectedLanguage,
        },
        {
          headers: {
            "user-id": "current-user-id", // Replace with actual user ID
          },
        }
      );

      if (response.data.success) {
        setSelectedPost((prev) =>
          prev
            ? {
                ...prev,
                replies: [...prev.replies, response.data.reply],
              }
            : null
        );
        setNewReply("");
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const getAiTagColor = (tag: string) => {
    switch (tag) {
      case "verified":
        return "success";
      case "helpful":
        return "info";
      case "needs_verification":
        return "warning";
      default:
        return "default";
    }
  };

  const getAiTagIcon = (tag: string) => {
    switch (tag) {
      case "verified":
        return <Verified fontSize="small" />;
      case "helpful":
        return <ThumbUp fontSize="small" />;
      case "needs_verification":
        return <Warning fontSize="small" />;
      default:
        return <HelpOutline fontSize="small" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
        🤝 Nigerian Farmers Community
      </Typography>
      <Typography
        variant="h6"
        textAlign="center"
        color="textSecondary"
        sx={{ mb: 4 }}
      >
        Connect with fellow Nigerian farmers, share knowledge, and grow together
        🇳🇬
      </Typography>

      {/* Language Selector */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Language / Harshe / Asụsụ / Ede</InputLabel>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            startAdornment={<Translate sx={{ mr: 1 }} />}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<GroupWork />} label="All Posts" />
          <Tab icon={<TrendingUp />} label="Trending" />
          <Tab icon={<Agriculture />} label="My Crops" />
        </Tabs>
      </Paper>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search posts... / Neman rubutu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <MenuItem value="">All States</MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.code} value={state.code}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Crop</InputLabel>
              <Select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <MenuItem value="">All Crops</MenuItem>
                {nigerianCrops.map((crop) => (
                  <MenuItem key={crop} value={crop}>
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNewPostOpen(true)}
              sx={{ height: 56 }}
            >
              Ask Question
            </Button>
          </Grid>
        </Grid>

        {/* Sort Options */}
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            variant={sortBy === "recent" ? "contained" : "outlined"}
            size="small"
            onClick={() => setSortBy("recent")}
          >
            Recent
          </Button>
          <Button
            variant={sortBy === "popular" ? "contained" : "outlined"}
            size="small"
            onClick={() => setSortBy("popular")}
          >
            Popular
          </Button>
          <Button
            variant={sortBy === "votes" ? "contained" : "outlined"}
            size="small"
            onClick={() => setSortBy("votes")}
          >
            Most Voted
          </Button>
        </Box>
      </Paper>

      {/* Trending Topics Sidebar */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            🔥 Trending Topics
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {trending.map((item, index) => (
              <Chip
                key={index}
                label={`${item.tag} (${item.count})`}
                color="primary"
                variant="outlined"
                onClick={() => setSearchTerm(item.tag)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Posts List */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Typography textAlign="center">Loading posts...</Typography>
        ) : posts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              No posts found
            </Typography>
            <Typography color="textSecondary">
              Be the first to start a discussion!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNewPostOpen(true)}
              sx={{ mt: 2 }}
            >
              Create First Post
            </Button>
          </Paper>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              sx={{ mb: 3, cursor: "pointer" }}
              onClick={() => setSelectedPost(post)}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                    {post.author.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {post.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        by {post.author}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="textSecondary">
                          {post.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="textSecondary">
                          {formatTimeAgo(post.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {post.content.length > 150
                        ? `${post.content.substring(0, 150)}...`
                        : post.content}
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                    >
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(post.id, "up");
                        }}
                      >
                        <ThumbUp fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ mx: 1 }}>
                        {post.votes}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(post.id, "down");
                        }}
                      >
                        <ThumbDown fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Comment fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {post.replies.length} replies
                      </Typography>
                    </Box>
                  </Box>

                  {post.aiModeration.status === "approved" && (
                    <Chip
                      icon={<Verified />}
                      label="AI Verified"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => setNewPostOpen(true)}
      >
        <Add />
      </Fab>

      {/* Post Detail Dialog */}
      <Dialog
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPost && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                  {selectedPost.author.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedPost.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    by {selectedPost.author} • {selectedPost.location} •{" "}
                    {formatTimeAgo(selectedPost.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedPost.content}
              </Typography>

              <Box sx={{ mb: 3 }}>
                {selectedPost.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom fontWeight="bold">
                Replies ({selectedPost.replies.length})
              </Typography>

              {selectedPost.replies.map((reply) => (
                <Card key={reply.id} sx={{ mb: 2, bgcolor: "grey.50" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {reply.author}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="caption" color="textSecondary">
                          {formatTimeAgo(reply.createdAt)}
                        </Typography>
                        <Chip
                          icon={getAiTagIcon(reply.aiTag)}
                          label={reply.aiTag.replace("_", " ")}
                          size="small"
                          color={getAiTagColor(reply.aiTag) as any}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2">{reply.content}</Typography>
                  </CardContent>
                </Card>
              ))}

              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add your reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setSelectedPost(null)}>Close</Button>
              <Button
                variant="contained"
                onClick={handleAddReply}
                disabled={!newReply.trim()}
              >
                Add Reply
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Post Dialog */}
      <Dialog
        open={newPostOpen}
        onClose={() => setNewPostOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Ask the Community a Question</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Ask your fellow Nigerian farmers for advice. All posts are moderated
            by AI to ensure helpful and safe content.
          </Alert>

          <TextField
            fullWidth
            label="Question Title"
            value={newPost.title}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, title: e.target.value }))
            }
            margin="normal"
            placeholder="e.g., Best cassava varieties for Lagos State?"
          />

          <TextField
            fullWidth
            label="Detailed Question"
            multiline
            rows={4}
            value={newPost.content}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, content: e.target.value }))
            }
            margin="normal"
            placeholder="Describe your farming challenge or question in detail..."
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Crop Type (if applicable)</InputLabel>
                <Select
                  value={newPost.cropType}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      cropType: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">Not crop-specific</MenuItem>
                  {nigerianCrops.map((crop) => (
                    <MenuItem key={crop} value={crop}>
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Your Location (State, LGA)"
            value={newPost.location}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, location: e.target.value }))
            }
            margin="normal"
            placeholder="e.g., Lagos, Ikorodu"
          />

          <TextField
            fullWidth
            label="Tags (comma separated)"
            value={newPost.tags}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, tags: e.target.value }))
            }
            margin="normal"
            placeholder="e.g., cassava, disease, organic farming"
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={newPost.language}
              onChange={(e) =>
                setNewPost((prev) => ({ ...prev, language: e.target.value }))
              }
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPostOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreatePost}
            disabled={!newPost.title.trim() || !newPost.content.trim()}
          >
            Post Question
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Community;
