import axios from "axios";
import * as SecureStore from "expo-secure-store";
import storageKeys from "../constants/storageKeys";

export const refreshAccessToken = async () => {
  try {
    const currentRefreshToken = await SecureStore.getItemAsync(
      storageKeys.REFRESH_TOKEN,
    );
    // Call the token refresh endpoint natively using standard axios to avoid cyclic interceptors
    const response = await axios.post(`/auth/token-refresh`, {
      refreshToken: currentRefreshToken,
    });

    const { payload } = response.data;

    if (payload?.accessToken) {
      // Safely persist the new tokens to Secure Store
      await SecureStore.setItemAsync(
        storageKeys.PERSONAL_ACCESS_TOKEN,
        payload.accessToken,
      );
      return payload.accessToken;
    }
  } catch (error) {

    // Failed token refresh implies current session is entirely revoked or expired. Clear secured items.
    await SecureStore.deleteItemAsync(storageKeys.PERSONAL_ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(storageKeys.REFRESH_TOKEN);

    // Clear React app Redux state globally to immediately drop rendering user views
    // Lazy require to avoid importing 'store' globally which throws circular dependency loops
    const { store } = require("../store");
    const { logout } = require("../store/slice/authSlice");
    store.dispatch(logout());

    throw error;
  }
};
