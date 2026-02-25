import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Assuming your backend URL, change this if needed:
const BASE_URL = "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach access token to headers
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error("Error fetching access token from SecureStore", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle 401 Unauthorized errors and token refreshes
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry requests if they failed with a 401 and haven't already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (refreshToken) {
          // Send request to backend to refresh token
          const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            token: refreshToken,
          });

          // Update SecureStore with new tokens
          if (data.accessToken) {
            await SecureStore.setItemAsync("accessToken", data.accessToken);
            if (data.refreshToken) {
              await SecureStore.setItemAsync("refreshToken", data.refreshToken);
            }

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return axiosClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Refresh token failed, logging out...", refreshError);
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        // Handle global logout routing elsewhere via Redux state
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
