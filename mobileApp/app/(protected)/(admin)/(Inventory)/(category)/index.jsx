import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

import CategoryList from "./categoryList";
import AddCategory from "./addCategory";
import EditCategoryModal from "../../../../../components/category/EditCategoryModal"; 
import colors from "../../../../../constants/colors";
import { styles } from "../../../../../components/category/category.styles";

export default function CategoryIndex() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [search, setSearch] = useState("");

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCategoryPress = (item) => {
    setSelectedCategory(item);
    setEditModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.topHeader, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu-outline" size={24} color={colors.DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CATEGORY MANAGEMENT</Text>
        <View style={styles.headerRightSpace} />
      </View>

      {/* Search Bar */}
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
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color={colors.SECONDARY} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>INVENTORY GROUPS</Text>
      </View>

      <CategoryList
        onItemPress={handleCategoryPress}
        refreshTrigger={refreshTrigger}
        searchQuery={search} 
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setAddModalVisible(true)}
      >
        <Ionicons name="add" size={32} color={colors.LIGHT} />
      </TouchableOpacity>

      <AddCategory
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={handleRefresh}
      />

      <EditCategoryModal
        visible={editModalVisible}
        category={selectedCategory}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedCategory(null);
        }}
        onSuccess={handleRefresh}
      />

      <Toast />
    </View>
  );
}