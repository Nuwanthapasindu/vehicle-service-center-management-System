import { Stack } from 'expo-router';

export default function SupplyChainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="addSupplier" />
      <Stack.Screen name="editSupplier" />
      <Stack.Screen name="AddOrder" />
      <Stack.Screen name="editOrder" />
    </Stack>
  );
}
