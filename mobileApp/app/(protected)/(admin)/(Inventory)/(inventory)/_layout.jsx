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
      <Stack.Screen name="inventoryList" />
      <Stack.Screen name="addItem" />
      <Stack.Screen name="editItem" />
    </Stack>
  );
}