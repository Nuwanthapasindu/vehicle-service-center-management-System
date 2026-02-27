import axios from "axios";
import store from "../store";
import { fetchUser } from "../store/slices/authSlice";
import { CONFIGURATION } from "../constants/enum";

async function tokenRefresh() {
  const refreshToken = localStorage.getItem(CONFIGURATION.REFRESH_TOKEN_KEY);
  if (refreshToken) {
    try {
      const response = await axios.post("/auth/token-refresh", {
        refreshToken,
      });

      store.dispatch(fetchUser(response.data.payload.accessToken));
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      localStorage.removeItem(CONFIGURATION.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(CONFIGURATION.ACCESS_TOKEN_KEY);
      store.dispatch(fetchUser(null));
    }
  }
}
export default tokenRefresh;
