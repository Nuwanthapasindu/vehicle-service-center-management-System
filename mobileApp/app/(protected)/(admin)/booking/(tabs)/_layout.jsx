import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import colors from '../../../../../constants/colors';

export default function BookingTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.LIGHT,
          borderTopWidth: 1,
          borderTopColor: colors.BORDER_COLOR,
          paddingVertical: 5,
        },
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.SECONDARY,
        tabBarLabelStyle: {
          fontWeight: "800",
          fontSize: 12,
        }
      }}
    >
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upcoming",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "time" : "time-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
