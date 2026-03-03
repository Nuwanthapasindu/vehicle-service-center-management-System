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
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DropdownInput from "../../../../../components/DropdownInput";
import colors from "../../../../../constants/colors";

export default function EditService() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // MOCK initial data load matching design
  const [serviceName, setServiceName] = useState("Ceramic Coating");
  const [description, setDescription] = useState(
    "High-durability nano-ceramic protective layer providing hydrophobic properties and long-lasting gloss enhancement for automotive paint.",
  );
  const [category, setCategory] = useState("CutPolish");

  // Dynamic Pricing Mapping setup to match `add.jsx`
  const [pricingOptions, setPricingOptions] = useState([
    { id: "1", name: "Base", price: "499.00" },
  ]);

  // Use a placeholder URI or null for standard blank view, but we'll supply a random image string mock so it renders full screen on load if needed
  const [imageUri, setImageUri] = useState(
    "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=800",
  );

  const CATEGORIES = ["CutPolish", "Sanitation", "Protection", "Maintenance"];

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

  const pickImage = async () => {
    try {
      const currentPermission =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      let hasPermission = currentPermission.granted;

      if (!hasPermission) {
        const requestPermission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        hasPermission = requestPermission.granted;
      }

      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library in your device settings to select a service image.",
          [{ text: "OK" }],
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        setImageUri(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Error",
        "Something went wrong while trying to select an image.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Hero Image */}
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons
                name="image-outline"
                size={40}
                color={colors.SECONDARY}
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.editImageBtn}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={14} color={colors.LIGHT} />
            <Text style={styles.editImageText}>Edit Image</Text>
          </TouchableOpacity>
        </View>

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
                    value={item.name}
                    options={CATEGORIES}
                    onSelect={(value) =>
                      updatePricingOption(item.id, "name", value)
                    }
                    modalTitle="Select Variant Category"
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

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.updateButton} activeOpacity={0.8}>
            <Ionicons name="save-outline" size={20} color={colors.DARK} />
            <Text style={styles.updateButtonText}>Update Service</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} activeOpacity={0.8}>
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
    paddingBottom: 50, // Extra padding for the bottom buttons
  },
  imageContainer: {
    width: "100%",
    height: 220,
    position: "relative",
    marginBottom: 24,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroPlaceholder: {
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  editImageBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.DARK,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editImageText: {
    color: colors.LIGHT,
    fontSize: 13,
    fontWeight: "600",
  },
  formSection: {
    paddingHorizontal: 24,
    gap: 20,
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
