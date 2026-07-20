import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../../../constants/colors";

export default function StaffLayout() {
  const insets = useSafeAreaInsets();

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
          height: 60 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
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
