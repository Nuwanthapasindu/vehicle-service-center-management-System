import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import storageKeys from "../constants/storageKeys";
import { logout as reduxLogout } from "../store/slice/authSlice";

const initialAuthConfiguration = {
  isAuthenticated: false,
  profile: null,
  logout: () => {},
};

export const AuthContext = React.createContext(initialAuthConfiguration);

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  // Pluck the user and auth state directly from your newly created Redux slice. Fallback to empty object if state is rendering early.
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const logout = useCallback(async () => {
    try {
      // 1. Clear Mobile Storage (Tokens)
      await SecureStore.deleteItemAsync(storageKeys.PERSONAL_ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(storageKeys.REFRESH_TOKEN);

      // 2. Clear Redux State
      dispatch(reduxLogout());

      // 3. Navigate back to the unified Login Screen using Expo Router
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  }, [dispatch, router]);

  const memorizedContext = useMemo(
    () => ({
      isAuthenticated: isAuthenticated || !!user,
      profile: user,
      logout,
    }),
    [user, isAuthenticated, logout],
  );

  return (
    <AuthContext.Provider value={memorizedContext}>
      {children}
    </AuthContext.Provider>
  );
}
