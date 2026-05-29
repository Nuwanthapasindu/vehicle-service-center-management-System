import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import colors from "../constants/colors";
import useSecureStorage from "../hooks/useSecureStorage";
import storageKeys from "../constants/storageKeys";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const UPLOAD_DIR = FileSystem.documentDirectory + "uploads/";

export default function MultiImagePicker({
  onUploadSuccess,
  onUploadError,
  title = "Add to Gallery",
  subtitle = "Select multiple photos to upload",
}) {
  const { getItem } = useSecureStorage();
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]); 
  const [uploadedIds, setUploadedIds] = useState([]);

  const copyToUploadDir = async (uri) => {
    const filename = uri.split("/").pop();
    const destUri = UPLOAD_DIR + filename;
    
    const dirInfo = await FileSystem.getInfoAsync(UPLOAD_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(UPLOAD_DIR, { intermediates: true });
    }
    
    await FileSystem.copyAsync({ from: uri, to: destUri });
    return { destUri, filename };
  };

  // Validates that a string is a valid MongoDB ObjectId
  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

  // Cleans up already-uploaded files from the server on partial failure
  const cleanupUploadedFiles = async (ids) => {
    if (ids.length === 0) return;
    try {
      await Promise.all(ids.map((id) => axios.delete(`/file/${id}`)));
    } catch {
      // Cleanup is best-effort; don't block the error flow
    }
  };

  const uploadImages = async (uris) => {
    const personalAccessToken = await getItem(storageKeys.PERSONAL_ACCESS_TOKEN);
    setUploading(true);
    const newUploadedIds = [];

    try {
      for (let i = 0; i < uris.length; i++) {
        const uri = uris[i];
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
          }
        );

        // Validate HTTP status
        if (uploadResult.status !== 200 && uploadResult.status !== 201) {
          throw new Error(
            `Upload failed for image ${i + 1}/${uris.length} (HTTP ${uploadResult.status})`
          );
        }

        const data = JSON.parse(uploadResult.body);
        const fileId =
          data?.payload?.file?.id ||
          data?.payload?._id ||
          data?.payload?.file?._id;

        // Validate the returned file ID
        if (!fileId || !isValidObjectId(String(fileId))) {
          throw new Error(
            `Server returned an invalid file ID for image ${i + 1}/${uris.length}`
          );
        }

        newUploadedIds.push(fileId);
        // Update uploadedIds state as we go to show checkmarks
        setUploadedIds((prev) => [...prev, fileId]);
      }

      // All uploads succeeded — notify parent
      onUploadSuccess?.(newUploadedIds);

      Toast.show({
        type: "success",
        text1: "Upload Complete",
        text2: `Successfully uploaded ${newUploadedIds.length} image${newUploadedIds.length > 1 ? "s" : ""}`,
      });
    } catch (error) {
      // Rollback: delete any files that were already uploaded in this batch
      await cleanupUploadedFiles(newUploadedIds);
      setUploadedIds([]);
      setPreviews([]);

      onUploadError?.(error.message);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: error.message || "Something went wrong while uploading images",
      });
    } finally {
      setUploading(false);
    }
  };

  const pickImages = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Required", "Please allow access to your photo library.");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        // Cleanup previous uploads if they exist
        if (uploadedIds.length > 0) {
          uploadedIds.forEach(id => {
            axios.delete(`/file/${id}`).catch(err => {
              Toast.show({
                type: "error",
                text1: "Cleanup Error",
                text2: "Some previous files could not be removed from the server",
              });
            });
          });
        }

        const uris = pickerResult.assets.map(asset => asset.uri);
        setPreviews(uris);
        setUploadedIds([]); 
        await uploadImages(uris);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Selection Error",
        text2: "Something went wrong while picking images",
      });
    }
  };

  const removeAll = async () => {
    // Delete files from server
    if (uploadedIds.length > 0) {
      try {
        const deletePromises = uploadedIds.map(id => axios.delete(`/file/${id}`));
        await Promise.all(deletePromises);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Server Error",
          text2: "Failed to remove some images from the server",
        });
      }
    }
    
    setPreviews([]);
    setUploadedIds([]);
    onUploadSuccess?.([]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.uploader, uploading && styles.disabled]}
        onPress={pickImages}
        disabled={uploading}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {uploading ? (
            <ActivityIndicator color={colors.PRIMARY} size="large" />
          ) : (
            <Ionicons name="cloud-upload-outline" size={36} color={colors.PRIMARY} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{uploading ? "Uploading Images..." : title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>

      {previews.length > 0 && (
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.selectionText}>{previews.length} Photos Selected</Text>
            {!uploading && (
              <TouchableOpacity onPress={removeAll} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {previews.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.previewImage} />
                {index < uploadedIds.length ? (
                  <View style={styles.successBadge}>
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                ) : uploading && index === uploadedIds.length ? (
                  <View style={styles.loadingBadge}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  uploader: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.PRIMARY + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.SECONDARY,
  },
  previewSection: {
    marginTop: 20,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    padding: 16,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.DARK,
  },
  clearText: {
    fontSize: 14,
    color: colors.DANGER_COLOR,
    fontWeight: "700",
  },
  scrollContent: {
    paddingRight: 10,
  },
  imageWrapper: {
    marginRight: 12,
    position: "relative",
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#CBD5E1",
  },
  successBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#10b981",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  loadingBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: colors.PRIMARY,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
});
