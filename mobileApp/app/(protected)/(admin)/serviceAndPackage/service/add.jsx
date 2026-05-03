import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { serviceService } from "../../../../../services/service/service.service";
import Toast from "react-native-toast-message";

import DropdownInput from "../../../../../components/DropdownInput";
import CustomImagePicker from "../../../../../components/CustomImagePicker";
import colors from "../../../../../constants/colors";
import enums from "../../../../../constants/enums";
import ServiceSchema from "../../../../../schema/serviceSchema";

const VEHICLE_TYPES = Object.values(enums.VEHICLE_TYPES);

export default function AddService() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [uploadedImageId, setUploadedImageId] = useState(null);

  const initialValues = {
    name: "",
    description: "",
    prices: [{ model: "CAR", price: "" }],
  };

  const handleCreateService = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description ? values.description.trim() : undefined,
        prices: values.prices.map((p) => ({
          model: p.model,
          price: Number(p.price),
        })),
        ...(uploadedImageId && { image: uploadedImageId }),
      };

      const response = await serviceService.createService(payload);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.payload.message || "Service created successfully",
      });

      resetForm();
      setImageUri(null);
      setUploadedImageId(null);
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CustomImagePicker
          imageUri={imageUri}
          onImageSelected={setImageUri}
          onUploadSuccess={setUploadedImageId}
          title="Tap to attach service image"
          subtitle="Upload a high-quality photo of the service"
          isMultiple={false}
        />

        <Formik
          initialValues={initialValues}
          validationSchema={ServiceSchema}
          onSubmit={handleCreateService}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formSection}>
              {/* Service Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.name && errors.name ? styles.inputError : null,
                  ]}
                  placeholder="e.g., Full Exterior Polish"
                  placeholderTextColor={colors.SECONDARY + "80"}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Description Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    touched.description && errors.description
                      ? styles.inputError
                      : null,
                  ]}
                  placeholder="Enter service details and what's included..."
                  placeholderTextColor={colors.SECONDARY + "80"}
                  multiline
                  textAlignVertical="top"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                />
                {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}
              </View>

              {typeof errors.prices === "string" && (
                <Text style={[styles.errorText, { marginTop: 10 }]}>
                  {errors.prices}
                </Text>
              )}

              {/* Pricing Options */}
              {values.prices.map((item, index) => {
                const priceError =
                  touched.prices?.[index]?.price &&
                  errors.prices?.[index]?.price;
                return (
                  <View
                    style={[styles.splitRow, index !== 0 && { marginTop: 10 }]}
                    key={index.toString()}
                  >
                    {/* Category / Variant Name Column */}
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.subLabel}>VEHICLE MODEL</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <DropdownInput
                            placeholder="e.g. CAR"
                            placeholderTextColor={colors.SECONDARY + "80"}
                            value={item.model}
                            options={VEHICLE_TYPES}
                            onSelect={(value) =>
                              setFieldValue(`prices[${index}].model`, value)
                            }
                            modalTitle="Select Model"
                          />
                        </View>
                      </View>
                    </View>

                    {/* Price Column */}
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.subLabel}>PRICE (LKR)</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <TextInput
                          style={[
                            styles.input,
                            { flex: 1 },
                            priceError ? styles.inputError : null,
                          ]}
                          placeholder="0.00"
                          placeholderTextColor={colors.SECONDARY + "80"}
                          keyboardType="numeric"
                          value={item.price.toString()}
                          onChangeText={handleChange(`prices[${index}].price`)}
                          onBlur={handleBlur(`prices[${index}].price`)}
                        />
                        {index !== 0 && (
                          <TouchableOpacity
                            onPress={() => {
                              const newPrices = [...values.prices];
                              newPrices.splice(index, 1);
                              setFieldValue("prices", newPrices);
                            }}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={24}
                              color="#EF4444"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      {priceError && (
                        <Text style={styles.errorText}>
                          {errors.prices[index].price}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}

              <TouchableOpacity
                style={styles.addVariantButton}
                onPress={() => {
                  setFieldValue("prices", [
                    ...values.prices,
                    { model: "VAN", price: "" },
                  ]);
                }}
              >
                <Text style={styles.addVariantText}>+ Add Vehicle Price</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, loading && { opacity: 0.7 }]}
                activeOpacity={0.8}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.DARK} />
                ) : (
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color={colors.DARK}
                  />
                )}
                <Text style={styles.submitButtonText}>Create Service</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  formSection: {
    gap: 20,
    marginTop: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  subLabel: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#334155",
  },
  input: {
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: colors.DARK,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
  },
  textArea: {
    height: 120,
    paddingVertical: 16,
  },
  splitRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
  },
  addVariantButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: -8,
  },
  addVariantText: {
    color: colors.PRIMARY,
    fontWeight: "bold",
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    gap: 8,
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
});
