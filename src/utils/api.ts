import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (userData: any) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
};

export const weatherAPI = {
  getCurrentWeather: (location?: string) =>
    api.get(`/weather/current${location ? `?location=${location}` : ""}`),
  getForecast: (location?: string) =>
    api.get(`/weather/forecast${location ? `?location=${location}` : ""}`),
  getZones: () => api.get("/weather/zones"),
  getAlerts: () => api.get("/weather/alerts"),
  getFarmingCalendar: () => api.get("/weather/farming-calendar"),
};

export const cropsAPI = {
  diagnoseCrop: (imageData: FormData) =>
    api.post("/crops/diagnose", imageData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getDiagnoses: () => api.get("/crops/diagnoses"),
  getDiagnosis: (id: string) => api.get(`/crops/diagnoses/${id}`),
};

export const communityAPI = {
  getPosts: () => api.get("/community/posts"),
  createPost: (postData: any) => api.post("/community/posts", postData),
  getPost: (id: string) => api.get(`/community/posts/${id}`),
  addComment: (postId: string, content: string) =>
    api.post(`/community/posts/${postId}/comments`, { content }),
  likePost: (postId: string) => api.post(`/community/posts/${postId}/like`),
};

export const learningAPI = {
  getModules: () => api.get("/learning/modules"),
  getModule: (id: string) => api.get(`/learning/modules/${id}`),
  markProgress: (moduleId: string, progress: number) =>
    api.post(`/learning/modules/${moduleId}/progress`, { progress }),
  getProgress: () => api.get("/learning/progress"),
};

export default api;
