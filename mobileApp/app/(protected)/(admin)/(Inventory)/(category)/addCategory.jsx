import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import Toast from 'react-native-toast-message';

import colors from "../../../../../constants/colors";
import CategorySchema from "../../../../../schema/categorySchema";
import { createCategory } from "../../../../../services/category/category.service";
import { styles } from "../../../../../components/category/category.styles";
import CategoryForm from "../../../../../components/category/CategoryForm";

export default function AddCategory({ visible, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async (values, { resetForm }) => {
    setLoading(true);
    try {
      await createCategory(values.name);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Category added!' });
      resetForm();
      onSuccess?.();
      onClose?.();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.response?.data?.payload?.message || 'Failed to add category' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <Formik initialValues={{ name: "" }} validationSchema={CategorySchema} onSubmit={handleAdd}>
          {(formikProps) => (
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} />
              <View style={styles.modalSheet}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeading}>Add Category</Text>
                  <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={colors.DARK} /></TouchableOpacity>
                </View>
                <CategoryForm {...formikProps} loading={loading} onCancel={onClose} />
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Modal>
  );
}