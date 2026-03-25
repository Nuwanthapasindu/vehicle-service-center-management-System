import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import Toast from 'react-native-toast-message';
import CustomInput from "../../../../../components/CustomInput";
import colors from "../../../../../constants/colors";
import axios from "axios";
import CategorySchema from "../../../../../schema/categorySchema";

export default function EditCategoryModal({ visible, category, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: category?.name || "",
  };

  useEffect(() => {
    if (category) {
    }
  }, [category]);

  const handleUpdate = async (values, { resetForm }) => {
    if (!values.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Category name required',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(`/categories/${category.id}`, {
        name: values.name.trim()
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Category updated successfully!',
        position: 'top',
        visibilityTime: 3000,
      });
      
      resetForm();
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Update failed',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category?.name}"? This action cannot be undone.`,
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
      const response = await axios.delete(`/categories/${category.id}`);
      
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Category deleted successfully',
        position: 'top',
        visibilityTime: 3000,
      });
      
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Delete failed',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (resetForm) => {
    resetForm();
    onClose && onClose();
  };

  if (!category) return null;

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <Formik
            key={category?.id}
            initialValues={initialValues}
            validationSchema={CategorySchema}
            onSubmit={handleUpdate}
            enableReinitialize={true}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm }) => (
              <View style={styles.modalOverlay}>
                <TouchableOpacity
                  style={StyleSheet.absoluteFillObject}
                  activeOpacity={1}
                  onPress={() => handleClose(resetForm)}
                />
                <View style={styles.modalSheet}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalHeading}>Edit Category</Text>
                    <TouchableOpacity onPress={() => handleClose(resetForm)}>
                      <Ionicons name="close" size={24} color={colors.DARK} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <CustomInput
                      label="CATEGORY NAME"
                      placeholder="Category Name"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      error={errors.name}
                      touched={touched.name}
                    />

                    <TouchableOpacity
                      style={styles.updateBtn}
                      onPress={handleSubmit}
                      disabled={loading}
                    >
                      <Ionicons 
                        name="create-outline" 
                        size={20} 
                        color={colors.DARK} 
                        style={styles.btnIcon}
                      />
                      <Text style={styles.btnText}>
                        {loading ? "Updating..." : "Update Category"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={handleDelete}
                      disabled={loading}
                    >
                      <Ionicons 
                        name="trash-outline" 
                        size={20} 
                        color={colors.LIGHT} 
                        style={styles.btnIcon}
                      />
                      <Text style={styles.deleteText}>Delete Category</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleClose(resetForm)}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </Modal>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.4)", 
    justifyContent: "flex-end" 
  },
  modalSheet: { 
    backgroundColor: colors.LIGHT, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingBottom: Platform.OS === "ios" ? 40 : 20 
  },
  modalHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 24, 
    paddingVertical: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.BORDER_COLOR 
  },
  modalHeading: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: colors.DARK 
  },
  modalBody: { 
    paddingHorizontal: 24, 
    paddingVertical: 24 
  },
  updateBtn: { 
    backgroundColor: colors.PRIMARY, 
    height: 50, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  btnText: { 
    color: colors.DARK, 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  deleteBtn: { 
    backgroundColor: colors.DANGER_COLOR, 
    height: 50, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  deleteText: { 
    color: colors.LIGHT, 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  cancelBtn: { 
    alignItems: "center", 
    marginTop: 12 
  },
  cancelText: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: colors.SECONDARY 
  },
  btnIcon: {
    marginRight: 4,
  },
});