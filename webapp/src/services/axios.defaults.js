import axios from "axios";
import tokenRefresh from "./tokenRefresh";
import { CONFIGURATION } from "../constants/enum";


axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.timeout = 10000;
axios.interceptors.request.use((config) => {
  // GET PERSONAL ACCESS TOKEN
  const personalAccessToken = sessionStorage.getItem(CONFIGURATION.ACCESS_TOKEN_KEY);
  config.headers.Authorization = `Bearer ${personalAccessToken}`;
  return config;
});
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      //   TOKEN REFRESH
      tokenRefresh();
    }
    return Promise.reject(error);
  }
);
