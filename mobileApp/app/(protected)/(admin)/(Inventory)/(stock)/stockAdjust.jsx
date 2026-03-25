import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import Toast from 'react-native-toast-message';
import colors from "../../../../../constants/colors";
import axios from "axios";
import StockSchema from "../../../../../schema/stockSchema";

export default function StockAdjust({ visible, item, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setLoading(false);
    }
  }, [visible]);

  const handleUpdate = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/inventory/adjust/${item.id}`, {
        quantityChange: values.adjustment,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Stock ${values.adjustment > 0 ? 'increased' : 'decreased'} by ${Math.abs(values.adjustment)} units`,
        position: 'top',
        visibilityTime: 3000,
      });
      
      resetForm();
      onSuccess && onSuccess();
      onClose && onClose();
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

  const initialValues = {
    adjustment: 0,
  };

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalSheet}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeading}>Stock Adjustment</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.DARK} />
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={StockSchema}
            onSubmit={handleUpdate}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.modalBody}>
                <View style={styles.itemCard}>
                  <Text style={styles.cardLabel}>SELECTED ITEM</Text>
                  <Text style={styles.itemName}>{item?.name || "Item Name"}</Text>
                  <View style={styles.stockRow}>
                    <Text style={styles.stockLabel}>Current Stock: </Text>
                    <View style={[
                      styles.stockBadge,
                      { backgroundColor: item?.stock <= (item?.reorderLevel || 10) ? "#FEE2E2" : "#ECFDF5" }
                    ]}>
                      <Text style={[
                        styles.stockValue,
                        { color: item?.stock <= (item?.reorderLevel || 10) ? colors.DANGER_COLOR : "#065F46" }
                      ]}>
                        {item?.stock || 0} units
                      </Text>
                    </View>
                  </View>
                  {item?.reorderLevel && (
                    <Text style={styles.reorderText}>
                      Reorder Level: {item.reorderLevel} units
                    </Text>
                  )}
                </View>

                <Text style={styles.adjustmentLabel}>Adjustment Quantity</Text>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity 
                    style={styles.stepBtn} 
                    onPress={() => setFieldValue("adjustment", values.adjustment - 1)}
                    disabled={loading}
                  >
                    <Ionicons name="remove" size={24} color={colors.DARK} />
                  </TouchableOpacity>
                  
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      style={[
                        styles.qtyInput,
                        touched.adjustment && errors.adjustment && styles.inputError
                      ]}
                      keyboardType="numeric"
                      value={values.adjustment.toString()}
                      onChangeText={(val) => setFieldValue("adjustment", parseInt(val) || 0)}
                      onBlur={handleBlur("adjustment")}
                      editable={!loading}
                    />
                  </View>

                  <TouchableOpacity 
                    style={styles.stepBtn} 
                    onPress={() => setFieldValue("adjustment", values.adjustment + 1)}
                    disabled={loading}
                  >
                    <Ionicons name="add" size={24} color={colors.DARK} />
                  </TouchableOpacity>
                </View>
                {touched.adjustment && errors.adjustment && (
                  <Text style={styles.errorText}>{errors.adjustment}</Text>
                )}
                {!errors.adjustment && (
                  <Text style={styles.hintText}>
                    {values.adjustment > 0 ? `+${values.adjustment} units will be added` : 
                     values.adjustment < 0 ? `${values.adjustment} units will be removed` : 
                     "Use +/- to adjust or type directly"}
                  </Text>
                )}

                <View style={styles.infoBox}>
                  <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
                  <Text style={styles.infoText}>
                    Stock adjustments are logged and visible to administrators. Please ensure accuracy before updating.
                  </Text>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.updateBtn, 
                    loading && { opacity: 0.7 },
                    values.adjustment !== 0 && values.adjustment > 0 && styles.increaseBtn,
                    values.adjustment !== 0 && values.adjustment < 0 && styles.decreaseBtn
                  ]} 
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <MaterialCommunityIcons 
                    name={values.adjustment > 0 ? "plus-circle" : values.adjustment < 0 ? "minus-circle" : "swap-vertical"} 
                    size={20} 
                    color={colors.DARK} 
                  />
                  <Text style={styles.updateBtnText}>
                    {loading ? " Updating..." : 
                     values.adjustment > 0 ? ` Add ${values.adjustment} Units` : 
                     values.adjustment < 0 ? ` Remove ${Math.abs(values.adjustment)} Units` : 
                     " Update Stock"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </View>
      <Toast />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "flex-end" 
  },
  dismissArea: { 
    ...StyleSheet.absoluteFillObject 
  },
  modalSheet: { 
    backgroundColor: colors.LIGHT, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    paddingBottom: Platform.OS === "ios" ? 40 : 20 
  },
  modalHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.BORDER_COLOR 
  },
  modalHeading: { 
    fontSize: 18, 
    fontWeight: "700",
    color: colors.DARK 
  },
  modalBody: { 
    padding: 20 
  },
  
  itemCard: { 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR, 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 20,
    backgroundColor: colors.LIGHT
  },
  cardLabel: { 
    fontSize: 10, 
    color: colors.SECONDARY, 
    fontWeight: "700", 
    marginBottom: 4 
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: colors.DARK, 
    marginBottom: 8 
  },
  stockRow: { 
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 4
  },
  stockLabel: { 
    fontSize: 13, 
    color: colors.SECONDARY 
  },
  stockBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 12 
  },
  stockValue: { 
    fontWeight: "600", 
    fontSize: 12 
  },
  reorderText: {
    fontSize: 11,
    color: colors.SECONDARY,
    marginTop: 4
  },

  adjustmentLabel: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: colors.DARK, 
    marginBottom: 12 
  },
  stepperContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 8 
  },
  stepBtn: { 
    width: 60, 
    height: 60, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: colors.LIGHT
  },
  inputWrapper: { 
    flex: 1, 
    height: 60, 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR, 
    borderRadius: 12, 
    marginHorizontal: 10,
    justifyContent: "center",
    backgroundColor: colors.LIGHT
  },
  qtyInput: { 
    textAlign: "center", 
    fontSize: 24, 
    fontWeight: "bold",
    color: colors.DARK
  },
  inputError: {
    color: colors.DANGER_COLOR,
  },
  hintText: { 
    fontSize: 12, 
    color: colors.SECONDARY, 
    textAlign: "left", 
    marginBottom: 25 
  },
  errorText: {
    fontSize: 12,
    color: colors.DANGER_COLOR,
    textAlign: "left",
    marginBottom: 25,
  },

  infoBox: { 
    flexDirection: "row", 
    backgroundColor: "#EFF6FF", 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 25,
    alignItems: "center"
  },
  infoText: { 
    flex: 1, 
    fontSize: 12, 
    color: "#1E40AF", 
    marginLeft: 8, 
    lineHeight: 18 
  },

  updateBtn: { 
    backgroundColor: colors.PRIMARY, 
    height: 55, 
    borderRadius: 12, 
    flexDirection: "row",
    justifyContent: "center", 
    alignItems: "center",
    gap: 8
  },
  increaseBtn: {
    backgroundColor: colors.PRIMARY
  },
  decreaseBtn: {
    backgroundColor: colors.DANGER_COLOR
  },
  updateBtnText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: colors.DARK 
  }
});