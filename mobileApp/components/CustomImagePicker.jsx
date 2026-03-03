import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

export default function CustomImagePicker({
  imageUri,
  onImageSelected,
  title = "Tap to attach image",
  subtitle = "Upload a high-quality photo",
  aspect = [4, 3],
  quality = 1,
}) {
  const pickImage = async () => {
    try {
      // First check existing permissions
      const currentPermission =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      let hasPermission = currentPermission.granted;

      // If not granted, request permission from the user
      if (!hasPermission) {
        const requestPermission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        hasPermission = requestPermission.granted;
      }

      // If still not granted, alert the user and abort
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library in your device settings to select an image.",
          [{ text: "OK" }],
        );
        return;
      }

      // Launch the photo library picker
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: aspect,
        quality: quality,
      });

      if (!pickerResult.canceled) {
        onImageSelected(pickerResult.assets[0].uri);
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
    <TouchableOpacity
      style={styles.photoUploaderWrapper}
      activeOpacity={0.7}
      onPress={pickImage}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.uploadedImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.photoUploaderInner}>
          <View style={styles.cameraIconBg}>
            <Ionicons name="camera-outline" size={24} color={colors.PRIMARY} />
          </View>
          <Text style={styles.uploadTitle}>{title}</Text>
          <Text style={styles.uploadSubtitle}>{subtitle}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  photoUploaderWrapper: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    backgroundColor: colors.LIGHT,
    marginBottom: 24,
    overflow: "hidden", // Ensures the image respects the border radius
  },
  uploadedImage: {
    width: "100%",
    height: 180, // Keep an appropriate height for the image preview
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
});
