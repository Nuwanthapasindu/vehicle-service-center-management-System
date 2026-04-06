// app/(protected)/(mechanic)/_layout.jsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MechanicLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#F59E0B',
      tabBarStyle: { height: 60 } // Ensure the bar has height
    }}>
      <Tabs.Screen
        name="Home" 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Tasks" 
        options={{
          title: 'My Tasks',
          tabBarIcon: ({ color }) => <Ionicons name="list-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}