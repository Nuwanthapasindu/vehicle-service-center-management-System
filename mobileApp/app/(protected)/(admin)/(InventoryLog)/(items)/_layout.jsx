import { Stack } from 'expo-router';

export default function InventoryLogItemsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="viewLogs" />
    </Stack>
  );
}