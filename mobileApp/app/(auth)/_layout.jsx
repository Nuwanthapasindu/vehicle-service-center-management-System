import { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import useAuthentication from "../../hooks/useAuth";
import enums from "../../constants/enums";

export default function AuthLayout() {
  const { isAuthenticated, profile, logout } = useAuthentication();

  useEffect(() => {
    if (
      isAuthenticated &&
      profile?.role !== enums.USER_ROLES.MECHANIC &&
      profile?.role !== enums.USER_ROLES.ADMIN
    ) {
      logout();
    }
  }, [isAuthenticated, profile, logout]);

  if (isAuthenticated) {
    if (profile?.role === enums.USER_ROLES.MECHANIC) {
      return <Redirect href="/(protected)/(mechanic)/Home" />;
    }
    if (profile?.role === enums.USER_ROLES.ADMIN) {
      return <Redirect href="/(protected)/(admin)/Dashboard" />;
    }
    return null;
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
