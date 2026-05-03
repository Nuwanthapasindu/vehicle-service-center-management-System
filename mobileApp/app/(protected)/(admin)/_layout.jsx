import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import useAuthentication from "../../../hooks/useAuth";
import logo from "../../../assets/logo.png";

function CustomDrawerContent(props) {
  const { logout } = useAuthentication();

  return (
    <View style={{ flex: 1, backgroundColor: colors.LIGHT }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.logoWrapper}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>AutoMate</Text>
            <Text style={styles.headerSubtitle}>SHINE DEPOT</Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* List of items */}
        <View style={styles.drawerItemsWrapper}>
          {props.state.routes.map((route, index) => {
            const { options } = props.descriptors[route.key];

            // --- THE FIX: THIS HIDES ALL THOSE EXTRA FILES ---
            // If the screen doesn't have a specific drawerLabel, don't render it in the menu!
            if (!options.drawerLabel) {
              return null;
            }

            const isFocused = props.state.index === index;
            const label = options.drawerLabel;
            const icon = options.drawerIcon;

            return (
              <TouchableOpacity
                key={route.key}
                style={[styles.menuItem, isFocused && styles.menuItemActive]}
                onPress={() => props.navigation.navigate(route.name)}
              >
                <View
                  style={[
                    styles.activeIndicator,
                    isFocused && styles.activeIndicatorVisible,
                  ]}
                />
                <View style={styles.itemContent}>
                  {icon &&
                    icon({
                      color: isFocused ? colors.DARK : colors.SECONDARY,
                      size: 22,
                    })}
                  <Text
                    style={[
                      styles.menuItemText,
                      isFocused && styles.menuItemTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Footer / Logout */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={colors.DANGER_COLOR}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AdminDrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontWeight: "bold",
            color: colors.DARK,
          },
          drawerStyle: {
            width: 300,
            backgroundColor: colors.LIGHT,
          },
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="grid" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="booking/index"
          options={{
            drawerLabel: "Bookings",
            title: "Bookings",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="staff"
          options={{
            headerShown: false,
            drawerLabel: "Staff Management",
            title: "STAFF MANAGEMENT",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="(Inventory)"
          options={{
            headerShown: false,
            drawerLabel: "Inventory",
            title: "Inventory",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="archive-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="supplychain/index"
          options={{
            headerShown: false,
            drawerLabel: "Supply Chain",
            title: "Supply Chain",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="bus-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="serviceAndPackage"
          options={{
            drawerLabel: "Catalog & Packages",
            title: "Catalog & Packages",
            headerShown: false,
            drawerIcon: ({ color, size }) => (
              <Ionicons name="layers-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="invoice"
          options={{
            drawerLabel: "Invoice",
            title: "All Invoice",
            headerShown: false,
            drawerIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="reviews"
          options={{
            headerShown: false,
            drawerLabel: "Reviews",
            title: "Review Moderation",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="star-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="timeslots"
          options={{
            headerShown: false,
            drawerLabel: "Time Slots",
            title: "Time Slot Configuration",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Hidden Screens */}
        <Drawer.Screen
          name="booking/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="booking/manage/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="revenue"
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="(InventoryLog)"
          options={{
            headerShown: false,
            title: "Inventory Logs",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="(InventoryAnalysis)"
          options={{
            headerShown: false,
            title: "Inventory Analysis",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: colors.LIGHT,
  },
  logoWrapper: {
    width: 48,
    height: 48,
    backgroundColor: colors.DARK,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  logo: {
    width: 38,
    height: 38,
  },
  headerTextContainer: {
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.DARK,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.PRIMARY,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
    opacity: 0.6,
  },
  drawerItemsWrapper: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  menuItemActive: {
    backgroundColor: "#F4FADE",
  },
  activeIndicator: {
    width: 6,
    height: "100%",
    backgroundColor: "transparent",
    position: "absolute",
    left: 0,
  },
  activeIndicatorVisible: {
    backgroundColor: colors.PRIMARY,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 32,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.SECONDARY,
    marginLeft: 16,
  },
  menuItemTextActive: {
    color: colors.DARK,
    fontWeight: "800",
  },
  drawerFooter: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
    backgroundColor: colors.LIGHT,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DANGER_COLOR,
  },
});
