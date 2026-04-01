import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import colors from "../../../../../constants/colors";
import { inventoryService } from "../../../../../services/inventory/inventory.service";
import InventoryForm from "../../../../../components/inventory/InventoryForm";
import { inventoryStyles as styles } from "../../../../../components/inventory/inventory.styles";

export default function AddItem() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingItems, setExistingItems] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await inventoryService.fetchInventory();
      setExistingItems(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Failed to load items',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await inventoryService.fetchCategories();
      setCategories(
        data.map(c => ({
          label: c.name,
          value: c._id || c.id,
        }))
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Failed to load categories',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    
    const lowercaseName = values.name.trim().toLowerCase();
    const isDuplicate = existingItems.some(item =>
      item.name.toLowerCase() === lowercaseName
    );

    if (isDuplicate) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'An item with this name already exists in inventory',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      const payload = {
        name: values.name.trim(),
        category: values.category,
        unitType: values.unitType,
        reorderLevel: parseInt(values.reorderLevel, 10) || 10,
        buyingPrice: parseFloat(values.buyingPrice),
        sellingPrice: parseFloat(values.sellingPrice),
      };

      await inventoryService.addItem(payload);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${values.name} has been added to inventory`,
        position: 'top',
        visibilityTime: 3000,
      });

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: error.response?.data?.payload?.message || 'Failed to add item',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    name: "",
    category: "",
    unitType: "",
    reorderLevel: "10",
    buyingPrice: "",
    sellingPrice: "",
  };

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={28} color={colors.DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ADD NEW ITEM</Text>
          <View style={styles.headerRightSpace} />
        </View>

        <InventoryForm
          initialValues={initialValues}
          onSubmit={handleSave}
          categories={categories}
          existingItems={existingItems}
          loading={loading}
          btnLabel="Save Item"
        />
      </View>
      <Toast />
    </>
  );
}