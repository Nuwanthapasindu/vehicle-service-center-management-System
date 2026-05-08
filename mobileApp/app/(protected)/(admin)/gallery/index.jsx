import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
import MultiImagePicker from "../../../../components/MultiImagePicker";
import GalleryList from "../../../../components/GalleryList";
import { galleryService } from "../../../../services/gallery/gallery.service";
import colors from "../../../../constants/colors";

const PAGE_LIMIT = 10;

export default function AdminGalleryScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalAssets, setTotalAssets] = useState(0);

  // Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  const selectionAnim = React.useRef(new Animated.Value(0)).current;

  const [isModalVisible, setModalVisible] = useState(false);
  const [uploadedImageIds, setUploadedImageIds] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async (pageNum = 1, isRefresh = false) => {
    try {
      if (pageNum === 1) {
        if (!isRefresh) setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await galleryService.getGalleryImages({ page: pageNum, limit: PAGE_LIMIT });
      const { images: newImages, total, page: currentPage, totalPages } = response.data?.payload || {};

      if (pageNum === 1) {
        setImages(newImages || []);
      } else {
        setImages((prev) => [...prev, ...(newImages || [])]);
      }

      setPage(currentPage);
      setHasMore(currentPage < totalPages);
      setTotalAssets(total || 0);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load gallery images",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchImages(1);
    }, [])
  );

  useEffect(() => {
    Animated.spring(selectionAnim, {
      toValue: selectedIds.length > 0 ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [selectedIds]);

  const handleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const clearSelection = () => setSelectedIds([]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchImages(1, true);
  };

  const onLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchImages(page + 1);
    }
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
      const response = await galleryService.createGalleryImage({ images: uploadedImageIds });
      
      Toast.show({
        type: "success",
        text1: "Gallery Updated",
        text2: response.data?.payload?.message || "Successfully saved new images",
      });
      
      setModalVisible(false);
      resetModal(false); 
      fetchImages(1);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Failed to save gallery items",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetModal = (shouldCleanup = true) => {
    if (shouldCleanup && uploadedImageIds.length > 0) {
      uploadedImageIds.forEach(id => {
        axios.delete(`/file/${id}`).catch(() => {});
      });
    }
    setUploadedImageIds([]);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Remove Image?",
      "This image will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await galleryService.deleteGalleryImage(id);
              fetchImages(1);
            } catch (error) {
              Toast.show({ type: "error", text1: "Delete Failed" });
            }
          },
        },
      ]
    );
  };

  const handleBulkDelete = () => {
    Alert.alert(
      "Bulk Delete",
      `Are you sure you want to delete ${selectedIds.length} selected images?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await galleryService.deleteMultipleGalleryImages(selectedIds);
              Toast.show({
                type: "success",
                text1: "Batch Deleted",
                text2: `Successfully removed ${selectedIds.length} images`,
              });
              setSelectedIds([]);
              fetchImages(1);
            } catch (error) {
              Toast.show({ type: "error", text1: "Bulk Delete Failed" });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {selectedIds.length > 0 ? (
          <View style={styles.selectionHeader}>
            <TouchableOpacity onPress={clearSelection}>
              <Ionicons name="close" size={24} color={colors.DARK} />
            </TouchableOpacity>
            <Text style={styles.selectionText}>{selectedIds.length} selected</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.headerTitle}>Gallery Management</Text>
            <Text style={styles.headerSubtitle}>{totalAssets} assets in collection</Text>
          </View>
        )}
        
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
        onLoadMore={onLoadMore}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onDelete={handleDelete}
        isAdmin={true}
        selectedIds={selectedIds}
        onSelect={handleSelect}
      />

      {/* Floating Action Bar for Selection */}
      {selectedIds.length > 0 && (
        <Animated.View 
          style={[
            styles.selectionBar,
            { transform: [{ translateY: selectionAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }] }
          ]}
        >
          <TouchableOpacity style={styles.bulkDeleteBtn} onPress={handleBulkDelete}>
            <Ionicons name="trash" size={24} color="white" />
            <Text style={styles.bulkDeleteText}>Delete Selected ({selectedIds.length})</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {selectedIds.length === 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color={colors.LIGHT} />
        </TouchableOpacity>
      )}

      {/* Modal is same as before */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { setModalVisible(false); resetModal(true); }}
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
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => { setModalVisible(false); resetModal(true); }}>
                <Text style={styles.cancelBtnText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn, (uploading || uploadedImageIds.length === 0) && styles.disabledBtn]}
                onPress={handleUpload}
                disabled={uploading || uploadedImageIds.length === 0}
              >
                {uploading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveBtnText}>Save</Text>}
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
    paddingVertical: 18,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    height: 90,
  },
  selectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  selectionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.DARK,
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
  },
  selectionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  bulkDeleteBtn: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  bulkDeleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.LIGHT,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
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
    minWidth: 100,
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
  },
  saveBtnText: {
    color: colors.LIGHT,
    fontWeight: "700",
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
