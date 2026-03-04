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
  Switch,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomImagePicker from "../../../../../components/CustomImagePicker";
import DropdownInput from "../../../../../components/DropdownInput";
import AddPricingTierModal from "../../../../../components/AddPricingTierModal";
import colors from "../../../../../constants/colors";

export default function AddPackage() {
  const router = useRouter();

  // Basic Form States
  const [imageUri, setImageUri] = useState(null);
  const [packageName, setPackageName] = useState("");
  const [description, setDescription] = useState("");

  // Included Services
  const [selectedServices, setSelectedServices] = useState([
    { id: "1", name: "Body Wash" },
    { id: "2", name: "Oil Change" },
    { id: "3", name: "Interior Cleaning" },
  ]);
  const [serviceDropdown, setServiceDropdown] = useState("Select a Service");
  const SERVICE_OPTIONS = [
    "Select a Service",
    "Waxing",
    "Tire Shine",
    "Engine Detail",
  ];

  // Vehicle Models
  const [selectedModels, setSelectedModels] = useState([
    "Sedan",
    "SUV",
    "Truck",
  ]);
  const [vehicleDropdown, setVehicleDropdown] = useState(
    "All Passenger Vehicles",
  );
  const VEHICLE_OPTIONS = [
    "All Passenger Vehicles",
    "Commercial Vehicles",
    "Sports Models",
  ];

  // Pricing Tiers State
  const [pricingTiers, setPricingTiers] = useState([
    { id: "t1", sizeName: "SMALL", price: "150", icon: "car-sport-outline" },
    { id: "t2", sizeName: "MEDIUM", price: "185", icon: "car-outline" },
    { id: "t3", sizeName: "LARGE / SUV", price: "225", icon: "bus-outline" },
    {
      id: "t4",
      sizeName: "EXTRA LARGE",
      price: "275",
      icon: "car-sport-outline",
    },
  ]);

  const [isVisibleToCustomers, setIsVisibleToCustomers] = useState(true);

  // Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);

  const removeService = (id) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== id));
  };

  const removeModel = (modelToRemove) => {
    setSelectedModels(selectedModels.filter((m) => m !== modelToRemove));
  };

  const addCustomTier = (tier) => {
    setPricingTiers([
      ...pricingTiers,
      {
        id: Date.now().toString(),
        sizeName: `${tier.name.toUpperCase()} (${tier.size})`,
        price: tier.price,
        icon: "pricetag-outline",
      },
    ]);
    setIsModalVisible(false);
  };

  const updateTierPrice = (id, newPrice) => {
    setPricingTiers(
      pricingTiers.map((tier) =>
        tier.id === id ? { ...tier, price: newPrice } : tier,
      ),
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Photo Uploader */}
        <CustomImagePicker
          imageUri={imageUri}
          onImageSelected={setImageUri}
          title="Tap to attach service image"
          subtitle="Upload a high-quality photo of the service"
        />

        <View style={styles.formSection}>
          {/* PACKAGE NAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Package Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Exterior Detail"
              placeholderTextColor={colors.SECONDARY + "80"}
              value={packageName}
              onChangeText={setPackageName}
            />
          </View>

          {/* DESCRIPTION */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Complete foam wash, clay bar treatment..."
              placeholderTextColor={colors.SECONDARY + "80"}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* INCLUDED SERVICES */}
          <View style={[styles.inputGroup, { marginTop: 8 }]}>
            <Text style={styles.sectionTitle}>INCLUDED SERVICES</Text>
            <DropdownInput
              value={serviceDropdown}
              options={SERVICE_OPTIONS}
              onSelect={setServiceDropdown}
              modalTitle="Add a Service"
            />
            {/* Render selected services */}
            <View style={styles.chipListVertical}>
              {selectedServices.map((service) => (
                <View key={service.id} style={styles.serviceChipCard}>
                  <Text style={styles.serviceChipText}>{service.name}</Text>
                  <TouchableOpacity onPress={() => removeService(service.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.DANGER_COLOR}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* VEHICLE MODELS */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Applicable Vehicle Models</Text>
            <DropdownInput
              value={vehicleDropdown}
              options={VEHICLE_OPTIONS}
              onSelect={setVehicleDropdown}
              modalTitle="Select Models"
            />
            <View style={styles.chipsRowHorizontal}>
              {selectedModels.map((model) => (
                <View key={model} style={styles.modelChip}>
                  <Text style={styles.modelChipText}>{model}</Text>
                  <TouchableOpacity onPress={() => removeModel(model)}>
                    <Ionicons
                      name="close"
                      size={14}
                      color={colors.DARK}
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addMoreChip}>
                <Text style={styles.addMoreChipText}>+ Add More</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DYNAMIC PRICING TIERS */}
          <View style={[styles.inputGroup, { marginTop: 12 }]}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Dynamic Pricing Tiers</Text>
              <Text style={styles.currencySubtitle}>USD ($)</Text>
            </View>

            <View style={styles.pricingGrid}>
              {pricingTiers.map((tier) => (
                <View key={tier.id} style={styles.pricingCard}>
                  <View style={styles.pricingCardHeader}>
                    <Ionicons
                      name={tier.icon}
                      size={16}
                      color={colors.PRIMARY}
                    />
                    <Text style={styles.pricingCardTitle}>{tier.sizeName}</Text>
                  </View>
                  <View style={styles.pricingInputWrapper}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.pricingInput}
                      value={tier.price}
                      onChangeText={(val) => updateTierPrice(tier.id, val)}
                      keyboardType="numeric"
                      placeholder="0.00"
                    />
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addCustomTierBtn}
              activeOpacity={0.7}
              onPress={() => setIsModalVisible(true)}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.SECONDARY}
              />
              <Text style={styles.addCustomTierText}>Add Custom Tier</Text>
            </TouchableOpacity>
          </View>

          {/* VISIBLE TO CUSTOMERS */}
          <View style={styles.visibilityCard}>
            <View style={styles.visibilityIconBg}>
              <Ionicons name="eye-outline" size={20} color={colors.PRIMARY} />
            </View>
            <View style={styles.visibilityContent}>
              <Text style={styles.visibilityTitle}>Visible to Customers</Text>
              <Text style={styles.visibilitySub}>
                Show this package on the booking site
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#E2E8F0", true: colors.PRIMARY }}
              thumbColor={colors.LIGHT}
              ios_backgroundColor="#E2E8F0"
              onValueChange={setIsVisibleToCustomers}
              value={isVisibleToCustomers}
            />
          </View>
        </View>
      </ScrollView>

      {/* STICKY SAVE BUTTON */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Text style={styles.saveButtonText}>Save Package</Text>
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={colors.DARK}
          />
        </TouchableOpacity>
      </View>

      {/* Add Pricing Tier Modal */}
      <AddPricingTierModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddTier={addCustomTier}
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
    padding: 24,
    paddingBottom: 120, // leave space for sticky footer
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#64748B",
  },
  currencySubtitle: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.SECONDARY,
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
    height: 100,
    paddingVertical: 16,
  },
  chipListVertical: {
    gap: 10,
    marginTop: 4,
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
    marginTop: 4,
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
  addMoreChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addMoreChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.DARK,
  },
  pricingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  pricingCard: {
    width: "48%",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 12,
    padding: 12,
  },
  pricingCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  pricingCardTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.SECONDARY,
    textTransform: "uppercase",
  },
  pricingInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.BACKGROUND_COLOR,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  currencySymbol: {
    fontSize: 15,
    fontWeight: "700",
    color: "#94A3B8",
    marginRight: 6,
  },
  pricingInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
  },
  addCustomTierBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.BORDER_COLOR,
    borderStyle: "dashed",
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  addCustomTierText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.SECONDARY,
  },
  visibilityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginTop: 12,
  },
  visibilityIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E4F7D4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  visibilityContent: {
    flex: 1,
  },
  visibilityTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.DARK,
  },
  visibilitySub: {
    fontSize: 12,
    color: colors.SECONDARY,
    marginTop: 2,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.LIGHT,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  saveButton: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
});
