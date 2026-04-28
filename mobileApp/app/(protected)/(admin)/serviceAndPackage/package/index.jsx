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
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { packageService } from "../../../../../services/package/package.service";
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
  const [refreshing, setRefreshing] = useState(false);

  // Filter: 'all' | 'published' | 'unpublished'
  const [filter, setFilter] = useState("all");

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
      fetchPackages(1, debouncedSearch, filter);
    }, [debouncedSearch, filter]),
  );

  useEffect(() => {
    if (page > 1) {
      fetchPackages(page, debouncedSearch, filter);
    }
  }, [page]);

  const fetchPackages = async (pageNumber, search, activeFilter) => {
    if (loading) return;

    setLoading(true);
    try {
      const params = {
        page: pageNumber,
        limit: 10,
        name: search || undefined,
      };

      if (activeFilter === "published") params.isPublished = true;
      if (activeFilter === "unpublished") params.isPublished = false;

      const response = await packageService.fetchPackagesAdmin(params);

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

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setHasMore(true);
    setPackages([]);
    fetchPackages(1, debouncedSearch, newFilter);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    setPackages([]);
    await fetchPackages(1, debouncedSearch, filter);
    setRefreshing(false);
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
    const imageUrl =
      item.image && item.image.filePath
        ? getImageFullUrl(item.image.filePath)
        : "https://placehold.co/600x400@3x.png?text=No+Image";

    const servicesCount = item.servicesIncluded?.length || 0;
    const modelsStr = item.applicableVehicalModels?.join(", ") || "";
    const dateUpdated = new Date(item.updatedAt);
    const dateFormatted = `${dateUpdated.getDate()} ${dateUpdated.toLocaleString("default", { month: "short" })}`;

    return (
      <TouchableOpacity
        style={styles.card}
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
          <View style={styles.cardNameRow}>
            <Text style={styles.pkgName} numberOfLines={1}>
              {item.name}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.isPublished ? "#22C55E" : "#EF4444" },
              ]}
            />
          </View>
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
      {/* Search + Filter Section */}
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

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {[
            { key: "all", label: "All" },
            { key: "published", label: "Published" },
            { key: "unpublished", label: "Unpublished" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterPill,
                filter === tab.key && styles.filterPillActive,
              ]}
              onPress={() => handleFilterChange(tab.key)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === tab.key && styles.filterPillTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={packages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>
            {filter === "all" && `ALL PACKAGES (${totalPackages})`}
            {filter === "published" && `PUBLISHED (${totalPackages})`}
            {filter === "unpublished" && `UNPUBLISHED (${totalPackages})`}
          </Text>
        )}
        onEndReached={loadMorePackages}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.PRIMARY]}
            tintColor={colors.PRIMARY}
          />
        }
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
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR + "40",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    backgroundColor: colors.LIGHT,
  },
  filterPillActive: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.SECONDARY,
  },
  filterPillTextActive: {
    color: colors.DARK,
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
    fontSize: 15,
    fontWeight: "bold",
    color: colors.DARK,
    flex: 1,
    marginRight: 8,
  },
  cardNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    flexShrink: 0,
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
