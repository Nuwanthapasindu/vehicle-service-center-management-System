import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import colors from "../../../../constants/colors";
import ReviewService from "../../../../services/review/review.service";

export default function AdminReviewReply() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [replyText, setReplyText] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const maxChars = 500;

  useEffect(() => {
    if (id) {
      fetchReviewDetails();
    }
  }, [id]);

  const fetchReviewDetails = async () => {
    try {
      setLoading(true);
      const data = await ReviewService.getAdminReviewById(id);
      setReview(data.payload.review);
      if (data.payload.review.adminReply) {
        setReplyText(data.payload.review.adminReply);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch review details",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      Toast.show({
        type: "error",
        text1: "Required",
        text2: "Please enter a reply message",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await ReviewService.addAdminReply(id, replyText);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.payload.message || "Reply submitted successfully",
      });
      router.back();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: error?.response?.data?.payload?.message || error.message || "Failed to submit reply",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const customerName = review?.customer?.name || "Unknown Customer";
  const initials = customerName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const dateStr = review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : "";
  const rating = review?.rating || 0;

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color={colors.PRIMARY} />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Details</Text>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
                {review?.isApproved && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={10} color={colors.DARK} />
                  </View>
                )}
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{customerName}</Text>
                <Text style={styles.dateText}>{dateStr}</Text>
              </View>
            </View>

            <View style={styles.ratingRow}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(rating) ? "star" : "star-outline"}
                  size={20}
                  color={colors.PRIMARY}
                  style={{ marginRight: 2 }}
                />
              ))}
              <Text style={styles.ratingScore}>{rating.toFixed(1)}</Text>
            </View>

            <Text style={styles.reviewText}>
              {review?.comment || "No comment provided."}
              {review?.booking?.vehicle && (
                <Text style={styles.vehicleInfo}>
                  {"\n\n"}Vehicle: {review.booking.vehicle.make} {review.booking.vehicle.model}
                </Text>
              )}
            </Text>
          </View>

          <View style={styles.replyHeaderRow}>
            <View style={styles.replyHeadline}>
              <Ionicons
                name="arrow-undo-outline"
                size={18}
                color={colors.DARK}
                style={{ transform: [{ scaleX: -1 }] }}
              />
              <Text style={styles.replyHeadText}>
                {review?.adminReply ? "Edit your reply" : "Write a public reply"}
              </Text>
            </View>
            <View style={styles.publicBadge}>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Hi thank you for the feedback! We appreciate your business..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={replyText}
              onChangeText={(text) => {
                if (text.length <= maxChars) setReplyText(text);
              }}
            />
            <Text style={styles.charCount}>
              {replyText.length} / {maxChars}
            </Text>
          </View>

          <View style={styles.proTipContainer}>
            <Ionicons
              name="bulb-outline"
              size={24}
              color={colors.PRIMARY}
              style={styles.bulbIcon}
            />
            <Text style={styles.proTipText}>
              <Text style={styles.proTipBold}>Pro Tip: </Text>
              Professional and timely responses increase customer trust by 40%.
              Mention specific details from the review to show you care.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.submitBtn, submitting && { opacity: 0.7 }]} 
            onPress={handleReplySubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={colors.DARK} />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Submit Reply</Text>
                <Feather
                  name="send"
                  size={18}
                  color={colors.DARK}
                  style={{ marginLeft: 8 }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.LIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 80,
  },
  cancelText: {
    color: colors.PRIMARY,
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.DARK,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 14,
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FCA5A5", // Peachy background observed in the image
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    color: colors.DARK,
    fontSize: 16,
    fontWeight: "800",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -4,
    backgroundColor: colors.PRIMARY,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.LIGHT,
  },
  authorInfo: {
    justifyContent: "center",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
  },
  dateText: {
    fontSize: 13,
    color: colors.SECONDARY,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingScore: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
  reviewText: {
    fontSize: 15,
    color: colors.SECONDARY,
    lineHeight: 24,
  },
  vehicleInfo: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.DARK,
  },
  replyHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  replyHeadline: {
    flexDirection: "row",
    alignItems: "center",
  },
  replyHeadText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
    marginLeft: 8,
  },
  publicBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  publicText: {
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  textArea: {
    height: 140,
    padding: 16,
    fontSize: 15,
    color: colors.DARK,
    lineHeight: 22,
  },
  charCount: {
    textAlign: "right",
    padding: 12,
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  proTipContainer: {
    flexDirection: "row",
    backgroundColor: "#F4FADE", // Light primary-tinted background
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1eec7", // Slightly darker green border
  },
  bulbIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  proTipText: {
    flex: 1,
    fontSize: 13,
    color: colors.SECONDARY,
    lineHeight: 20,
  },
  proTipBold: {
    color: colors.DARK,
    fontWeight: "800",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  submitBtn: {
    backgroundColor: colors.PRIMARY,
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
  },
});
