import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../../constants/colors";
import Toast from 'react-native-toast-message';
import axios from "axios";

function CategoryCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress?.(item)}
    >
      <View style={styles.cardTextWrap}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryMeta}>{item.count || 0} items in stock</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.SECONDARY} />
    </TouchableOpacity>
  );
}

export default function CategoryList({ 
  onItemPress,
  refreshTrigger
}) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inventoryItems, setInventoryItems] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [categoriesResponse, inventoryResponse] = await Promise.all([
        axios.get("/categories"),
        axios.get("/inventory")
      ]);
      
      let rawCategories = categoriesResponse?.data?.payload?.data || 
                         categoriesResponse?.data?.data || 
                         [];

      let rawInventory = inventoryResponse?.data?.payload?.data || 
                        inventoryResponse?.data?.data || 
                        [];

      const activeCategories = rawCategories.filter(
        (item) => item?.isDeleted !== true
      );

      const activeInventory = rawInventory.filter(
        (item) => item?.isDeleted !== true
      );

      setInventoryItems(activeInventory);

      const countMap = {};
      activeInventory.forEach((item) => {
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

      const formattedCategories = activeCategories.map((category) => ({
        id: category._id || category.id,
        name: category.name,
        count: countMap[category._id || category.id] || 0,
      }));

      setData(formattedCategories);
      
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Failed to fetch categories',
        position: 'top',
        visibilityTime: 3000,
      });
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    Toast.show({
      type: 'info',
      text1: 'Refreshing',
      text2: 'Updating categories...',
      position: 'top',
      visibilityTime: 2000,
    });
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refreshTrigger) {
      fetchData();
    }
  }, [refreshTrigger, fetchData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="reload-circle-outline" size={48} color={colors.SECONDARY} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id?.toString() || item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <CategoryCard item={item} onPress={onItemPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="folder-open-outline" size={64} color={colors.SECONDARY} />
            <Text style={styles.emptyText}>No categories found</Text>
            <Text style={styles.emptySubText}>Tap + to add a new category</Text>
          </View>
        }
      />
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTextWrap: {
    flex: 1,
  },

  categoryName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
  },

  categoryMeta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.SECONDARY,
    fontWeight: "500",
  },

  emptyWrap: {
    paddingTop: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.SECONDARY,
    fontWeight: "600",
  },

  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "500",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.SECONDARY,
    fontWeight: "500",
  },
});