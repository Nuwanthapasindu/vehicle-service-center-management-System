import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import colors from "../constants/colors";
import useSecureStorage from "../hooks/useSecureStorage";
import storageKeys from "../constants/storageKeys";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const UPLOAD_DIR = FileSystem.documentDirectory + "uploads/";

export default function CustomImagePicker({
  imageUri,
  onImageSelected,
  onUploadSuccess,
  onUploadError,
  title = "Tap to attach image",
  subtitle = "Upload a high-quality photo",
  aspect = [9, 16],
  quality = 1,
}) {
  const { getItem } = useSecureStorage();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // "success" | "error" | null
  const [currentFileId, setCurrentFileId] = useState(null);

  const copyToUploadDir = async (uri) => {
    // Copy picked image into our app's uploads/ dir before uploading
    const filename = uri.split("/").pop();
    const destUri = UPLOAD_DIR + filename;
    await FileSystem.copyAsync({ from: uri, to: destUri });
    return { destUri, filename };
  };

  const uploadImage = async (uri) => {
    const personalAccessToken = await getItem(
      storageKeys.PERSONAL_ACCESS_TOKEN,
    );

    // If an image was already uploaded during this session, delete it first
    if (currentFileId) {
      try {
        await axios.delete(`/file/${currentFileId}`);
      } catch (err) {
        Toast.show({
          type: "error",
        text1: "Upload Failed",
        text2: err?.response?.data?.paylod?.message || "Could not upload image.",
        })
      }
    }

    setUploading(true);
    setProgress(0);
    setUploadStatus(null);

    try {
      const { destUri, filename } = await copyToUploadDir(uri);
      const ext = filename.split(".").pop().toLowerCase();
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";

      const uploadResult = await FileSystem.uploadAsync(
        `${API_URL}/file`,
        destUri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "file",
          mimeType,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${personalAccessToken}`,
          },
          sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
          uploadProgressCallback: ({
            totalBytesSent,
            totalBytesExpectedToSend,
          }) => {
            const percent = Math.round(
              (totalBytesSent / totalBytesExpectedToSend) * 100,
            );
            setProgress(percent);
          },
        },
      );

      const data = JSON.parse(uploadResult.body);

      if (uploadResult.status === 200 || uploadResult.status === 201) {
        setUploadStatus("success");
        const newFileId =
          data?.payload?.file?.id ||
          data?.payload?._id ||
          data?.payload?.file?._id;
        setCurrentFileId(newFileId);
        onUploadSuccess?.(newFileId);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      setUploadStatus("error");
      setProgress(0);
      onUploadError?.(error.message);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: error?.response?.data?.payload?.message || "Could not upload image.",
      });
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      const currentPermission =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      let hasPermission = currentPermission.granted;

      if (!hasPermission) {
        const { granted } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        hasPermission = granted;
      }

      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library in settings.",
          [{ text: "OK" }],
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        aspect,
        quality,
      });

      if (!pickerResult.canceled) {
        const uri = pickerResult.assets[0].uri;
        onImageSelected(uri);
        await uploadImage(uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Something went wrong while selecting an image.");
    }
  };

  const getOverlayIcon = () => {
    if (uploadStatus === "success")
      return { name: "checkmark-circle", color: "#10b981" };
    if (uploadStatus === "error")
      return { name: "close-circle", color: "#ef4444" };
    return null;
  };

  const overlayIcon = getOverlayIcon();

  return (
    <TouchableOpacity
      style={styles.photoUploaderWrapper}
      activeOpacity={0.7}
      onPress={pickImage}
      disabled={uploading}
    >
      {imageUri ? (
        <View>
          <Image
            source={{ uri: imageUri }}
            style={styles.uploadedImage}
            resizeMode="cover"
          />

          {(uploading || overlayIcon) && (
            <View style={styles.overlay}>
              {uploading ? (
                <View style={styles.uploadingBadge}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.uploadingText}>
                    {progress > 0 ? `${progress}%` : "Uploading..."}
                  </Text>
                </View>
              ) : (
                <Ionicons
                  name={overlayIcon.name}
                  size={40}
                  color={overlayIcon.color}
                />
              )}
            </View>
          )}

          {uploading && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
          )}
        </View>
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
    overflow: "hidden",
  },
  uploadedImage: {
    width: "100%",
    height: 180,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  uploadingText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10b981",
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
