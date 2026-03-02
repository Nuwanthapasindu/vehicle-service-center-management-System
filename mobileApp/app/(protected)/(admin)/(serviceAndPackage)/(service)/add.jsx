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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import colors from "../../../../../constants/colors";

export default function AddService() {
  const router = useRouter();

  // State mapping for the standard inputs
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <Drawer.Screen options={{ headerShown: false }} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Photo Uploader Dummy Component */}
          <TouchableOpacity
            style={styles.photoUploaderWrapper}
            activeOpacity={0.7}
          >
            <View style={styles.photoUploaderInner}>
              <View style={styles.cameraIconBg}>
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.PRIMARY}
                />
              </View>
              <Text style={styles.uploadTitle}>
                Tap to attach service image
              </Text>
              <Text style={styles.uploadSubtitle}>
                Upload a high-quality photo of the service
              </Text>
            </View>
          </TouchableOpacity>

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

          {/* Split Price / Category Row */}
          <View style={styles.splitRow}>
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
                BASE PRICE ($)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="499.00"
                placeholderTextColor={colors.SECONDARY + "80"}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
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
                CATEGORY
              </Text>
              <View style={styles.fakeDropdown}>
                <Text style={styles.dropdownText}>CutPolish</Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.SECONDARY}
                />
              </View>
            </View>
          </View>

          {/* Special Category Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Category</Text>
            <View style={styles.fakeDropdown}>
              <Text style={styles.dropdownText}>None</Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.SECONDARY}
              />
            </View>
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
  photoUploaderWrapper: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#CBD5E1", // Soft bluish-gray standard dashboard dashed outline
    borderStyle: "dashed",
    backgroundColor: colors.LIGHT,
    marginBottom: 24,
  },
  photoUploaderInner: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.PRIMARY + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: colors.SECONDARY,
    textAlign: "center",
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
    color: "#334155", // A darker grayish neutral suitable for form labeling
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
  footerContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: colors.BACKGROUND_COLOR,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR + "50",
  },
  submitButton: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
});
