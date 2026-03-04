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
import CustomImagePicker from "../../../../../components/CustomImagePicker";
import DropdownInput from "../../../../../components/DropdownInput";
import AddPricingTierModal from "../../../../../components/AddPricingTierModal";
import colors from "../../../../../constants/colors";

export default function EditPackage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock initial data load
  const [packageName, setPackageName] = useState("Toyota Full Service Special");
  const [description, setDescription] = useState(
    "Comprehensive seasonal maintenance package optimized for hybrid performance, including hybrid battery health check, high-efficiency oil change, and full exterior detailing.",
  );
  const [vehicleModelDropdown, setVehicleModelDropdown] = useState(
    "All Passenger Vehicles",
  );

  // Chips configuration
  const [selectedModels, setSelectedModels] = useState([
    "Sedan",
    "SUV",
    "Truck",
  ]);
  const VEHICLE_OPTIONS = [
    "All Passenger Vehicles",
    "Commercial Vehicles",
    "Sports Models",
  ];

  // Checklist mapping
  const [includedServices, setIncludedServices] = useState([
    { id: "1", name: "Body Wash", selected: true },
    { id: "2", name: "Oil Change", selected: true },
    { id: "3", name: "Interior Cleaning", selected: false },
  ]);

  // Pricing Tiers Mapping
  const [pricingTiers, setPricingTiers] = useState([
    { id: "1", name: "LUK 10W-30", price: "16,500" },
  ]);

  const [imageUri, setImageUri] = useState(
    "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=800",
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const removeService = (id) => {
    setIncludedServices(
      includedServices.filter((service) => service.id !== id),
    );
  };

  const removePricingTier = (id) => {
    setPricingTiers(pricingTiers.filter((tier) => tier.id !== id));
  };

  const addPricingTier = (tier) => {
    setPricingTiers([
      ...pricingTiers,
      {
        id: Date.now().toString(),
        name: `${tier.name.toUpperCase()} (${tier.size})`,
        price: tier.price,
      },
    ]);
    setIsModalVisible(false);
  };

  const removeModel = (modelToRemove) => {
    setSelectedModels(
      selectedModels.filter((model) => model !== modelToRemove),
    );
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
          "Please allow access to your photo library in your device settings.",
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
      Alert.alert("Error", "Something went wrong.");
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

        {/* Form Fields Mapping */}
        <View style={styles.formSection}>
          {/* PACKAGE NAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PACKAGE NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Toyota Full Service"
              placeholderTextColor={colors.SECONDARY + "80"}
              value={packageName}
              onChangeText={setPackageName}
            />
          </View>

          {/* DESCRIPTION */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter comprehensive details..."
              placeholderTextColor={colors.SECONDARY + "80"}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Applicable Vehicle Models Dropdown & Chips */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Applicable Vehicle Models</Text>
            <DropdownInput
              value={vehicleModelDropdown}
              options={VEHICLE_OPTIONS}
              onSelect={setVehicleModelDropdown}
              modalTitle="Select Models"
            />
            {/* Chips Container */}
            <View style={styles.chipsRow}>
              {selectedModels.map((model) => (
                <View key={model} style={styles.chip}>
                  <Text style={styles.chipText}>{model}</Text>
                  <TouchableOpacity onPress={() => removeModel(model)}>
                    <Ionicons name="close" size={14} color={colors.DARK} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* INCLUDED SERVICES */}
          <View style={[styles.inputGroup, { marginTop: 8 }]}>
            <Text style={styles.label}>INCLUDED SERVICES</Text>
            <DropdownInput
              value={"Select a Service"}
              options={["Select a Service", "Body Wash", "Oil Change"]}
              onSelect={() => {}}
              modalTitle="Add a Service"
            />

            {/* Service Checklists */}
            <View style={styles.checklistContainer}>
              {includedServices.map((service) => (
                <View key={service.id} style={styles.checkListItem}>
                  <Text style={styles.checkListText}>{service.name}</Text>
                  <TouchableOpacity onPress={() => removeService(service.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.DANGER_COLOR || "#EF4444"}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* DYNAMIC PRICING TIERS */}
          <View style={[styles.inputGroup, { marginTop: 8 }]}>
            <Text style={styles.label}>DYNAMIC PRICING TIERS</Text>

            {pricingTiers.map((tier) => (
              <View key={tier.id} style={styles.pricingTierCard}>
                <View style={styles.pricingTierLeftAccent} />
                <View style={styles.pricingTierContent}>
                  <View>
                    <Text style={styles.pricingTierName}>{tier.name}</Text>
                    <Text style={styles.pricingTierPrice}>Rs {tier.price}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removePricingTier(tier.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.SECONDARY}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addTierButton}
              activeOpacity={0.7}
              onPress={() => setIsModalVisible(true)}
            >
              <Ionicons name="add" size={18} color={colors.PRIMARY} />
              <Text style={styles.addTierText}>Add Pricing Tier</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.updateButton} activeOpacity={0.8}>
            <Ionicons name="save-outline" size={20} color={colors.DARK} />
            <Text style={styles.updateButtonText}>UPDATE PACKAGE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Delete Package</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Pricing Tier Modal */}
      <AddPricingTierModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddTier={addPricingTier}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  scrollContent: {
    paddingBottom: 60,
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
    paddingHorizontal: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 11,
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
  textArea: {
    height: 120,
    paddingVertical: 16,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4", // Light green background from screenshot
    borderWidth: 1,
    borderColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.DARK,
  },
  checklistContainer: {
    gap: 8,
    marginTop: 4,
  },
  checkListItem: {
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
  checkListText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.DARK,
    flex: 1,
    marginRight: 10,
  },
  pricingTierCard: {
    flexDirection: "row",
    backgroundColor: colors.LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    overflow: "hidden", // for the left side accent
  },
  pricingTierLeftAccent: {
    width: 4,
    backgroundColor: colors.PRIMARY,
  },
  pricingTierContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pricingTierName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 4,
  },
  pricingTierPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.PRIMARY,
  },
  addTierButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.PRIMARY + "80", // Dashed visually with color mapping
    borderStyle: "dashed",
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
    backgroundColor: colors.PRIMARY + "05",
  },
  addTierText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.PRIMARY,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
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
