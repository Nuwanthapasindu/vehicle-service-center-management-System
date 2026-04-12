import React from "react";
import { Stack } from "expo-router";
import colors from "../../../../constants/colors";

export default function TimeslotLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.LIGHT,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: colors.DARK,
        },
        headerTintColor: colors.PRIMARY,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Add Time Slot",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Update Time Slot",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
