import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";

export default function ServiceAndPackageLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // The stack/drawer provides the header
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.SECONDARY,
      }}
    >
      <Tabs.Screen
        name="(service)/Service"
        options={{
          tabBarLabel: "SERVICES",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(package)/Package"
        options={{
          tabBarLabel: "PACKAGES",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
