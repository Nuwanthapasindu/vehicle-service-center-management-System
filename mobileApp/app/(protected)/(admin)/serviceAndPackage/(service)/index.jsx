import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../../../constants/colors";
import axios from "axios";

export default function Service() {
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalServices, setTotalServices] = useState(0);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch services when page or debouncedSearch changes
  useEffect(() => {
    fetchServices(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const fetchServices = async (pageNumber, search) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get("/service", {
        params: {
          page: pageNumber,
          limit: 10,
          name: search || undefined,
        },
      });

      const targetPayload = response.data.payload.services || {};
      const newServices = targetPayload.services || [];
      const total = targetPayload.total || 0;
      const pages = targetPayload.pages || 1;

      setTotalServices(total);

      if (pageNumber === 1) {
        setServices(newServices);
      } else {
        setServices((prev) => [...prev, ...newServices]);
      }

      if (pageNumber >= pages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    setPage(1);
    setHasMore(true);
    if (text === "") {
      // reset immediately when cleared
      setDebouncedSearch("");
    }
  };

  const loadMoreServices = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return <View style={{ height: 100 }} />; // Padding for FAB
    return (
      <View style={{ paddingVertical: 20, height: 100 }}>
        <ActivityIndicator size="small" color={colors.PRIMARY} />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const minPrice =
      item.prices?.length > 0
        ? Math.min(...item.prices.map((p) => p.price)).toFixed(2)
        : "0.00";

    // Using isDeleted to represent active status since it's the only relevant field in schema
    const isActive = !item.isDeleted;

    return (
      <TouchableOpacity
        style={[styles.card, !isActive && styles.cardInactive]}
        activeOpacity={0.7}
        onPress={() =>
          router.push(
            `/(protected)/(admin)/serviceAndPackage/(service)/${item._id}`,
          )
        }
        disabled={!isActive}
      >
        <View style={styles.cardLeft}>
          <View
            style={[styles.tagWrapper, !isActive && styles.tagWrapperInactive]}
          >
            <Text style={styles.tagText}>Service</Text>
          </View>
          <Text
            style={[styles.serviceName, !isActive && styles.textInactive]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={[styles.durationText, !isActive && styles.subtextInactive]}
            numberOfLines={1}
          >
            {item.description || "No description"}
          </Text>
        </View>

        <View style={styles.cardRight}>
          <Text
            style={[styles.priceText, !isActive && styles.textInactiveLight]}
          >
            LKR {minPrice}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={isActive ? colors.SECONDARY : colors.BORDER_COLOR}
            style={styles.chevron}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.SECONDARY + "80"}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search services..."
            placeholderTextColor={colors.SECONDARY + "80"}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={[styles.scrollContent, styles.listContainer]}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>SERVICES ({totalServices})</Text>
        )}
        onEndReached={loadMoreServices}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() =>
          router.push("/(protected)/(admin)/serviceAndPackage/(service)/add")
        }
      >
        <Ionicons name="add" size={32} color={colors.LIGHT} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR + "40",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100, // Leave room for FAB
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR + "60",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardInactive: {
    opacity: 0.8,
  },
  cardLeft: {
    flex: 1,
    justifyContent: "center",
  },
  tagWrapper: {
    alignSelf: "flex-start",
    backgroundColor: colors.DARK,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  tagWrapperInactive: {
    backgroundColor: "#B4BFCB",
  },
  tagText: {
    color: colors.LIGHT,
    fontSize: 10,
    fontWeight: "600",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 4,
  },
  durationText: {
    fontSize: 13,
    color: colors.SECONDARY,
  },
  textInactive: {
    color: "#94A3B8",
  },
  subtextInactive: {
    color: "#CBD5E1",
  },
  textInactiveLight: {
    color: "#B4BFCB",
  },
  cardRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 2, // Minor padding mapping
  },
  priceText: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.DARK,
  },
  chevron: {
    marginTop: "auto", // Push chevron to bottom
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});
