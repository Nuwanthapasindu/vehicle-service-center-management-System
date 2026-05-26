import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
} from "react-native";
import { Car, Search } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import colors from "../../../../constants/colors";
import { vehicleService } from "../../../../services/vehicle/vehicle.service";
import VehicleCard from "../../../../components/VehicleCard";

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicles = async (pageNum = 1, searchVal = "", isRefresh = false) => {
    if (pageNum === 1) {
      if (!isRefresh) setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const data = await vehicleService.getAllVehiclesAdmin(searchVal, pageNum, 100);
      
      if (pageNum === 1) {
        setVehicles(data);
      } else {
        setVehicles((prev) => [...prev, ...data]);
      }

      // If we received fewer than 100 items, there are no more items left
      if (data.length < 100) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setPage(pageNum);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch vehicles",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const searchQueryRef = useRef(searchQuery);
  const isMounted = useRef(false);

  // Keep ref in sync
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  // Fetch on focus
  useFocusEffect(
    useCallback(() => {
      fetchVehicles(1, searchQueryRef.current);
    }, [])
  );

  // Debounced search query change (skip initial mount)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchVehicles(1, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVehicles(1, searchQuery, true);
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchVehicles(page + 1, searchQuery);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER HERO */}
      <View style={styles.headerHero}>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroTitle}>Vehicle Directory</Text>
            <Text style={styles.heroSubtitle}>
              View and search all registered vehicles
            </Text>
          </View>
          <View style={styles.heroIconBox}>
            <Car size={28} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by license plate number..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="characters"
          />
        </View>
      </View>

      {loading && page === 1 ? (
        <ActivityIndicator
          size="large"
          color={colors.PRIMARY}
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <VehicleCard vehicle={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              All Vehicles ({vehicles.length})
            </Text>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color={colors.PRIMARY}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Car size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No vehicles found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerHero: {
    backgroundColor: colors.PRIMARY,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  heroIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: colors.DARK,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});
