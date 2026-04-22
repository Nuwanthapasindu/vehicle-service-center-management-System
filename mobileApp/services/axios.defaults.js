import axios from "axios";
import tokenRefresh from "./tokenRefresh";
import storageKeys from "../constants/storageKeys";
import useSecureStorage from "../hooks/useSecureStorage";

const { getItem } = useSecureStorage();
axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
axios.defaults.timeout = 10000;
axios.interceptors.request.use(async (config) => {
  // GET PERSONAL ACCESS TOKEN
  const personalAccessToken = await getItem(storageKeys.PERSONAL_ACCESS_TOKEN);
  if (personalAccessToken) {
    config.headers.Authorization = `Bearer ${personalAccessToken}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      //   TOKEN REFRESH
      tokenRefresh();
    }
    return Promise.reject(error);
  }
);