import { useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import useAsyncStorage from "../hooks/useAsyncStorage";
import storageKeys from "../constants/storageKeys";

import { Provider } from "react-redux";
import { store } from "../store/store";
import Toast from "react-native-toast-message";

export default function RootLayout() {
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
      <Slot />
      <Toast />
    </Provider>
  );
}
