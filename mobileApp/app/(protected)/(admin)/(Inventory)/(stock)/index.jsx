import { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import colors from "../../../../../constants/colors";
import { stockService } from "../../../../../services/stock/stock.service";
import StockList from "../../../../../components/stock/StockList";
import StockAdjustModal from "../../../../../components/stock/StockAdjustModal";
import { stockStyles as styles } from "../../../../../components/stock/stock.styles";

export default function StockIndex() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adjustModalVisible, setAdjustModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchStock = async () => {
    try {
      const data = await stockService.fetchStock();
      
      const formattedItems = data
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
      
      if (!refreshing) {
        Toast.show({
          type: 'success',
          text1: 'Stock Updated',
          text2: `${formattedItems.length} items loaded`,
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
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

  useFocusEffect(
    useCallback(() => {
      fetchStock();
    }, [])
  );

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

  const handleStockAdjust = async (values, { resetForm }) => {
    setUpdateLoading(true);
    try {
      await stockService.adjustStock(selectedItem.id, values.adjustment);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Stock ${values.adjustment > 0 ? 'increased' : 'decreased'} by ${Math.abs(values.adjustment)} units`,
        position: 'top',
        visibilityTime: 3000,
      });
      
      resetForm();
      setAdjustModalVisible(false);
      fetchStock();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.payload?.message || 'Update failed',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setUpdateLoading(false);
    }
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

        <StockAdjustModal
          visible={adjustModalVisible}
          item={selectedItem}
          onClose={() => setAdjustModalVisible(false)}
          onSubmit={handleStockAdjust}
          loading={updateLoading}
        />
      </View>
      <Toast />
    </>
  );
}