import { Redirect, Stack } from "expo-router";
import useAuthentication from "../../hooks/useAuth";
import enums from "../../constants/enums";

export default function AuthLayout() {
  const { isAuthenticated, profile } = useAuthentication();

  if (isAuthenticated) {
    if (profile?.role === enums.USER_ROLES.MECHANIC) {
      return <Redirect href="/(protected)/(mechanic)/Home" />;
    }
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
