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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropdownInput from "./DropdownInput";
import colors from "../constants/colors";

export default function AddPricingTierModal({ visible, onClose, onAddTier }) {
  const [newTierName, setNewTierName] = useState("");
  const [newTierPrice, setNewTierPrice] = useState("");

  const SIZE_OPTIONS = [
    "Select Size",
    "SMALL",
    "MEDIUM",
    "LARGE / SUV",
    "EXTRA LARGE",
  ];

  const handleAdd = () => {
    if (!newTierName || !newTierPrice) return;
    onAddTier({
      name: newTierName,
      price: newTierPrice,
    });
    // Reset internal state on successful add
    setNewTierName("");
    setNewTierPrice("");
  };

  const handleClose = () => {
    onClose();
    // Reset internal state when cancelling
    setNewTierName("");
    setNewTierPrice("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={handleClose}
          />
          <View style={styles.modalSheet}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Add Pricing Tier</Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color={colors.DARK} />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody}>
              {/* TIER NAME */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>TIER NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Synthetic 5W-30"
                  placeholderTextColor={colors.SECONDARY + "80"}
                  value={newTierName}
                  onChangeText={setNewTierName}
                />
              </View>

              {/* TIER PRICE */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>TIER PRICE</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceInputPrefix}>Rs.</Text>
                  <TextInput
                    style={styles.priceInputField}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={newTierPrice}
                    onChangeText={setNewTierPrice}
                  />
                </View>
                <Text style={styles.modalHelpText}>
                  Enter the total price for this specific tier & size.
                </Text>
              </View>

              {/* Actions */}
              <TouchableOpacity
                style={styles.addTierModalBtn}
                onPress={handleAdd}
              >
                <Text style={styles.addTierModalText}>Add to Package</Text>
                <Ionicons
                  name="add-circle-outline"
                  size={22}
                  color={colors.DARK}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={handleClose}
              >
                <Text style={styles.cancelModalText}>Cancel and go back</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
    maxHeight: "90%",
    width: "100%",
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
  modalInputGroup: {
    gap: 8,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
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
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
  },
  priceInputPrefix: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.DARK,
    marginRight: 8,
  },
  priceInputField: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK,
  },
  modalHelpText: {
    fontSize: 12,
    color: colors.SECONDARY,
    marginTop: 4,
  },
  addTierModalBtn: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
  },
  addTierModalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
  cancelModalBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  cancelModalText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.SECONDARY,
  },
});
