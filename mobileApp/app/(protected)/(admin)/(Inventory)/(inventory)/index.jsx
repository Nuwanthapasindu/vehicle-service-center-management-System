import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../../../../constants/colors";
import { inventoryService } from "../../../../../services/inventory/inventory.service";
import InventoryList from "./inventoryList";
import { inventoryStyles as styles } from "../../../../../components/inventory/inventory.styles";

export default function InventoryIndex() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams();

  const [items, setItems] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState(["All Parts"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(category || "All Parts");
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = async () => {
    try {
      const data = await inventoryService.fetchInventory();
      
      const formattedItems = data
        .filter((item) => item?.isDeleted !== true)
        .map((item) => ({
          ...item,
          id: item._id || item.id,
          name: item.name,
          unit: item.unitType,
          price: item.sellingPrice,
          stock: item.qty || 0,
          reorderLevel: item.reorderLevel ?? 10,
          categoryName:
            typeof item.category === "object"
              ? item.category?.name || "Other"
              : item.category || "Other",
          image: null,
        }));

      setItems(formattedItems);

      const uniqueCategories = [
        "All Parts",
        ...new Set(formattedItems.map((item) => item.categoryName).filter(Boolean)),
      ];

      setCategoryFilters(uniqueCategories);
      
      if (!refreshing) {
        Toast.show({
          type: 'success',
          text1: 'Inventory Updated',
          text2: `${formattedItems.length} items loaded`,
          position: 'top',
          visibilityTime: 2000,
        });
      }
    } catch (error) {
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

  useEffect(() => {
    if (category) {
      setSelectedFilter(category);
    }
  }, [category]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (selectedFilter !== "All Parts") {
      result = result.filter(
        (item) =>
          item.categoryName?.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.categoryName?.toLowerCase().includes(q)
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
    return items.filter(item => item.categoryName?.toLowerCase() === filter.toLowerCase()).length;
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