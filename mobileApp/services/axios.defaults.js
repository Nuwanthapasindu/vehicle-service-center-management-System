import axios from "axios";
import useSecureStorage from "../hooks/useSecureStorage";
import storageKeys from "../constants/storageKeys";
import { refreshAccessToken } from "./tokenRefresh";

function setupAxios() {
  const { getItem } = useSecureStorage();
  axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  // Request Interceptor: Attach the current access token
  axios.interceptors.request.use(
    async (config) => {
      try {
        const accessToken = await getItem(storageKeys.PERSONAL_ACCESS_TOKEN);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Error fetching access token from SecureStore:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response Interceptor: Handle unauthenticated errors globally using secure refresh flow
  axios.interceptors.response.use(
    (response) => {
      // Forward standard valid responses
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Trigger retry flow only for 401s where token wasn't already retried
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Mark to prevent infinite loops

        try {
          // Fetch entirely new access token via tokenRefresh service logic
          const newAccessToken = await refreshAccessToken();

          // Update request specific header with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Return original request but process using new instance token
          return axios(originalRequest);
        } catch (refreshError) {
          // Invalid refresh token or server issues automatically rejected.
          return Promise.reject(refreshError);
        }
      }

      // Pass back remaining API-handled errors
      return Promise.reject(error);
    },
  );
}

export default setupAxios;
