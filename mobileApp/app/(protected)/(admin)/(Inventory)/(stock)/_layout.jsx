import React from 'react';
import { Stack } from 'expo-router';

export default function InventoryStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="stockAdjust" />
      <Stack.Screen name="stockList" />
    </Stack>
  );
}