import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import enums from "../constants/enums";

export default function ReviewItem({ item, onTogglePublish, onReply, hideActions }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.initials}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.serviceText}>
              {item.vehicle} • {item.time}
            </Text>
          </View>
          <View style={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < Math.floor(item.rating) ? "star" : "star-outline"}
                size={14}
                color="#F59E0B"
                style={{ marginLeft: 2 }}
              />
            ))}
          </View>
        </View>

        <View style={styles.bodyRow}>
          <Text style={styles.reviewText}>{item.text}</Text>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.reviewImage} />
          )}
        </View>
        
        {item.adminReply && (
          <View style={styles.replyContainer}>
             <Text style={styles.replyLabel}>Admin Reply:</Text>
             <Text style={styles.replyText}>{item.adminReply}</Text>
          </View>
        )}
      </View>

      {!hideActions && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.replyBtn} onPress={onReply}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.DARK} />
            <Text style={styles.replyBtnText}>Reply</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toggleBtn, item.isApproved ? styles.unpublishBtn : styles.publishBtn]} 
            onPress={onTogglePublish}
          >
            <Ionicons name={item.isApproved ? "eye-off-outline" : "earth-outline"} size={16} color={colors.DARK} />
            <Text style={styles.toggleBtnText}>
              {item.isApproved ? enums.REVIEW_ACTION_LABELS.UNPUBLISH : enums.REVIEW_ACTION_LABELS.PUBLISH}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  cardContent: {
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F4FADE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.PRIMARY,
    fontWeight: "bold",
    fontSize: 14,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  authorName: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.DARK,
  },
  serviceText: {
    fontSize: 12,
    color: colors.SECONDARY,
    marginTop: 2,
  },
  rating: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 4,
  },
  bodyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewText: {
    flex: 1,
    fontSize: 14,
    color: colors.SECONDARY,
    lineHeight: 20,
    paddingRight: 12,
  },
  reviewImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: colors.BORDER_COLOR,
  },
  replyContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: colors.BACKGROUND_COLOR,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.PRIMARY,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 2,
  },
  replyText: {
    fontSize: 13,
    color: colors.SECONDARY,
  },
  actionRow: {
    flexDirection: "row",
    height: 46,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  replyBtn: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  replyBtnText: {
    color: colors.DARK,
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 14,
  },
  toggleBtn: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.BORDER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  publishBtn: {
    backgroundColor: colors.PRIMARY,
  },
  unpublishBtn: {
    backgroundColor: "#FFCDD2", // light red to denote unpublishing action
  },
  toggleBtnText: {
    color: colors.DARK,
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 14,
  },
});
