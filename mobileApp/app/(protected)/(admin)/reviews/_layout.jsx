import React from "react";
import { Stack, useRouter } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";

export default function ReviewsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.LIGHT,
        },
        headerTitleStyle: {
          fontWeight: "800",
          color: colors.DARK,
        },
        headerShadowVisible: false,
        headerTintColor: colors.PRIMARY,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Review Moderation",
          headerLeft: () => <DrawerToggleButton tintColor={colors.DARK} />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          title: "Review Details",
        }}
      />
      <Stack.Screen
        name="report"
        options={{
          headerShown: true,
          title: "Satisfaction Report",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/(protected)/(admin)/Dashboard")} style={{ marginLeft: 5, marginRight: 15 }}>
              <Ionicons name="arrow-back" size={24} color={colors.DARK} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
