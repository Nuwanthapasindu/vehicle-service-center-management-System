import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import InventoryList from "./inventoryList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../../../../constants/colors";
import axios from "axios";

export default function InventoryIndex() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState(["All Parts"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Parts");
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("/inventory");
      
      const rawItems = response?.data?.payload?.data || response?.data?.data || [];

      const formattedItems = rawItems
        .filter((item) => item?.isDeleted !== true)
        .map((item) => ({
          id: item._id || item.id,
          name: item.name,
          unit: item.unitType,
          price: item.sellingPrice,
          stock: item.qty || 0,
          reorderLevel: item.reorderLevel ?? 10,
          category:
            typeof item.category === "object"
              ? item.category?.name || "Other"
              : item.category || "Other",
          image: null,
        }));

      setItems(formattedItems);

      const uniqueCategories = [
        "All Parts",
        ...new Set(formattedItems.map((item) => item.category).filter(Boolean)),
      ];

      setCategoryFilters(uniqueCategories);
      
      Toast.show({
        type: 'success',
        text1: 'Inventory Updated',
        text2: `${formattedItems.length} items loaded`,
        position: 'top',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.log("Inventory fetch error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Failed to load inventory data',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (selectedFilter !== "All Parts") {
      result = result.filter(
        (item) =>
          item.category?.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, search, selectedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory();
  };

  const clearSearch = () => {
    setSearch("");
    Toast.show({
      type: 'info',
      text1: 'Search cleared',
      text2: 'Showing all items',
      position: 'top',
      visibilityTime: 2000,
    });
  };

  const getFilterCount = (filter) => {
    if (filter === "All Parts") return items.length;
    return items.filter(item => item.category?.toLowerCase() === filter.toLowerCase()).length;
  };

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.topHeader, 
          { paddingTop: insets.top, height: 56 + insets.top }]}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            activeOpacity={0.8}
          >
            <Ionicons name="menu-outline" size={24} color={colors.DARK} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>INVENTORY</Text>
          <View style={styles.headerRightSpace} />
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.SECONDARY} />
          <TextInput
            placeholder="Search parts by name or category..."
            placeholderTextColor={colors.SECONDARY}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearSearchBtn}>
              <Ionicons name="close-circle" size={20} color={colors.SECONDARY} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {categoryFilters.map((filter) => {
            const active = selectedFilter === filter;
            const count = getFilterCount(filter);

            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterBtn, active && styles.activeFilterBtn]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
                {!active && count > 0 && (
                  <View style={styles.filterCount}>
                    <Text style={styles.filterCountText}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={colors.PRIMARY} />
          </View>
        ) : (
          <InventoryList
            data={filteredItems}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() =>
            router.push("/(protected)/(admin)/(Inventory)/(inventory)/addItem")
          }
        >
          <Ionicons name="add" size={32} color={colors.LIGHT} />
        </TouchableOpacity>
      </View>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },

  topHeader: {
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 4,
  },

  headerRightSpace: {
    width: 40,
  },

  searchBox: {
    marginHorizontal: 12,
    marginTop: 14,
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    paddingVertical: 0,
    color: colors.DARK,
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  clearSearchBtn: {
    padding: 4,
    marginLeft: 4,
  },

  filterRow: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 18,
  },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 18,
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginRight: 8,
    gap: 6,
  },

  activeFilterBtn: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.SECONDARY,
  },

  activeFilterText: {
    color: colors.DARK,
    fontWeight: "800",
  },

  filterCount: {
    backgroundColor: colors.SECONDARY,
    borderRadius: 10,
    paddingHorizontal: 4,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  filterCountText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.LIGHT,
  },

  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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