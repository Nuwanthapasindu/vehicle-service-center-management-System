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
  isAdmin = false,
  emptyMessage = "No images in gallery",
}) => {
  if (loading && !refreshing) {
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
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => (
        <GalleryItem item={item} onDelete={onDelete} isAdmin={isAdmin} />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="images-outline" size={50} color={colors.SECONDARY} />
          </View>
          <Text style={styles.emptyTitle}>Your Gallery is Empty</Text>
          <Text style={styles.emptySubtitle}>{emptyMessage}</Text>
        </View>
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
    paddingBottom: 100, // Extra space for FAB
  },
  columnWrapper: {
    justifyContent: "space-between",
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
