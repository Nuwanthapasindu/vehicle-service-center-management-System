import { useEffect } from "react";
import { Slot, useRouter } from "expo-router";

import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system/legacy";

import store, { storeSubscribe } from "../store";
import tokenRefresh from "../services/tokenRefresh";
import storageKeys from "../constants/storageKeys";
import useAsyncStorage from "../hooks/useAsyncStorage";
import AuthProvider from "../context/AuthContext";
import "../services/axios.defaults";

storeSubscribe();
tokenRefresh();

const UPLOAD_DIR = FileSystem.documentDirectory + "uploads/";

export async function ensureUploadDir() {
  const dirInfo = await FileSystem.getInfoAsync(UPLOAD_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(UPLOAD_DIR, { intermediates: true });
  }
}

export default function RootLayout() {
  const { readFromStorage } = useAsyncStorage();
  const router = useRouter();
  useEffect(() => {
    ensureUploadDir();
  }, []);
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
