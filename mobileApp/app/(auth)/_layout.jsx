import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { refreshAccessToken } from "../../services/tokenRefresh";
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} />
      <Stack.Screen name="OtpVerification" options={{ headerShown: false }} />
      <Stack.Screen name="PasswordReset" options={{ headerShown: false }} />
    </Stack>
  );
}
