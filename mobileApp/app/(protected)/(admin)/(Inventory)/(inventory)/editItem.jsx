import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Formik } from "formik";
import Toast from 'react-native-toast-message';
import colors from "../../../../../constants/colors";
import enums from "../../../../../constants/enums";
import CustomInput from "../../../../../components/CustomInput";
import DropdownInput from "../../../../../components/DropdownInput";
import axios from "axios";
import InventorySchema from "../../../../../schema/inventorySchema";

export default function EditItem() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    category: "",
    unitType: "",
    reorderLevel: "10",
    buyingPrice: "",
    sellingPrice: "",
  });

  const unitOptions = Object.values(enums.INVENTORY_UNIT_TYPES);

  useEffect(() => {
    fetchCategories();
    fetchItemDetails();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      const catData = response?.data?.payload?.data || response?.data?.data || [];

      setCategories(
        catData.map(c => ({
          label: c.name,
          value: c._id || c.id,
        }))
      );
    } catch (err) {
      console.log("Category error:", err);
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
      
      try {
        const response = await axios.get(`/inventory/${id}`);
        item = response?.data?.payload?.data || response?.data?.data;
      } catch (singleItemError) {
        const allItemsResponse = await axios.get("/inventory");
        const allItems = allItemsResponse?.data?.payload?.data || allItemsResponse?.data?.data || [];
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

      Toast.show({
        type: 'success',
        text1: 'Item Loaded',
        text2: `${item.name} loaded successfully`,
        position: 'top',
        visibilityTime: 2000,
      });
    } catch (err) {
      console.log("Fetch item error:", err);
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.payload?.message || 'Failed to load item details. The item may not exist.',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (values, { resetForm }) => {
    setLoading(true);

    try {
      const payload = {
        name: values.name.trim(),
        category: values.category,
        unitType: values.unitType,
        reorderLevel: parseInt(values.reorderLevel, 10) || 10,
        buyingPrice: parseFloat(values.buyingPrice),
        sellingPrice: parseFloat(values.sellingPrice),
      };

      const response = await axios.patch(`/inventory/${id}`, payload);

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
      console.log(err);
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
      const response = await axios.delete(`/inventory/${id}`);

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
      console.log(err);
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={colors.DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>EDIT ITEM</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={InventorySchema}
            onSubmit={handleUpdate}
            enableReinitialize={true}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="information-outline" size={20} color={colors.PRIMARY} />
                    <Text style={styles.sectionTitle}>GENERAL INFORMATION</Text>
                  </View>

                  <CustomInput
                    label="Item Name"
                    placeholder="Enter item name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    error={errors.name}
                    touched={touched.name}
                    icon={<Ionicons name="cube-outline" size={20} color={colors.SECONDARY} />}
                  />

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <DropdownInput
                      value={categories.find(c => c.value === values.category)?.label || ""}
                      options={categories.map(c => c.label)}
                      onSelect={(label) => {
                        const selected = categories.find(c => c.label === label);
                        setFieldValue("category", selected?.value || "");
                      }}
                      placeholder="Select a category"
                    />
                    {touched.category && errors.category && (
                      <Text style={styles.errorText}>{errors.category}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Unit Type</Text>
                    <DropdownInput
                      value={values.unitType}
                      options={unitOptions}
                      onSelect={(v) => setFieldValue("unitType", v)}
                      placeholder="Select unit type"
                    />
                    {touched.unitType && errors.unitType && (
                      <Text style={styles.errorText}>{errors.unitType}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="package-variant" size={20} color={colors.PRIMARY} />
                    <Text style={styles.sectionTitle}>INVENTORY & STOCK</Text>
                  </View>

                  <CustomInput
                    label="Reorder Level"
                    placeholder="Enter reorder level"
                    keyboardType="numeric"
                    value={values.reorderLevel}
                    onChangeText={handleChange("reorderLevel")}
                    onBlur={handleBlur("reorderLevel")}
                    error={errors.reorderLevel}
                    touched={touched.reorderLevel}
                    icon={<MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.SECONDARY} />}
                  />
                </View>

                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="currency-usd" size={20} color={colors.PRIMARY} />
                    <Text style={styles.sectionTitle}>PRICING</Text>
                  </View>

                  <View style={styles.priceRow}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <CustomInput
                        label="Buying Price (LKR)"
                        placeholder="Enter buying price"
                        keyboardType="numeric"
                        value={values.buyingPrice}
                        onChangeText={handleChange("buyingPrice")}
                        onBlur={handleBlur("buyingPrice")}
                        error={errors.buyingPrice}
                        touched={touched.buyingPrice}
                        icon={<Ionicons name="cash-outline" size={20} color={colors.SECONDARY} />}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <CustomInput
                        label="Selling Price (LKR)"
                        placeholder="Enter selling price"
                        keyboardType="numeric"
                        value={values.sellingPrice}
                        onChangeText={handleChange("sellingPrice")}
                        onBlur={handleBlur("sellingPrice")}
                        error={errors.sellingPrice}
                        touched={touched.sellingPrice}
                        icon={<Ionicons name="cash-outline" size={20} color={colors.SECONDARY} />}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.updateBtn, loading && styles.btnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={colors.DARK} />
                      <Text style={styles.updateBtnText}> Updating...</Text>
                    </View>
                  ) : (
                    <>
                      <MaterialCommunityIcons name="check-circle" size={20} color={colors.DARK} />
                      <Text style={styles.updateBtnText}> Update Item</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteBtn, loading && styles.btnDisabled]}
                  onPress={handleDelete}
                  disabled={loading}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.LIGHT} />
                  <Text style={styles.deleteBtnText}>
                    Delete Item
                  </Text>
                </TouchableOpacity>

              </ScrollView>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </View>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.BACKGROUND_COLOR 
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: "900",
    color: colors.DARK,
    letterSpacing: 0.5,
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 40 
  },
  sectionCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.SECONDARY,
    letterSpacing: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 8,
  },
  inputGroup: {
    marginTop: 16,
  },
  priceRow: { 
    flexDirection: "row",
    marginTop: 16,
  },
  updateBtn: {
    backgroundColor: colors.PRIMARY,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  updateBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
  deleteBtn: {
    backgroundColor: colors.DANGER_COLOR,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    flexDirection: "row",
    gap: 8,
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.LIGHT,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.DARK,
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.SECONDARY,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  goBackBtn: {
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
  errorText: {
    fontSize: 12,
    color: colors.DANGER_COLOR,
    marginTop: 4,
    marginLeft: 4,
  },
});