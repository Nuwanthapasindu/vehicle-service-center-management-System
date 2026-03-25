import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { router } from "expo-router";
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

export default function AddItem() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const unitOptions = Object.values(enums.INVENTORY_UNIT_TYPES);

  useEffect(() => {
    fetchCategories();
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
    } catch (error) {
      console.error("Error fetching categories:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Failed to load categories',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const handleSave = async (values, { resetForm }) => {
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

      const response = await axios.post("/inventory", payload);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${values.name} has been added to inventory`,
        position: 'top',
        visibilityTime: 3000,
      });
      
      resetForm();
      
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.log(error);
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={colors.DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ADD NEW ITEM</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={InventorySchema}
            onSubmit={handleSave}
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
                        setFieldValue("category", selected ? selected.value : "");
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

                  <View style={styles.priceRow}>
                    <View style={{ flex: 1 }}>
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
                  </View>
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
                        placeholder="Enter price"
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
                        placeholder="Enter price"
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
                  style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <MaterialCommunityIcons name="loading" size={20} color={colors.DARK} />
                      <Text style={styles.saveBtnText}> Saving...</Text>
                    </View>
                  ) : (
                    <>
                      <MaterialCommunityIcons name="check-circle" size={20} color={colors.DARK} />
                      <Text style={styles.saveBtnText}> Save Item</Text>
                    </>
                  )}
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
  saveBtn: {
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
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    color: colors.DANGER_COLOR,
    marginTop: 4,
    marginLeft: 4,
  },
});