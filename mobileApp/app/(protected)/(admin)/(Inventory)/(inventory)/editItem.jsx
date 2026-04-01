import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import colors from "../../../../../constants/colors";
import { inventoryService } from "../../../../../services/inventory/inventory.service";
import InventoryForm from "../../../../../components/inventory/InventoryForm";
import { inventoryStyles as styles } from "../../../../../components/inventory/inventory.styles";

export default function EditItem() {
  const { id, itemData } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [existingItems, setExistingItems] = useState([]);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    category: "",
    unitType: "",
    reorderLevel: "10",
    buyingPrice: "",
    sellingPrice: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchItemDetails();
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await inventoryService.fetchInventory();
      setExistingItems(data);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Error fetching inventory',
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
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.payload?.message || 'Failed to load categories',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const fetchItemDetails = async () => {
    try {
      let item = null;
      if (itemData) {
        item = JSON.parse(itemData);
      } else {
        const allItems = await inventoryService.fetchInventory();
        item = allItems.find(i => i._id === id || i.id === id);
      }

      if (!item) {
        throw new Error("Item not found");
      }

      setInitialValues({
        name: item.name || "",
        category: item.category?._id || item.category || "",
        unitType: item.unitType || "",
        reorderLevel: String(item.reorderLevel || "10"),
        buyingPrice: String(item.buyingPrice || ""),
        sellingPrice: String(item.sellingPrice || ""),
      });

    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.payload?.message || 'Failed to load item details',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (values) => {
    setLoading(true);

    const lowercaseName = values.name.trim().toLowerCase();
    const isDuplicate = existingItems.some(item => 
      item.name.toLowerCase() === lowercaseName && 
      (item._id !== id && item.id !== id)
    );

    if (isDuplicate) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Another item with this name already exists in inventory',
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

      await inventoryService.updateItem(id, payload);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${values.name} has been updated`,
        position: 'top',
        visibilityTime: 3000,
      });

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.payload?.message || 'Update failed',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await inventoryService.deleteItem(id);

      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: `Item has been deleted`,
        position: 'top',
        visibilityTime: 3000,
      });

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.payload?.message || 'Delete failed',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.DANGER_COLOR} />
        <Text style={styles.errorTitle}>Unable to Load Item</Text>
        <Text style={styles.errorMessage}>The item could not be found or may have been deleted.</Text>
        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={28} color={colors.DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>EDIT ITEM</Text>
          <View style={styles.headerRightSpace} />
        </View>

        <InventoryForm
          initialValues={initialValues}
          onSubmit={handleUpdate}
          categories={categories}
          existingItems={existingItems}
          itemId={id}
          loading={loading}
          btnLabel="Update Item"
          isEdit={true}
          onDelete={handleDelete}
        />

      </View>
      <Toast />
    </>
  );
}