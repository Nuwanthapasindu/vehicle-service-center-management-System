import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import CategoryList from "./categoryList";
import AddCategory from "./addCategory";
import EditCategory from "./editCategory";
import colors from "../../../../../constants/colors";
import axios from "axios";

export default function CategoryIndex() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const [categoryResponse, inventoryResponse] = await Promise.all([
        axios.get("/categories"),
        axios.get("/inventory"),
      ]);

      const rawCategories = categoryResponse?.data?.payload?.data || categoryResponse?.data?.data || [];
      const rawInventory = inventoryResponse?.data?.payload?.data || inventoryResponse?.data?.data || [];

      const activeCategories = rawCategories.filter(
        (item) => item?.isDeleted !== true
      );

      const activeInventory = rawInventory.filter(
        (item) => item?.isDeleted !== true
      );

      setCategories(activeCategories);
      setInventoryItems(activeInventory);
    } catch (error) {
      console.log("Category screen fetch error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Failed to load category data.',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categoryList = useMemo(() => {
    const countMap = {};

    inventoryItems.forEach((item) => {
      let categoryId = null;

      if (typeof item.category === "string") {
        categoryId = item.category;
      } else if (item.category?._id) {
        categoryId = item.category._id;
      } else if (item.category?.id) {
        categoryId = item.category.id;
      }

      if (!categoryId) return;

      countMap[categoryId] = (countMap[categoryId] || 0) + 1;
    });

    let result = categories.map((category) => ({
      id: category._id || category.id,
      name: category.name,
      count: countMap[category._id || category.id] || 0,
    }));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [categories, inventoryItems, search]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCategoryPress = (item) => {
    setSelectedCategory(item);
    setEditModalVisible(true);
    console.log("Pressed category:", item);
  };

  const handleAddSuccess = () => {
    fetchData();
  };

  const handleEditSuccess = () => {
    fetchData();
  };

  const clearSearch = () => {
    setSearch("");
    Toast.show({
      type: 'info',
      text1: 'Search cleared',
      text2: 'Showing all categories',
      position: 'top',
      visibilityTime: 2000,
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
            <Ionicons name="menu-outline" size={24} color="#000000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>CATEGORY MANAGEMENT</Text>

          <View style={styles.headerRightSpace} />
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.SECONDARY} />
          <TextInput
            placeholder="Search categories..."
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>INVENTORY GROUPS</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>{categoryList.length} TOTAL</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={colors.PRIMARY} />
          </View>
        ) : (
          <CategoryList
            data={categoryList}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onItemPress={handleCategoryPress}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Ionicons name="add" size={32} color={colors.LIGHT} />
        </TouchableOpacity>

        <AddCategory
          visible={categoryModalVisible}
          onClose={() => setCategoryModalVisible(false)}
          onSuccess={handleAddSuccess}
        />

        <EditCategory
          visible={editModalVisible}
          category={selectedCategory}
          onClose={() => setEditModalVisible(false)}
          onSuccess={handleEditSuccess}
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

  sectionHeader: {
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: colors.SECONDARY,
  },

  totalBadge: {
    backgroundColor: "#DDEFB8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  totalBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#5D7C16",
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