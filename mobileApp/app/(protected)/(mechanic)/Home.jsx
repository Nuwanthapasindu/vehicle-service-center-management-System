import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import useAuthentication from '../../../hooks/useAuth';
import axios from "axios"; 

export default function Home() {
  const { profile, logout } = useAuthentication();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Mechanic";

  // Using axios instead of fetch
const fetchMyTasks = useCallback(async () => {
  setLoading(true);

  try {
    const response = await axios.get("/job-cards/my-tasks"); 

    const taskList = response.data?.payload?.data || [];

    setTasks(taskList);
    setFilteredTasks(taskList);

  } catch (error) {
    console.error("Network Error:", error);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
  if (profile) {
    fetchMyTasks();
  }
}, [profile, fetchMyTasks]);

  // Inside handleSearch
const handleSearch = (text) => {
  setSearchQuery(text);
  const filtered = tasks.filter((task) => {
    const plate = task.booking?.vehicle?.licensePlate?.toLowerCase() || ""; // Use licensePlate
    const service = task.selectedPackage?.name?.toLowerCase() || "general service";
    return plate.includes(text.toLowerCase()) || service.includes(text.toLowerCase());
  });
  setFilteredTasks(filtered);
};
  const formatStatus = (status) => status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Pending";
  const formatTime = (dateString) => dateString ? new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Pending";

  const renderTaskCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardLabel}>VEHICLE PLATE</Text>
          <Text style={styles.plateText}>{item.booking?.vehicle?.licensePlate || "N/A"}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Feather name="clock" size={14} color="#4B5563" />
          <Text style={styles.statusText}>{formatStatus(item.status)}</Text>
        </View>
      </View>
      <View style={styles.serviceRow}>
        <View style={styles.serviceIconContainer}>
          <MaterialCommunityIcons name="car-cog" size={24} color="#6B7280" />
        </View>
        <View>
          <Text style={styles.serviceName}>{item.selectedPackage?.name || "General Service"}</Text>
          <Text style={styles.scheduleText}>
            {item.startTime ? `Started: ${formatTime(item.startTime)}` : "Not Started"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: `https://ui-avatars.com/api/?name=${firstName}&background=random` }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.greeting}>Hello, {firstName}</Text>
            <Text style={styles.subtitle}>AutoMate • Shine Depot</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="power-outline" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerLabel}>ASSIGNED JOBS</Text>
          <Text style={styles.bannerNumber}>{tasks.length}</Text>
        </View>
        <View style={styles.bannerIconWrapper}>
          <Ionicons name="build-outline" size={32} color="#FFF" />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search plate..." 
          value={searchQuery} 
          onChangeText={handleSearch} 
          placeholderTextColor="#9CA3AF" 
        />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Current Tasks</Text>
        <TouchableOpacity onPress={fetchMyTasks} disabled={loading}>
          <Text style={styles.viewAllText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        renderItem={renderTaskCard}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMyTasks} />}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No assigned tasks found.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#6B7280', fontSize: 14 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  profileSection: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 45, height: 45, borderRadius: 25, marginRight: 12 },
  greeting: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  logoutBtn: { padding: 8, backgroundColor: "#FFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB" },
  banner: { backgroundColor: "#F59E0B", marginHorizontal: 20, borderRadius: 12, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bannerLabel: { color: "#FFF", fontSize: 12, fontWeight: "600", letterSpacing: 1 },
  bannerNumber: { color: "#FFF", fontSize: 36, fontWeight: "bold", marginTop: 5 },
  bannerIconWrapper: { backgroundColor: "rgba(255,255,255,0.2)", padding: 12, borderRadius: 12 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", marginHorizontal: 20, marginTop: 20, borderRadius: 10, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: "#E5E7EB" },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 25, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  viewAllText: { color: "#F59E0B", fontWeight: "600" },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: "#FFF", borderRadius: 12, padding: 16, marginBottom: 15, borderWidth: 1, borderColor: "#E5E7EB" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 12, marginBottom: 12 },
  cardLabel: { fontSize: 10, color: "#9CA3AF", fontWeight: "700", letterSpacing: 1 },
  plateText: { fontSize: 24, fontWeight: "900", color: "#111827", marginTop: 2 },
  statusBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  statusText: { marginLeft: 5, fontSize: 12, fontWeight: "600", color: "#4B5563" },
  serviceRow: { flexDirection: "row", alignItems: "center" },
  serviceIconContainer: { width: 40, height: 40, backgroundColor: "#F3F4F6", borderRadius: 8, justifyContent: "center", alignItems: "center", marginRight: 12 },
  serviceName: { fontSize: 15, fontWeight: "bold", color: "#111827" },
  scheduleText: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  emptyText: { textAlign: "center", color: "#6B7280", marginTop: 30, fontSize: 16 }
});