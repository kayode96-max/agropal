import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// Types
interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: string;
  location: {
    state: string;
    localGovernment: string;
  };
  profile: {
    primaryCrops: string[];
    preferredLanguage: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  location: {
    state: string;
    localGovernment: string;
  };
  profile: {
    primaryCrops: string[];
    preferredLanguage: string;
  };
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Setup axios interceptor for auth token
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setToken(authToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    }

    // Check if user is authenticated on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        const response = await api.get("/auth/me");
        setUser(response.data.user);
        setToken(authToken);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("authToken");
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: authToken, user: userData } = response.data;

      setToken(authToken);
      setUser(userData);
      localStorage.setItem("authToken", authToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { token: authToken, user: newUser } = response.data;

      setToken(authToken);
      setUser(newUser);
      localStorage.setItem("authToken", authToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    delete api.defaults.headers.common["Authorization"];
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the api instance for use in other components
export { api };
