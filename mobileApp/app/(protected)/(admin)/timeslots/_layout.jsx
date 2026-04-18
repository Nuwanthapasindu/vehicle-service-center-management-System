import React from "react";
import { Stack } from "expo-router";
import colors from "../../../../constants/colors";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TimeslotLayout() {
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
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTintColor: colors.PRIMARY,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={({ navigation }) => ({
          title: "Time Slot Configuration",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()} 
              style={{ marginLeft: 1 }}
            >
              <Ionicons name="menu" size={24} color={colors.DARK} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Add Time Slot",
          headerBackTitleVisible: true,
          headerBackTitle: "Cancel",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Update Time Slot",
          headerBackTitleVisible: true,
          headerBackTitle: "Cancel",
        }}
      />
    </Stack>
  );
}
