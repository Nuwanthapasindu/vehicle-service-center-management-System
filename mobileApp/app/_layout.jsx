import { useEffect } from "react";
import { Slot, useRouter } from "expo-router";

import { Provider } from "react-redux";
import Toast from "react-native-toast-message";

import { store } from "../store";
import storageKeys from "../constants/storageKeys";
import useAsyncStorage from "../hooks/useAsyncStorage";
import AuthProvider from "../context/AuthContext";

import setupAxios from "../services/axios.defaults";

export default function RootLayout() {
  setupAxios();
  const { readFromStorage } = useAsyncStorage();
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const value = await readFromStorage(storageKeys.HAS_VIEWED_ONBOARDING);
      if (value === "true") {
        router.replace("/(auth)/Login");
      }
    };
    checkOnboardingStatus();
  }, [router]);

  return (
    <Provider store={store}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
      <Toast />
    </Provider>
  );
}
