import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import colors from "../../../../../constants/colors";

export default function PackageLayout() {
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
          title: "Package Catalog",
          headerLeft: () => <DrawerToggleButton tintColor={colors.DARK} />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Edit Service Package",
          headerBackTitleVisible: true,
          headerBackTitle: "Cancel",
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Add Package",
          headerBackTitleVisible: true,
          headerBackTitle: "Cancel",
        }}
      />
    </Stack>
  );
}
