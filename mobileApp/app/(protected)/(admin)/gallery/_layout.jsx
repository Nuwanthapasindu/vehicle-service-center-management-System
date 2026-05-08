import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import colors from "../../../../constants/colors";

export default function GalleryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
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
          title: "Gallery Management",
          headerLeft: () => <DrawerToggleButton tintColor={colors.DARK} />,
        }}
      />
    </Stack>
  );
}
