import { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import colors from "../../../../../constants/colors";

import { getCategoriesAndInventory } from "../../../../../services/category/category.service";
import { styles } from "../../../../../components/category/category.styles";
import CategoryCard from "../../../../../components/category/CategoryCard";

export default function CategoryList({ onItemPress, refreshTrigger, searchQuery }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { categories, inventory } = await getCategoriesAndInventory();

      const activeCategories = categories.filter(item => !item?.isDeleted);
      const activeInventory = inventory.filter(item => !item?.isDeleted);

      const countMap = {};
      activeInventory.forEach((item) => {
        const categoryId = item.category?._id || item.category?.id ||
          (typeof item.category === "string" ? item.category : null);
        if (categoryId) {
          countMap[categoryId] = (countMap[categoryId] || 0) + 1;
        }
      });

      const formattedCategories = activeCategories.map((cat) => ({
        id: cat._id || cat.id,
        name: cat.name,
        count: countMap[cat._id || cat.id] || 0,
      }));

      setData(formattedCategories);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch categories',
      });
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, data]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="reload-circle-outline" size={48} color={colors.SECONDARY} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredData} 
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => <CategoryCard item={item} onPress={() => onItemPress(item)} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons
              name={searchQuery ? "search-outline" : "folder-open-outline"}
              size={64}
              color={colors.SECONDARY}
            />
            <Text style={styles.emptyText}>
              {searchQuery ? "No matching categories" : "No categories found"}
            </Text>
            <Text style={styles.emptySubText}>
              {searchQuery ? "Try a different search term" : "Tap + to add a new category"}
            </Text>
          </View>
        }
      />
    </View>
  );
}