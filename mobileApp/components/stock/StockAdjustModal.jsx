import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import Toast from 'react-native-toast-message';
import colors from "../../constants/colors";
import StockSchema from "../../schema/stockSchema";
import { stockStyles as styles } from "./stock.styles";

export default function StockAdjustModal({ visible, item, onClose, onSubmit, loading }) {
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
            onSubmit={onSubmit}
          >
            {({ handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
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
                    <Text style={styles.modalReorderText}>
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
