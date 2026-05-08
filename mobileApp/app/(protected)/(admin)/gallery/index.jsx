import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
import MultiImagePicker from "../../../../components/MultiImagePicker";
import GalleryList from "../../../../components/GalleryList";
import { galleryService } from "../../../../services/gallery/gallery.service";
import colors from "../../../../constants/colors";

export default function AdminGalleryScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [uploadedImageIds, setUploadedImageIds] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getGalleryImages();
      setImages(response.data?.payload || []);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load gallery images",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchImages();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchImages();
  };

  const handleUpload = async () => {
    if (!uploadedImageIds || uploadedImageIds.length === 0) {
      return Toast.show({
        type: "error",
        text1: "No Images Selected",
        text2: "Please upload at least one image to the server first",
      });
    }

    try {
      setUploading(true);
      const payload = {
        images: uploadedImageIds,
      };

      const response = await galleryService.createGalleryImage(payload);
      
      Toast.show({
        type: "success",
        text1: "Gallery Updated",
        text2: response.data?.payload?.message || "Successfully saved new images",
      });
      
      setModalVisible(false);
      resetModal(false); // Skip cleanup on success
      fetchImages();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.response?.data?.payload?.message || "Failed to save gallery items",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetModal = (shouldCleanup = true) => {
    // Cleanup any uploaded but unsaved files if requested
    if (shouldCleanup && uploadedImageIds.length > 0) {
      uploadedImageIds.forEach(id => {
        axios.delete(`/file/${id}`).catch(err => {
          Toast.show({
            type: "error",
            text1: "Discard Cleanup Error",
            text2: "Some unsaved files could not be removed from the server",
          });
        });
      });
    }
    setUploadedImageIds([]);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Remove from Gallery?",
      "This image will be permanently deleted from the system.",
      [
        { text: "Keep Image", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await galleryService.deleteGalleryImage(id);
              Toast.show({
                type: "success",
                text1: "Removed",
                text2: "Image deleted from gallery",
              });
              fetchImages();
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Delete Failed",
                text2: "Could not remove image at this time",
              });
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gallery Management</Text>
          <Text style={styles.headerSubtitle}>{images.length} assets in collection</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshBtn} 
          onPress={onRefresh}
          disabled={loading}
        >
          <Ionicons name="refresh" size={20} color={colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <GalleryList
        images={images}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onDelete={handleDelete}
        isAdmin={true}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={colors.LIGHT} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Gallery</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetModal(true); }}>
                <Ionicons name="close" size={24} color={colors.DARK} />
              </TouchableOpacity>
            </View>

            <MultiImagePicker
              onUploadSuccess={(ids) => setUploadedImageIds(ids)}
              title="Pick Photos"
              subtitle="Multiple selection supported"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => {
                  setModalVisible(false);
                  resetModal(true);
                }}
              >
                <Text style={styles.cancelBtnText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn, (uploading || uploadedImageIds.length === 0) && styles.disabledBtn]}
                onPress={handleUpload}
                disabled={uploading || uploadedImageIds.length === 0}
              >
                {uploading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    Save {uploadedImageIds.length > 0 ? `(${uploadedImageIds.length})` : ""}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.DARK,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.SECONDARY,
    marginTop: 2,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.PRIMARY + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)", // colors.DARK with opacity
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.LIGHT,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.DARK,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 10,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F1F5F9",
  },
  cancelBtnText: {
    color: "#64748B",
    fontWeight: "700",
  },
  saveBtn: {
    backgroundColor: colors.PRIMARY,
    elevation: 2,
  },
  saveBtnText: {
    color: colors.LIGHT,
    fontWeight: "700",
  },
  disabledBtn: {
    opacity: 0.5,
    elevation: 0,
  },
});
