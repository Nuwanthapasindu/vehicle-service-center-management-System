import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import getImageFullUrl from "../utils/getImageFullUrl";

const GalleryItem = ({ 
  item, 
  onDelete, 
  isAdmin = false,
  isSelected = false,
  onSelect,
  isSelectionMode = false
}) => {
  const imageUrl = item.image?.filePath ? getImageFullUrl(item.image.filePath) : null;

  const handlePress = () => {
    if (isSelectionMode && onSelect) {
      onSelect(item._id);
    }
  };

  const handleLongPress = () => {
    if (!isSelectionMode && onSelect) {
      onSelect(item._id);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={isSelectionMode ? 0.7 : 1}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={[styles.image, isSelected && styles.selectedImage]} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Ionicons name="image-outline" size={30} color={colors.SECONDARY} />
        </View>
      )}
      
      {/* Selection Indicator */}
      {isSelectionMode && (
        <View style={[styles.selectionIndicator, isSelected && styles.selectionIndicatorActive]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      )}

      {/* Individual Delete (only if not in selection mode) */}
      {isAdmin && onDelete && !isSelectionMode && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item._id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={16} color={colors.LIGHT} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    backgroundColor: colors.LIGHT,
    overflow: "hidden",
    aspectRatio: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: "relative",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: colors.PRIMARY,
    elevation: 6,
    transform: [{ scale: 0.95 }],
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  selectedImage: {
    opacity: 0.8,
  },
  noImage: {
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionIndicator: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionIndicatorActive: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});

export default GalleryItem;
