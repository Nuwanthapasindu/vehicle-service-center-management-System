import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import getImageFullUrl from "../utils/getImageFullUrl";

const GalleryItem = ({ item, onDelete, isAdmin = false }) => {
  const imageUrl = item.image?.filePath ? getImageFullUrl(item.image.filePath) : null;

  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Ionicons name="image-outline" size={30} color={colors.SECONDARY} />
        </View>
      )}
      
      {isAdmin && onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item._id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={16} color={colors.LIGHT} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    backgroundColor: colors.LIGHT,
    overflow: "hidden",
    aspectRatio: 1, // Keep it square
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noImage: {
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(239, 68, 68, 0.9)", // colors.DANGER with some opacity
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default GalleryItem;
