import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { packageService } from "../../../../../services/package/package.service";
import { serviceService } from "../../../../../services/service/service.service";
import Toast from "react-native-toast-message";

import CustomImagePicker from "../../../../../components/CustomImagePicker";
import DropdownInput from "../../../../../components/DropdownInput";
import colors from "../../../../../constants/colors";
import PackageSchema from "../../../../../schema/packageSchema";
import getImageFullUrl from "../../../../../utils/getImageFullUrl";

export default function EditPackage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Basic States
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);

  // Image states
  const [imageUri, setImageUri] = useState(null);
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  // Package Object State Native Defaults
  const [initialData, setInitialData] = useState(null);

  // Api Services for multi-select Dropdown
  const [apiServices, setApiServices] = useState([]);
  const [serviceDropdown, setServiceDropdown] = useState("Select a Service");
  const [modelInput, setModelInput] = useState("");

  useEffect(() => {
    fetchServices();
    fetchPackageDetails();
  }, [id]);

  const fetchServices = async () => {
    setFetchingServices(true);
    try {
      const response = await serviceService.fetchServicesAdmin({ limit: 100 });
      const data = response.data.payload.services?.services || [];
      setApiServices(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Required services could not be fetched",
      });
      router.back();
    } finally {
      setFetchingServices(false);
    }
  };

  const fetchPackageDetails = async () => {
    try {
      const pkg = await packageService.fetchPackageById(id);

      setInitialData({
        name: pkg.name || "",
        description: pkg.description || "",
        applicableVehicalModels: pkg.applicableVehicalModels || [],
        servicesIncluded: pkg.servicesIncluded?.map((s) => s._id) || [],
        pricingTiers:
          pkg.pricingTiers?.length > 0
            ? pkg.pricingTiers
            : [{ name: "Standard", price: "" }],
        isPublished: pkg.isPublished ?? true,
      });

      if (pkg.image) {
        setUploadedImageId(pkg.image._id);
        setImageUri(getImageFullUrl(pkg.image.filePath));
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Required package could not be fetched",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePackage = async (values) => {
    setUpdating(true);
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description ? values.description.trim() : undefined,
        applicableVehicalModels: values.applicableVehicalModels,
        servicesIncluded: values.servicesIncluded,
        pricingTiers: values.pricingTiers.map((tier) => ({
          name: tier.name.trim(),
          price: Number(tier.price),
        })),
        isPublished: values.isPublished,
      };

      if (uploadedImageId && typeof uploadedImageId === "string" && imageChanged) {
        payload.image = uploadedImageId;
      }

      const response = await packageService.updatePackage(id, payload);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.payload.message || "Package updated successfully",
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Something went wrong",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePackage = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this package? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setUpdating(true);
            try {
              const response = await packageService.deletePackage(id);
              Toast.show({
                type: "success",
                text1: "Deleted",
                text2:
                  response.data.payload.message ||
                  "Package deleted successfully",
              });
              router.back();
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: error.response?.data?.payload?.message || "Failed to delete",
              });
              setUpdating(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CustomImagePicker
          imageUri={imageUri}
          onImageSelected={(uri) => {
            setImageUri(uri);
            setImageChanged(true);
          }}
          onUploadSuccess={setUploadedImageId}
          currentFileId={uploadedImageId}
          title="Tap to change package image"
          subtitle="Upload a high-quality photo"
          isMultiple={false}
        />

        {initialData && (
          <Formik
            initialValues={initialData}
            validationSchema={PackageSchema}
            onSubmit={handleUpdatePackage}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              dirty,
            }) => (
              <View style={styles.formSection}>
                {/* PACKAGE NAME Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Package Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.name && errors.name ? styles.inputError : null,
                    ]}
                    placeholder="e.g., Premium Detailing Bundle"
                    placeholderTextColor={colors.SECONDARY + "80"}
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                {/* DESCRIPTION Input */}
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
                    placeholder="Enter package details..."
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

                {/* INCLUDED SERVICES Multi-Select Dropdown */}
                <View style={[styles.inputGroup, { marginTop: 8 }]}>
                  <Text style={styles.sectionTitle}>INCLUDED SERVICES</Text>
                  {!fetchingServices ? (
                    <DropdownInput
                      value={serviceDropdown}
                      options={[
                        "Select a Service",
                        ...apiServices
                          .filter(
                            (srv) => !values.servicesIncluded.includes(srv._id),
                          )
                          .map((srv) => srv.name),
                      ]}
                      onSelect={(selectedName) => {
                        setServiceDropdown("Select a Service");
                        if (selectedName === "Select a Service") return;
                        const selectedService = apiServices.find(
                          (srv) => srv.name === selectedName,
                        );
                        if (selectedService) {
                          setFieldValue("servicesIncluded", [
                            ...values.servicesIncluded,
                            selectedService._id,
                          ]);
                        }
                      }}
                      modalTitle="Add a Service"
                    />
                  ) : (
                    <ActivityIndicator color={colors.PRIMARY} size="small" />
                  )}

                  {/* Render Selected Services Chips */}
                  <View style={styles.chipListVertical}>
                    {values.servicesIncluded.map((srvId) => {
                      const mappedService = apiServices.find(
                        (s) => s._id === srvId,
                      );
                      if (!mappedService) return null;
                      return (
                        <View key={srvId} style={styles.serviceChipCard}>
                          <Text style={styles.serviceChipText}>
                            {mappedService.name}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setFieldValue(
                                "servicesIncluded",
                                values.servicesIncluded.filter(
                                  (id) => id !== srvId,
                                ),
                              );
                            }}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color={colors.DANGER_COLOR}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>

                  {touched.servicesIncluded &&
                    typeof errors.servicesIncluded === "string" && (
                      <Text style={styles.errorText}>
                        {errors.servicesIncluded}
                      </Text>
                    )}
                </View>

                {/* VEHICLE MODELS Multi-Select Dropdown */}
                <View style={[styles.inputGroup, { marginTop: 8 }]}>
                  <Text style={styles.sectionTitle}>
                    APPLICABLE VEHICLE MODELS
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="e.g. Civic, Corolla 2024..."
                      placeholderTextColor={colors.SECONDARY + "80"}
                      value={modelInput}
                      onChangeText={setModelInput}
                      onSubmitEditing={() => {
                        const trimmed = modelInput.trim();
                        if (
                          trimmed &&
                          !values.applicableVehicalModels.includes(trimmed)
                        ) {
                          setFieldValue("applicableVehicalModels", [
                            ...values.applicableVehicalModels,
                            trimmed,
                          ]);
                          setModelInput("");
                        }
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.PRIMARY,
                        height: 48,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        const trimmed = modelInput.trim();
                        if (
                          trimmed &&
                          !values.applicableVehicalModels.includes(trimmed)
                        ) {
                          setFieldValue("applicableVehicalModels", [
                            ...values.applicableVehicalModels,
                            trimmed,
                          ]);
                          setModelInput("");
                        }
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: colors.DARK }}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.chipsRowHorizontal}>
                    {values.applicableVehicalModels.map((model) => (
                      <View key={model} style={styles.modelChip}>
                        <Text style={styles.modelChipText}>{model}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setFieldValue(
                              "applicableVehicalModels",
                              values.applicableVehicalModels.filter(
                                (m) => m !== model,
                              ),
                            );
                          }}
                        >
                          <Ionicons
                            name="close"
                            size={14}
                            color={colors.DARK}
                            style={{ marginLeft: 4 }}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {touched.applicableVehicalModels &&
                    typeof errors.applicableVehicalModels === "string" && (
                      <Text style={styles.errorText}>
                        {errors.applicableVehicalModels}
                      </Text>
                    )}
                </View>

                {/* DYNAMIC PRICING TIERS */}
                <View style={[styles.inputGroup, { marginTop: 12 }]}>
                  <Text style={styles.sectionTitle}>DYNAMIC PRICING TIERS</Text>

                  {typeof errors.pricingTiers === "string" && (
                    <Text style={[styles.errorText, { marginBottom: 10 }]}>
                      {errors.pricingTiers}
                    </Text>
                  )}

                  {/* Iterate over pricing tiers */}
                  {values.pricingTiers.map((item, index) => {
                    const priceError =
                      touched.pricingTiers?.[index]?.price &&
                      errors.pricingTiers?.[index]?.price;
                    const nameError =
                      touched.pricingTiers?.[index]?.name &&
                      errors.pricingTiers?.[index]?.name;

                    return (
                      <View
                        style={[
                          styles.splitRow,
                          index !== 0 && { marginTop: 10 },
                        ]}
                        key={index.toString()}
                      >
                        {/* Tier Name Column */}
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                          <Text style={styles.subLabel}>TIER NAME</Text>
                          <TextInput
                            style={[
                              styles.input,
                              nameError ? styles.inputError : null,
                            ]}
                            placeholder="e.g. STANDARD"
                            placeholderTextColor={colors.SECONDARY + "80"}
                            value={item.name}
                            onChangeText={handleChange(
                              `pricingTiers[${index}].name`,
                            )}
                            onBlur={handleBlur(`pricingTiers[${index}].name`)}
                          />
                          {nameError && (
                            <Text style={styles.errorText}>
                              {errors.pricingTiers[index].name}
                            </Text>
                          )}
                        </View>

                        {/* Tier Price Column */}
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
                              onChangeText={handleChange(
                                `pricingTiers[${index}].price`,
                              )}
                              onBlur={handleBlur(
                                `pricingTiers[${index}].price`,
                              )}
                            />
                            {index !== 0 && (
                              <TouchableOpacity
                                onPress={() => {
                                  const newTiers = [...values.pricingTiers];
                                  newTiers.splice(index, 1);
                                  setFieldValue("pricingTiers", newTiers);
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
                              {errors.pricingTiers[index].price}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}

                  <TouchableOpacity
                    style={styles.addVariantButton}
                    onPress={() => {
                      setFieldValue("pricingTiers", [
                        ...values.pricingTiers,
                        { name: "", price: "" },
                      ]);
                    }}
                  >
                    <Text style={styles.addVariantText}>+ Add Tier logic</Text>
                  </TouchableOpacity>
                </View>

                {/* PUBLISHED TOGGLE */}
                <View style={styles.toggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Publish Package</Text>
                    <Text style={styles.toggleSubtext}>
                      {values.isPublished
                        ? "Visible to customers"
                        : "Hidden from customers"}
                    </Text>
                  </View>
                  <Switch
                    value={values.isPublished}
                    onValueChange={(val) => setFieldValue("isPublished", val)}
                    trackColor={{ false: colors.BORDER_COLOR, true: colors.PRIMARY }}
                    thumbColor={colors.LIGHT}
                  />
                </View>

                {/* Submissions logic block */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (updating || (!dirty && !imageChanged)) && { opacity: 0.5 },
                  ]}
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                  disabled={updating || (!dirty && !imageChanged)}
                >
                  {updating ? (
                    <ActivityIndicator color={colors.DARK} />
                  ) : (
                    <Ionicons
                      name="save-outline"
                      size={20}
                      color={colors.DARK}
                    />
                  )}
                  <Text style={styles.submitButtonText}>Update Package</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  activeOpacity={0.8}
                  onPress={handleDeletePackage}
                  disabled={updating}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.DANGER_COLOR}
                  />
                  <Text style={styles.deleteButtonText}>Delete Package</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#64748B",
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  toggleSubtext: {
    fontSize: 12,
    color: colors.SECONDARY,
    marginTop: 2,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.LIGHT,
    borderWidth: 1.5,
    borderColor: colors.DANGER_COLOR,
    height: 56,
    borderRadius: 12,
    gap: 8,
    marginTop: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DANGER_COLOR,
  },
  chipListVertical: {
    gap: 10,
    marginTop: 10,
  },
  serviceChipCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  serviceChipText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.DARK,
    flex: 1,
  },
  chipsRowHorizontal: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  modelChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modelChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.DARK,
  },
});
