import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import StockList from "./stockList";
import StockAdjust from "./stockAdjust";
import colors from "../../../../../constants/colors";
import axios from "axios";

export default function StockIndex() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchStock = async () => {
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
      
      Toast.show({
        type: 'success',
        text1: 'Stock Updated',
        text2: `${formattedItems.length} items loaded`,
        position: 'top',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.log("Stock fetch error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Failed to load stock data',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    const filtered = items.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
    );
    
    return filtered;
  }, [items, search]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStock();
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setAdjustModalVisible(true);
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

  const handleStockUpdateSuccess = () => {
    fetchStock();
    Toast.show({
      type: 'success',
      text1: 'Stock Updated',
      text2: 'Inventory levels have been adjusted',
      position: 'top',
      visibilityTime: 3000,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={[
            styles.topHeader,
            {
              paddingTop: insets.top,
              height: 56 + insets.top,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            activeOpacity={0.8}
          >
            <Ionicons name="menu-outline" size={24} color={colors.DARK} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>STOCK MANAGEMENT</Text>
          <View style={styles.headerRightSpace} />

        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.SECONDARY} />
          <TextInput
            placeholder="Search parts..."
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

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={colors.PRIMARY} />
          </View>
        ) : (
          <StockList
            data={filteredItems}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onItemPress={handleItemPress}
          />
        )}

        <StockAdjust
          visible={adjustModalVisible}
          item={selectedItem}
          onClose={() => setAdjustModalVisible(false)}
          onSuccess={handleStockUpdateSuccess}
        />
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

  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});