import { Redirect, Stack } from "expo-router";
import useAuthentication from "../../hooks/useAuth";
export default function AuthLayout() {
  const { isAuthenticated } = useAuthentication();
  if (isAuthenticated) {
    return <Redirect href="/(protected)/(admin)/Dashboard" />;
  }

  return (
    <Stack>
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} />
      <Stack.Screen name="OtpVerification" options={{ headerShown: false }} />
      <Stack.Screen name="PasswordReset" options={{ headerShown: false }} />
    </Stack>
  );
}
