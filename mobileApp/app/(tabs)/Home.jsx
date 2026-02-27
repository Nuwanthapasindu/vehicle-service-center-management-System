import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import useAuthentication from "../../hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { profile, isAuthenticated, logout } = useAuthentication();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Secured Area</Text>

        {isAuthenticated ? (
          <View style={styles.profileBox}>
            <Text style={styles.welcomeText}>
              Welcome back, {profile?.name || profile?.userName || "User"}!
            </Text>
            <Text style={styles.infoText}>Role: {profile?.role || "N/A"}</Text>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  profileBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
