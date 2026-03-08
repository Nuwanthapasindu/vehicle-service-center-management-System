import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import axios from "axios";
import colors from "../../../../../constants/colors";
import  getImageFullUrl  from "../../../../../utils/getImageFullUrl";

export default function PackageCatalog() {
  const router = useRouter();

  const [packages, setPackages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPackages, setTotalPackages] = useState(0);

  // Filter state for active/inactive (if we support it later)
  const [filter, setFilter] = useState("All Packages");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchPackages(1, debouncedSearch);
    }, [debouncedSearch]),
  );

  useEffect(() => {
    if (page > 1) {
      fetchPackages(page, debouncedSearch);
    }
  }, [page]);

  const fetchPackages = async (pageNumber, search) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get("/package", {
        params: {
          page: pageNumber,
          limit: 10,
          name: search || undefined,
        },
      });

      const targetPayload = response.data.payload || {};
      const newPackages = targetPayload.packages || [];
      const total = targetPayload.total || 0;
      const pages = targetPayload.pages || 1;

      setTotalPackages(total);

      if (pageNumber === 1) {
        setPackages(newPackages);
      } else {
        setPackages((prev) => [...prev, ...newPackages]);
      }

      if (pageNumber >= pages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    setPage(1);
    setHasMore(true);
    if (text === "") {
      setDebouncedSearch("");
    }
  };

  const loadMorePackages = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return <View style={{ height: 100 }} />;
    return (
      <View style={{ paddingVertical: 20, height: 100 }}>
        <ActivityIndicator size="small" color={colors.PRIMARY} />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const isActive = !item.isDeleted; // Adjust if schema has actual 'active' field
    const imageUrl =
      item.image && item.image.filePath
        ? getImageFullUrl(item.image.filePath)
        : "https://via.placeholder.com/200?text=No+Image";

    const servicesCount = item.servicesIncluded?.length || 0;
    const modelsStr = item.applicableVehicalModels?.join(", ") || "";

    // Show date formatted
    const dateUpdated = new Date(item.updatedAt);
    const dateFormatted = `${dateUpdated.getDate()} ${dateUpdated.toLocaleString("default", { month: "short" })}`;

    return (
      <TouchableOpacity
        style={[styles.card, !isActive && styles.cardInactive]}
        activeOpacity={0.7}
        onPress={() =>
          router.push(
            `/(protected)/(admin)/serviceAndPackage/package/${item._id}`,
          )
        }
      >
        <View style={styles.cardImageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.pkgName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.pkgVehicles} numberOfLines={1}>
            {modelsStr}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{servicesCount} SERVICES</Text>
            </View>
            <Text style={styles.updatedText}>• Updated {dateFormatted}</Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.BORDER_COLOR}
          style={styles.chevron}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View style={styles.headerSection}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.SECONDARY + "80"}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search packages (e.g. Interior, Ceramic)"
            placeholderTextColor={colors.SECONDARY + "80"}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={packages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>
            ALL PACKAGES ({totalPackages})
          </Text>
        )}
        onEndReached={loadMorePackages}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() =>
          router.push("/(protected)/(admin)/serviceAndPackage/package/add")
        }
      >
        <Ionicons name="add" size={32} color={colors.DARK} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  headerSection: {
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingTop: 16,
    paddingBottom: 16,
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
    paddingHorizontal: 16,
    marginHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK,
  },
  scrollContent: {
    paddingHorizontal: 16,
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR + "80",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 16,
  },
  cardInactive: {
    opacity: 0.6,
  },
  cardImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  pkgName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 4,
  },
  pkgVehicles: {
    fontSize: 13,
    color: colors.SECONDARY,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#E4F7D4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2C541A",
  },
  updatedText: {
    fontSize: 12,
    color: colors.SECONDARY + "99",
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 12,
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
    shadowColor: colors.DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
});
