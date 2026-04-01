import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="addCategory" />
      <Stack.Screen name="categoryList" />
    </Stack>
  );
}