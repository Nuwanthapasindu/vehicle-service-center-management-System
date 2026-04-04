import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import axios from "axios";
import colors from "../../../../constants/colors";
import EmployeeCard from "../../../../components/EmployeeCard";

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, [filter])
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const query = searchQuery.toLowerCase();

      const filtered = employees.filter(
        (item) =>
          item.user?.name?.toLowerCase().includes(query) ||
          item.user?.role?.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      let url = "/employees";

      if (filter === "available") {
        url += "?isAvailable=true";
      } else if (filter === "unavailable") {
        url += "?isAvailable=false";
      }

      const response = await axios.get(url);

      const employeesData = response?.data?.payload?.data || [];
      setEmployees(employeesData);
    } catch (error) {
      console.error("Employee fetch error:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const renderEmployeeCard = ({ item }) => (
    <EmployeeCard item={item} />
  );

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.SECONDARY}
          style={styles.searchIcon}
        />

        <TextInput
          placeholder="Search by name or role..."
          style={styles.searchInput}
          placeholderTextColor={colors.SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* FILTER TABS */}
      <View style={styles.tabBar}>
        {["all", "available", "unavailable"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setFilter(t)}
            style={[styles.tab, filter === t && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, filter === t && styles.activeTabText]}
            >
              {t === "all" ? "ALL STAFF" : t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* EMPLOYEE LIST */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.PRIMARY}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployeeCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No employees found for this filter.
              </Text>
            </View>
          }
        />
      )}

      {/* FAB BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push("/(protected)/(admin)/(employee)/add")
        }
      >
        <Ionicons name="add" size={32} color={colors.DARK} />
      </TouchableOpacity>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(protected)/(admin)/(team)")}
        >
          <Ionicons name="people-outline" size={24} color={colors.SECONDARY} />
          <Text style={styles.navText}>Team</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color={colors.PRIMARY} />
          <Text style={[styles.navText, { color: colors.PRIMARY }]}>
            Employee
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.BACKGROUND_COLOR },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 45, color: colors.DARK },
  tabBar: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 10 },
  tab: { marginRight: 20, paddingBottom: 8 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: colors.PRIMARY },
  tabText: { color: colors.SECONDARY, fontWeight: "600", fontSize: 13 },
  activeTabText: { color: colors.DARK },
  list: { 
    padding: 16, 
    paddingBottom: 100 // Ensures last item is not hidden behind the fixed bottom nav
  },
  fab: {
    position: "absolute",
    bottom: 90, // Adjusted to sit above the Bottom Nav
    right: 20,
    backgroundColor: colors.PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 999, // Ensure it stays on top
  },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.SECONDARY, fontSize: 16 },

  // --- IMPROVED BOTTOM NAV STYLING ---
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    height: 70,
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10, // Extra space for gesture bars on modern phones
    elevation: 10, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  }
});