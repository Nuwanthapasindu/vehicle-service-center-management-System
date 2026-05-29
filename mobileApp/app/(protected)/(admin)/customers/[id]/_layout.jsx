import React, { createContext, useContext, useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../../constants/colors";
import { userService } from "../../../../../services/user/user.service";
import { Phone, MapPin } from "lucide-react-native";

const CustomerDetailsContext = createContext(null);

export const useCustomerDetails = () => useContext(CustomerDetailsContext);

export default function CustomerTabsLayout() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await userService.getCustomerDetails(id);
      setDetails(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch details",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  if (!details || !details.user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>Customer not found.</Text>
      </View>
    );
  }

  const { user } = details;

  return (
    <CustomerDetailsContext.Provider value={{ details, fetchDetails }}>
      <View style={styles.container}>
        {/* HEADER HERO */}
        <View style={styles.headerHero}>
          <View style={styles.heroProfileRow}>
            <View style={styles.heroAvatarBox}>
              <Text style={styles.heroAvatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.heroInfoCol}>
              <Text style={styles.heroName}>{user.name}</Text>
              <View style={styles.heroDetailRow}>
                <Phone size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroDetailText}>{user.mobile}</Text>
              </View>
              {user.address && (
                <View style={styles.heroDetailRow}>
                  <MapPin size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.heroDetailText}>{user.address}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: colors.LIGHT,
                borderTopWidth: 1,
                borderTopColor: colors.BORDER_COLOR,
                paddingVertical: 5,
              },
              tabBarActiveTintColor: colors.PRIMARY,
              tabBarInactiveTintColor: colors.SECONDARY,
              tabBarLabelStyle: {
                fontWeight: "800",
                fontSize: 12,
              }
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Vehicles",
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons name={focused ? "car" : "car-outline"} size={24} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="invoices"
              options={{
                title: "Invoices",
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons name={focused ? "document-text" : "document-text-outline"} size={24} color={color} />
                ),
              }}
            />
          </Tabs>
        </View>
      </View>
    </CustomerDetailsContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerHero: {
    backgroundColor: colors.PRIMARY,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
  },
  heroProfileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroAvatarBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroAvatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.PRIMARY,
  },
  heroInfoCol: {
    flex: 1,
  },
  heroName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  heroDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  heroDetailText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  emptyText: {
    color: colors.SECONDARY,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
});
