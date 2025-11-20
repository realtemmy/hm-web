// API client with Axios and interceptors
import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/config/env";
import { API_TIMEOUT } from "@/config/constants";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies (refresh token) with every request
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token using the refresh token cookie
        const refreshToken = getRefreshToken();
        console.log("Refresh Token: ", refreshToken);
        if (refreshToken) {
          const response = await axios.post(
            `${env.apiBaseUrl}/user/auth/refresh`,
            {},
            {
              withCredentials: true, // Send refresh token cookie
            }
          );

          const { token } = response.data;

          // Update access token
          setAccessToken(token);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear auth state and redirect to login
        clearAuth();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        // Dispatch custom event to notify auth context
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export const setAccessToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem("accessToken");
    return;
  }
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  const name = "refresh_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  // Store refresh token with 1 day expiry
  document.cookie = `refresh_token=${token}; path=/; max-age=86400; SameSite=Strict`;
}

export function clearAuth(): void {
  // Clear access token from localStorage
  localStorage.removeItem("accessToken");

  // Clear refresh token cookie by setting max-age to 0
  if (typeof window !== "undefined") {
    document.cookie = "refresh_token=; path=/; max-age=0; SameSite=Strict";
  }
}

export default apiClient;
