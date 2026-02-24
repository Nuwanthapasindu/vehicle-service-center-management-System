import { useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import useAsyncStorage from "../hooks/useAsyncStorage";
import storageKeys from "../constants/storageKeys";

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

  return <Slot />;
}
