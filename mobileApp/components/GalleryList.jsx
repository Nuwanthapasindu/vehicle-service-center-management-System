import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import GalleryItem from "./GalleryItem";

const { width } = Dimensions.get("window");

const GalleryList = ({
  images,
  loading,
  refreshing,
  onRefresh,
  onDelete,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  isAdmin = false,
  emptyMessage = "No images in gallery",
  selectedIds = [],
  onSelect,
}) => {
  const isSelectionMode = selectedIds.length > 0;

  if (loading && !refreshing && images.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading Gallery...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={images}
      keyExtractor={(item, index) => item._id || index.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <GalleryItem 
          item={item} 
          onDelete={onDelete} 
          isAdmin={isAdmin}
          isSelected={selectedIds.includes(item._id)}
          onSelect={onSelect}
          isSelectionMode={isSelectionMode}
        />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.PRIMARY} />
          </View>
        ) : null
      }
      ListEmptyComponent={
        !loading ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="images-outline" size={50} color={colors.SECONDARY} />
            </View>
            <Text style={styles.emptyTitle}>Your Gallery is Empty</Text>
            <Text style={styles.emptySubtitle}>{emptyMessage}</Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "500",
  },
  listContainer: {
    padding: 10,
    paddingBottom: 150, // More space for multi-delete bar
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.SECONDARY,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default GalleryList;
