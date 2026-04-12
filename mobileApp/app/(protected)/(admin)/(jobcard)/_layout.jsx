import { Stack } from "expo-router";
import colors from "../../../../constants/colors";
import { TouchableOpacity } from "react-native"; // Add this
import { Ionicons } from "@expo/vector-icons"; // Add this

export default function TeamLayout() {
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
      }}
    >

     {/* (The Directory) */}
      <Stack.Screen 
          name="index"
          options={({ navigation }) => ({ // Access navigation here
            title: "Jobcard Directory",
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
    </Stack>
  );
}