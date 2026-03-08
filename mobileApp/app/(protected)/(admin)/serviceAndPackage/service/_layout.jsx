import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import colors from "../../../../../constants/colors";

export default function ServiceLayout() {
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
          title: "Service Catalog",
          headerLeft: () => <DrawerToggleButton tintColor={colors.DARK} />,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Add New Service",
          headerBackTitleVisible: true,
          headerBackTitle: "Services",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Edit Service",
          headerBackTitleVisible: true,
          headerBackTitle: "Services",
        }}
      />
    </Stack>
  );
}
