import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storageKeys from "../constants/storageKeys";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasViewedOnboarding, setHasViewedOnboarding] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(
          storageKeys.HAS_VIEWED_ONBOARDING,
        );
        if (value === "true") {
          setHasViewedOnboarding(true);
        }
      } catch (e) {
        console.error("Error reading AsyncStorage", e);
      } finally {
        setIsReady(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (hasViewedOnboarding && !inAuthGroup) {
      // If already viewed onboarding, direct them out of index/onboarding to Login
      router.replace("/(auth)/Login");
    } else if (!hasViewedOnboarding && segments[0] !== "(onboarding)") {
      // If onboarding hasn't been viewed, enforce onboarding
      router.replace("/(onboarding)");
    }
  }, [isReady, hasViewedOnboarding, segments]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F9FA",
        }}
      >
        <ActivityIndicator size="large" color="#8EDB00" />
      </View>
    );
  }

  return <Slot />;
}
