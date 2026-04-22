import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";

export default function StaffLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.SECONDARY,
        tabBarStyle: {
          backgroundColor: colors.LIGHT,
          borderTopWidth: 1,
          borderTopColor: colors.BORDER_COLOR,
          height: 60,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: colors.LIGHT,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.BORDER_COLOR,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: colors.DARK,
        },
      }}
    >
      <Tabs.Screen
        name="(employee)"
        options={{
          title: "Employees",
          tabBarLabel: "Employees",
          headerTitle: "Employee Directory",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(team)"
        options={{
          title: "Teams",
          tabBarLabel: "Teams",
          headerTitle: "Team Directory",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
