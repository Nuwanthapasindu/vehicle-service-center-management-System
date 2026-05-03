import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { serviceService } from "../../../../../services/service/service.service";
import Toast from "react-native-toast-message";

import DropdownInput from "../../../../../components/DropdownInput";
import CustomImagePicker from "../../../../../components/CustomImagePicker";
import colors from "../../../../../constants/colors";
import enums from "../../../../../constants/enums";
import getImageFullUrl from "../../../../../utils/getImageFullUrl";

const VEHICLE_TYPES = Object.values(enums.VEHICLE_TYPES);

export default function EditService() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [pricingOptions, setPricingOptions] = useState([
    { id: "1", model: VEHICLE_TYPES[0], price: "" },
  ]);

  const [imageUri, setImageUri] = useState(null);
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (id) fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const data = await serviceService.fetchServiceById(id);
      setServiceName(data.name);
      setDescription(data.description || "");

      if (data.image) {
        setUploadedImageId(data.image._id || data.image);
        if (data.image.filePath) {
         
          setImageUri(getImageFullUrl(data.image.filePath));
        }
      }

      const prices =
        data.prices && data.prices.length > 0
          ? data.prices.map((p, i) => ({
              id: i.toString(),
              model: p.model,
              price: p.price.toString(),
            }))
          : [{ id: "1", model: VEHICLE_TYPES[0], price: "" }];

      setPricingOptions(prices);

      // Store a snapshot for dirty-checking
      setOriginalData({
        name: data.name,
        description: data.description || "",
        pricingOptions: prices,
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch service details",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const addPricingOption = () => {
    setPricingOptions([
      ...pricingOptions,
      { id: Date.now().toString(), model: VEHICLE_TYPES[0], price: "" },
    ]);
  };

  const updatePricingOption = (id, field, value) => {
    setPricingOptions(
      pricingOptions.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const removePricingOption = (id) => {
    if (pricingOptions.length === 1) return;
    setPricingOptions(pricingOptions.filter((item) => item.id !== id));
  };

  const handleUpdate = async () => {
    if (!serviceName.trim()) {
      return Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Service name is required.",
      });
    }

    setUpdating(true);
    try {
      const payload = {
        name: serviceName.trim(),
        description: description ? description.trim() : undefined,
        prices: pricingOptions.map((p) => ({
          model: p.model,
          price: Number(p.price),
        })),
      };

      if (uploadedImageId && typeof uploadedImageId === "string" && imageChanged) {
        payload.image = uploadedImageId;
      }

      await serviceService.updateService(id, payload);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Service updated successfully",
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to update service",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Derive hasChanges based on comparison against original snapshot
  const hasChanges = (() => {
    if (imageChanged) return true;
    if (!originalData) return false;
    if (serviceName !== originalData.name) return true;
    if (description !== originalData.description) return true;
    if (pricingOptions.length !== originalData.pricingOptions.length) return true;
    for (let i = 0; i < pricingOptions.length; i++) {
      const cur = pricingOptions[i];
      const orig = originalData.pricingOptions[i];
      if (cur.model !== orig.model || cur.price !== orig.price) return true;
    }
    return false;
  })();

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this service? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setUpdating(true);
              await serviceService.deleteService(id);
              Toast.show({
                type: "success",
                text1: "Deleted",
                text2: "Service has been deleted",
              });
              router.back();
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2:
                  error.response?.data?.message || "Failed to delete service",
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
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
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
          title="Tap to change service image"
          subtitle="Upload a new high-quality photo"
          isMultiple={false}
        />

        {/* Form Fields Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>SERVICE NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Ceramic Coating"
              placeholderTextColor={colors.SECONDARY + "80"}
              value={serviceName}
              onChangeText={setServiceName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter service details..."
              placeholderTextColor={colors.SECONDARY + "80"}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {/* Dynamic Pricing Variants */}
        {pricingOptions.map((item, index) => (
          <View style={styles.splitRow} key={item.id}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 10,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  },
                ]}
              >
                PRICE (LKR)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={colors.SECONDARY + "80"}
                keyboardType="numeric"
                value={item.price}
                onChangeText={(text) =>
                  updatePricingOption(item.id, "price", text)
                }
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: 10,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  },
                ]}
              >
                VEHICLE MODEL
              </Text>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View style={{ flex: 1 }}>
                  <DropdownInput
                    value={item.model}
                    options={VEHICLE_TYPES}
                    onSelect={(value) =>
                      updatePricingOption(item.id, "model", value)
                    }
                    modalTitle="Select Model"
                  />
                </View>
                {pricingOptions.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removePricingOption(item.id)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addVariantButton}
          onPress={addPricingOption}
        >
          <Text style={styles.addVariantText}>+ Add Price Variant</Text>
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.updateButton,
              (updating || !hasChanges) && { opacity: 0.5 },
            ]}
            activeOpacity={0.8}
            onPress={handleUpdate}
            disabled={updating || !hasChanges}
          >
            {updating ? (
              <ActivityIndicator color={colors.DARK} />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color={colors.DARK} />
                <Text style={styles.updateButtonText}>Update Service</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.8}
            onPress={handleDelete}
            disabled={updating}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Delete Service</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 16,
    paddingBottom: 50, // Extra padding for the bottom buttons
  },
  formSection: {
    paddingHorizontal: 24,
    gap: 20,
    marginTop: 0,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
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
  textArea: {
    height: 120,
    paddingVertical: 16,
  },
  splitRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
    marginTop: 20,
  },
  addVariantButton: {
    marginLeft: 24,
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addVariantText: {
    color: colors.PRIMARY,
    fontSize: 14,
    fontWeight: "700",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginTop: 40,
    gap: 16,
  },
  updateButton: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    gap: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
  deleteButton: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },
});
