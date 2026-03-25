import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import Toast from 'react-native-toast-message';
import CustomInput from "../../../../../components/CustomInput";
import colors from "../../../../../constants/colors";
import axios from "axios";
import CategorySchema from "../../../../../schema/categorySchema";

export default function AddCategory({
  visible,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: "",
  };

  const handleAdd = async (values, { resetForm }) => {
    setLoading(true);

    try {
      const response = await axios.post("/categories", { 
        name: values.name.trim() 
      });

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Category added successfully!',
          position: 'top',
          visibilityTime: 3000,
        });

        resetForm();
        onSuccess && onSuccess(); 
        if (onClose) onClose(); 
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.payload?.message || 'Failed to add category',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (resetForm) => {
    resetForm(); 
    if (onClose) onClose();
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={CategorySchema}
            onSubmit={handleAdd}
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
                    <Text style={styles.modalHeading}>Add Category</Text>
                    <TouchableOpacity onPress={() => handleClose(resetForm)}>
                      <Ionicons name="close" size={24} color={colors.DARK} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <CustomInput
                      label="CATEGORY NAME"
                      placeholder="e.g. Engine Oil"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      error={errors.name}
                      touched={touched.name}
                    />

                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={handleSubmit}
                      disabled={loading}
                    >
                      <Text style={styles.addBtnText}>
                        {loading ? "Adding..." : "Add Category"}
                      </Text>
                      <Ionicons
                        name="add-circle-outline"
                        size={22}
                        color={colors.DARK}
                      />
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
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: colors.LIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },

  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.DARK,
  },

  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  addBtn: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
  },

  addBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },

  cancelBtn: {
    alignItems: "center",
    marginTop: 12,
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.SECONDARY,
  },
});