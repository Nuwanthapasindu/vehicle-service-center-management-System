import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import Toast from 'react-native-toast-message';
import { router } from "expo-router";

import colors from "../../constants/colors";
import CategorySchema from "../../schema/categorySchema";
import { updateCategory, deleteCategory } from "../../services/category/category.service";
import { styles } from "./category.styles";
import CategoryForm from "./CategoryForm";

export default function EditCategoryModal({ visible, category, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  if (!category) return null;

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      await updateCategory(category.id, values.name);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Category updated!' });
      onSuccess?.();
      onClose?.();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => {
    if (category.count === 0) {
      Toast.show({
        type: 'info',
        text1: 'Category Empty',
        text2: 'No items found in this category.',
        position: 'top',
        visibilityTime: 3000
      });
      return;
    }

    router.push({
      pathname: "/(protected)/(admin)/(Inventory)/(inventory)",
      params: { category: category.name }
    });
    onClose?.();
  };

  const handleDelete = async () => {
    try {
      await CategorySchema.validateAt('count', { count: category.count });
      
      Alert.alert(
        "Delete Category",
        `Are you sure you want to delete "${category?.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: confirmDelete },
        ]
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Action Restrict',
        text2: error.message,
        visibilityTime: 3000
      });
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteCategory(category.id);
      Toast.show({ type: 'success', text1: 'Deleted', text2: 'Category removed successfully' });
      onSuccess?.();
      onClose?.();
    } catch (error) {
      const errorMsg = error.response?.data?.payload?.message || 'Delete failed';
      Toast.show({ type: 'error', text1: 'Error', text2: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <Formik
          key={category.id}
          initialValues={{ name: category.name || "" }}
          validationSchema={CategorySchema}
          onSubmit={handleUpdate}
          enableReinitialize
        >
          {(formikProps) => (
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} />
              <View style={styles.modalSheet}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeading}>Edit Category</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color={colors.DARK} />
                  </TouchableOpacity>
                </View>
                <CategoryForm 
                  {...formikProps} 
                  isEdit 
                  loading={loading} 
                  onCancel={onClose} 
                  onDelete={handleDelete}
                  onView={handleView}
                />
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Modal>
  );
}
