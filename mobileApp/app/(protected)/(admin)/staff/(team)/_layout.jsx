import { Stack } from "expo-router";
import colors from "../../../../../constants/colors";
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

     {/* "index" points to index.jsx (The Directory) */}
      <Stack.Screen 
          name="index"
          options={({ navigation }) => ({ // Access navigation here
            title: "Team Directory",
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
       
      {/* "add" points to add.jsx */}
      <Stack.Screen
        name="add"
        options={{
          title: "New Team",
          headerBackTitleVisible: true,
          headerBackTitle: "Cancel",
        }}
      />

      {/* "[id]" points to [id].jsx (The Edit page) */}
      <Stack.Screen
        name="[id]"
        options={{
          title: "Edit Team",
          headerBackTitleVisible: true,
          headerBackTitle: "Cancel",
        }}
      />

 

    </Stack>
  );
}