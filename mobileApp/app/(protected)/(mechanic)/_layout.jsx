// app/(protected)/(mechanic)/_layout.jsx
import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MechanicLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
    }}>
      <Stack.Screen
        name="Home" 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
        }}
      />
    </Stack>
  );
}