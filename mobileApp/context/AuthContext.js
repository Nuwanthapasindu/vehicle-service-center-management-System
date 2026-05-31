import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import storageKeys from "../constants/storageKeys";
import useSecureStorage from "../hooks/useSecureStorage";
import { setToken, setUser } from "../store/slices/authSlice";
import {
  registerBackgroundNotificationTask,
  unregisterBackgroundNotificationTask,
} from "../utils/backgroundWorker";

const initialAuthConfiguration = {
  isAuthenticated: false,
  profile: null,
  logout: () => {},
};

export const AuthContext = React.createContext(initialAuthConfiguration);

export default function AuthProvider({ children }) {
  const { deleteItem } = useSecureStorage();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      registerBackgroundNotificationTask();
    } else {
      unregisterBackgroundNotificationTask();
    }
  }, [user]);

  const logout = useCallback(async () => {
    await deleteItem(storageKeys.PERSONAL_ACCESS_TOKEN);
    await deleteItem(storageKeys.REFRESH_TOKEN);
    dispatch(setToken(null));
    dispatch(setUser(null));
    router.replace("/(auth)/Login");
  }, [dispatch, router]);

  const memorizedAuthContextValue = useMemo(() => {
    return {
      isAuthenticated: !!user,
      profile: user,
      logout,
    };
  }, [user, logout]);

  return (
    <AuthContext.Provider value={memorizedAuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

