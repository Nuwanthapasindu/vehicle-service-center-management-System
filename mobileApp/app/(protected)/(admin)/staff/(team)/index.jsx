import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import colors from "../../../../../constants/colors";
import axios from "axios";

export default function TeamDirectory() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'active', 'busy', 'break'
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchTeams();
    }, [])
  );

  // Handle Search and Status Filtering
  useEffect(() => {
    let result = teams;

    // Filter by Status
    if (activeFilter !== "all") {
      result = result.filter((team) => (team.status || "active").toLowerCase() === activeFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter((team) =>
        team.name.toLowerCase().includes(query)
      );
    }

    setFilteredTeams(result);
  }, [searchQuery, teams, activeFilter]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/teams");

      const resData = response.data;

      if (resData && resData.payload && resData.payload.data) {
        setTeams(resData.payload.data);
      } else {
        setTeams([]);
      }
    } catch (error) {
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const getTeamIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("detailing")) return "brush-outline";
    if (lowerName.includes("engine") || lowerName.includes("maintenance")) return "build-outline";
    if (lowerName.includes("quality")) return "shield-checkmark-outline";
    return "people-outline";
  };

  const renderTeamCard = ({ item }) => {
    const status = (item.status || "ACTIVE").toUpperCase(); 
    const memberCount = item.employees ? item.employees.length : 0;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push(`/(protected)/(admin)/staff/(team)/${item._id}`)}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.PRIMARY + "15" }]}>
          <Ionicons name={getTeamIcon(item.name)} size={24} color={colors.PRIMARY} />
        </View>

        <View style={styles.info}>
          <Text style={styles.teamName}>{item.name}</Text>
          <View style={styles.memberRow}>
            <Ionicons name="people" size={14} color={colors.SECONDARY} />
            <Text style={styles.memberCount}>{memberCount} Members</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, styles[`badge${status}`]]}>
          <Text style={[styles.statusText, styles[`text${status}`]]}>{status}</Text>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color={colors.SECONDARY} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.SECONDARY} style={styles.searchIcon} />
        <TextInput
          placeholder="Search teams..."
          style={styles.searchInput}
          placeholderTextColor={colors.SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* --- STATUS FILTER CHIPS (From your UI design) --- */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            onPress={() => setActiveFilter("all")}
            style={[styles.filterChip, activeFilter === "all" && styles.activeChipAll]}
          >
            <Text style={[styles.filterChipText, activeFilter === "all" && styles.activeChipText]}>
                {teams.length} Total
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveFilter("active")}
            style={[styles.filterChip, activeFilter === "active" && styles.activeChipActive]}
          >
            <Text style={[styles.filterChipText, activeFilter === "active" && styles.activeChipTextActive]}>
                {teams.filter(t => (t.status || 'active') === 'active').length} Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveFilter("busy")}
            style={[styles.filterChip, activeFilter === "busy" && styles.activeChipBusy]}
          >
            <Text style={[styles.filterChipText, activeFilter === "busy" && styles.activeChipTextBusy]}>
                {teams.filter(t => t.status === 'busy').length} Busy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveFilter("break")}
            style={[styles.filterChip, activeFilter === "break" && styles.activeChipBreak]}
          >
            <Text style={[styles.filterChipText, activeFilter === "break" && styles.activeChipTextBreak]}>
                {teams.filter(t => t.status === 'break').length} Break
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* List Area */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.PRIMARY} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredTeams}
          renderItem={renderTeamCard}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No teams found for this filter.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/(protected)/(admin)/staff/(team)/add")}
      >
        <Ionicons name="add" size={32} color={colors.DARK} />
      </TouchableOpacity>

    </SafeAreaView>
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
  
  // --- FILTER CHIPS STYLING ---
  filterWrapper: { marginBottom: 10 },
  filterScroll: { paddingHorizontal: 16 },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginRight: 10,
  },
  filterChipText: { fontSize: 13, fontWeight: "600", color: colors.SECONDARY },
  
  // Active State Colors
  activeChipAll: { borderColor: colors.PRIMARY, backgroundColor: colors.PRIMARY + "10" },
  activeChipText: { color: colors.DARK },

  activeChipActive: { borderColor: "#27AE60", backgroundColor: "#E9F7EF" },
  activeChipTextActive: { color: "#27AE60" },

  activeChipBusy: { borderColor: "#E67E22", backgroundColor: "#FEF5ED" },
  activeChipTextBusy: { color: "#E67E22" },

  activeChipBreak: { borderColor: "#64748B", backgroundColor: "#F1F5F9" },
  activeChipTextBreak: { color: "#64748B" },

  list: { padding: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center" },
  info: { flex: 1, marginLeft: 16 },
  teamName: { fontSize: 16, fontWeight: "bold", color: colors.DARK },
  memberRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  memberCount: { color: colors.SECONDARY, fontSize: 13, marginLeft: 5 },
  
  // Status Badge Colors in Card
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, marginRight: 10 },
  statusText: { fontSize: 10, fontWeight: "800" },
  badgeACTIVE: { backgroundColor: "#E9F7EF" },
  textACTIVE: { color: "#27AE60" },
  badgeBUSY: { backgroundColor: "#FEF5ED" },
  textBUSY: { color: "#E67E22" },
  badgeBREAK: { backgroundColor: "#F1F5F9" },
  textBREAK: { color: "#64748B" },

  fab: {
    position: "absolute",
    bottom: 20, 
    right: 20,
    backgroundColor: colors.PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 999,
  },
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
    paddingBottom: 10, 
    elevation: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  navItem: { alignItems: "center", justifyContent: "center", flex: 1 },
  navText: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.SECONDARY, fontSize: 16 },
});