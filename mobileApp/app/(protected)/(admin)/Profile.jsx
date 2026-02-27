import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import colors from "../../../constants/colors";

export default function Profile() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/82.jpg" }}
          style={styles.avatar}
        />
      </View>

      {/* User Info */}
      <Text style={styles.userName}>Alex Admin</Text>
      <Text style={styles.userRole}>System Administrator</Text>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.cardItem}>
          <Text style={styles.itemLabel}>EMAIL ADDRESS</Text>
          <Text style={styles.itemValue}>alex.admin@shinedepot.com</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.cardItem}>
          <Text style={styles.itemLabel}>PHONE NUMBER</Text>
          <Text style={styles.itemValue}>+1 (555) 012-3456</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.cardItem}>
          <Text style={styles.itemLabel}>ASSIGNED WORKSHOP</Text>
          <Text style={styles.itemValue}>
            AutoMate (Shine Depot) - Main Hub
          </Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.cardItem}>
          <Text style={styles.itemLabel}>EMPLOYEE ID</Text>
          <Text style={styles.itemValue}>EMP-99201</Text>
        </View>
      </View>

      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton} activeOpacity={0.8}>
        <Ionicons name="create-outline" size={22} color={colors.DARK} />
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  avatarContainer: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: colors.LIGHT,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    alignSelf: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 114,
    height: 114,
    borderRadius: 57,
  },
  userName: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.DARK,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  userRole: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.SECONDARY,
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 32,
  },
  cardItem: {
    paddingVertical: 18,
  },
  separator: {
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
    opacity: 0.6,
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94A3B8",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.DARK,
  },
  updateButton: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
});
