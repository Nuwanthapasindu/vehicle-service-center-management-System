import axios from "axios";
import store from "../store";
import { fetchUser } from "../store/slices/authSlice";
import storageKeys from "../constants/storageKeys";
import useSecureStorage from "../hooks/useSecureStorage";

async function tokenRefresh() {
  const {getItem,deleteItem} = useSecureStorage();
  const refreshToken = await  getItem(storageKeys.REFRESH_TOKEN);
  if (refreshToken) {
    try {
      const response = await axios.post("/auth/token-refresh", {
        refreshToken,
      });

      store.dispatch(fetchUser(response.data.payload.accessToken));
    } catch (error) {
      await deleteItem(storageKeys.REFRESH_TOKEN);
      await deleteItem(storageKeys.PERSONAL_ACCESS_TOKEN);
      store.dispatch(fetchUser(null));
    }
  }
}
export default tokenRefresh;