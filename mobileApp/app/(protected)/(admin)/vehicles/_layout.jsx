import React from "react";
import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import colors from "../../../../constants/colors";

export default function VehiclesLayout() {
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
          title: "Registered Vehicles",
          headerLeft: () => <DrawerToggleButton tintColor={colors.DARK} />,
        }}
      />
    </Stack>
  );
}
