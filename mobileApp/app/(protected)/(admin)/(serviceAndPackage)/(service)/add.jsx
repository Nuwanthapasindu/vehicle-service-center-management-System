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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DropdownInput from "../../../../../components/DropdownInput";
import CustomImagePicker from "../../../../../components/CustomImagePicker";
import colors from "../../../../../constants/colors";

export default function AddService() {
  const router = useRouter();

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CutPolish");
  const [specialCategory, setSpecialCategory] = useState("None");
  const [imageUri, setImageUri] = useState(null);

  // Dynamic Pricing Mapping
  const [pricingOptions, setPricingOptions] = useState([
    { id: "1", name: "Base", price: "" },
  ]);

  // Dropdown options
  const CATEGORIES = ["CutPolish", "Sanitation", "Protection", "Maintenance"];
  const SPECIAL_CATEGORIES = ["None", "Seasonal Availability", "Inactive"];

  const addPricingOption = () => {
    setPricingOptions([
      ...pricingOptions,
      { id: Date.now().toString(), name: "", price: "" },
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
    if (pricingOptions.length === 1) return; // Must have at least one price
    setPricingOptions(pricingOptions.filter((item) => item.id !== id));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Photo Uploader Component */}
        <CustomImagePicker
          imageUri={imageUri}
          onImageSelected={setImageUri}
          title="Tap to attach service image"
          subtitle="Upload a high-quality photo of the service"
        />

        {/* Form Fields Section */}
        <View style={styles.formSection}>
          {/* Service Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Full Exterior Polish"
              placeholderTextColor={colors.SECONDARY + "80"}
              value={serviceName}
              onChangeText={setServiceName}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter service details and what's included..."
              placeholderTextColor={colors.SECONDARY + "80"}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {/* Pricing Options and Category Map */}
        {pricingOptions.map((item, index) => (
          <View style={styles.splitRow} key={item.id}>
            {/* Price Column */}
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
                VARIANT PRICE (LKR)
              </Text>
              <TextInput
                style={styles.input}
                placeholder={index === 0 ? "499.00" : "0.00"}
                placeholderTextColor={colors.SECONDARY + "80"}
                keyboardType="numeric"
                value={item.price}
                onChangeText={(text) =>
                  updatePricingOption(item.id, "price", text)
                }
              />
            </View>

            {/* Category / Variant Name Column */}
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
                {index === 0 ? "CATEGORY" : "VARIANT NAME"}
              </Text>

              {index === 0 ? (
                /* The Category Dropdown stays locked to index 0 */
                <DropdownInput
                  value={category}
                  options={CATEGORIES}
                  onSelect={setCategory}
                  modalTitle="Select Category"
                />
              ) : (
                /* Subsequent dynamic pricing variants */
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <DropdownInput
                    placeholder="e.g. SUV"
                    placeholderTextColor={colors.SECONDARY + "80"}
                    value={category}
                    options={CATEGORIES}
                    onSelect={(value) =>
                      updatePricingOption(item.id, "name", value)
                    }
                    modalTitle="Select Category"
                  />
                  <TouchableOpacity
                    onPress={() => removePricingOption(item.id)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addVariantButton}
          onPress={addPricingOption}
        >
          <Text style={styles.addVariantText}>+ Add Price Variant</Text>
        </TouchableOpacity>

        {/* Special Category Dropdown */}
        <View style={[styles.inputGroup, { marginTop: 12 }]}>
          <Text style={styles.label}>Special Category</Text>
          <DropdownInput
            value={specialCategory}
            options={SPECIAL_CATEGORIES}
            onSelect={setSpecialCategory}
            modalTitle="Select Special Category"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={22} color={colors.DARK} />
          <Text style={styles.submitButtonText}>Create Service</Text>
        </TouchableOpacity>
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
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
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
    marginLeft: -8, // visual alignment correction
  },
  addVariantText: {
    color: colors.PRIMARY,
    fontWeight: "bold",
    fontSize: 13,
  },
  fakeDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
  },
  dropdownText: {
    fontSize: 15,
    color: colors.DARK,
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

  // Custom Modal Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.LIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR + "40",
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.SECONDARY,
  },
  modalOptionTextActive: {
    color: colors.DARK,
    fontWeight: "bold",
  },
});
