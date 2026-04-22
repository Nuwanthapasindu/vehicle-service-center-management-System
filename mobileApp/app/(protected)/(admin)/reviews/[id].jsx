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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import colors from "../../../../constants/colors";
import ReviewService from "../../../../services/review/review.service";
import { adminReplySchema } from "../../../../schema/review.schema";

export default function AdminReviewReply() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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
      const fetchedReview = data.payload.review;
      setReview(fetchedReview);
      
      // Update formik initial values if a reply exists
      if (fetchedReview.adminReply) {
        formik.setFieldValue("reply", fetchedReview.adminReply);
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

  const formik = useFormik({
    initialValues: {
      reply: "",
    },
    validationSchema: adminReplySchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (review?.adminReply) {
          // Update existing
          response = await ReviewService.updateAdminReply(id, values.reply);
        } else {
          // Create new
          response = await ReviewService.addAdminReply(id, values.reply);
        }

        Toast.show({
          type: "success",
          text1: "Success",
          text2: response?.payload?.message || "Reply processed successfully",
        });
        router.back();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.response?.data?.payload?.message || error.message || "Operation failed",
        });
      }
    },
  });

  const handleDeleteReply = () => {
    Alert.alert(
      "Delete Reply",
      "Are you sure you want to delete this admin reply?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const response = await ReviewService.deleteAdminReply(id);
              Toast.show({
                type: "success",
                text1: "Deleted",
                text2: response?.payload?.message || "Reply deleted successfully",
              });
              router.back();
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: error?.response?.data?.payload?.message || error.message || "Failed to delete reply",
              });
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
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
            <Ionicons name="close" size={24} color={colors.DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {review?.adminReply ? "Edit Reply" : "Admin Reply"}
          </Text>
          <View style={styles.headerRight}>
            {review?.adminReply && (
              <TouchableOpacity 
                onPress={handleDeleteReply} 
                disabled={deleting}
                style={styles.deleteHeaderBtn}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Feather name="trash-2" size={20} color="#ef4444" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: review?.isApproved ? "#F4FADE" : "#FEE2E2" }]}>
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
                <Text style={styles.dateText}>{dateStr} • {review?.isApproved ? "Published" : "Pending"}</Text>
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

            <Text style={styles.reviewText}>{review?.comment || "No comment"}</Text>
            
            {review?.booking?.vehicle && (
              <View style={styles.vehicleChip}>
                <Ionicons name="car-outline" size={14} color={colors.SECONDARY} />
                <Text style={styles.vehicleText}>
                  {review.booking.vehicle.make} {review.booking.vehicle.model}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.formSection}>
            <View style={styles.replyHeaderRow}>
              <View style={styles.replyHeadline}>
                <Feather name="corner-up-left" size={18} color={colors.DARK} />
                <Text style={styles.replyHeadText}>
                  {review?.adminReply ? "Respond to Review" : "Write a public response"}
                </Text>
              </View>
              <View style={styles.publicBadge}>
                <Text style={styles.publicText}>Public</Text>
              </View>
            </View>

            <View style={[
              styles.inputContainer,
              formik.touched.reply && formik.errors.reply && styles.inputError
            ]}>
              <TextInput
                style={styles.textArea}
                placeholder="Type your response here..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={formik.values.reply}
                onChangeText={formik.handleChange("reply")}
                onBlur={formik.handleBlur("reply")}
              />
              <View style={styles.inputFooter}>
                <Text style={[
                  styles.charCount,
                  formik.values.reply.length > maxChars && { color: "#ef4444" }
                ]}>
                  {formik.values.reply.length} / {maxChars}
                </Text>
              </View>
            </View>
            {formik.touched.reply && formik.errors.reply && (
              <Text style={styles.errorText}>{formik.errors.reply}</Text>
            )}

            <View style={styles.proTipContainer}>
              <Ionicons
                name="bulb-outline"
                size={24}
                color={colors.PRIMARY}
                style={styles.bulbIcon}
              />
              <Text style={styles.proTipText}>
                <Text style={styles.proTipBold}>Tip: </Text>
                Timely responses are public and help build trust with future customers.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.submitBtn, 
              (formik.isSubmitting || !formik.isValid) && { opacity: 0.6 }
            ]} 
            onPress={formik.handleSubmit}
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? (
              <ActivityIndicator size="small" color={colors.DARK} />
            ) : (
              <>
                <Text style={styles.submitBtnText}>
                  {review?.adminReply ? "Update Reply" : "Post Reply"}
                </Text>
                <Feather
                  name="check"
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.DARK,
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  deleteHeaderBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    marginBottom: 12,
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
    lineHeight: 22,
    marginBottom: 16,
  },
  vehicleChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  vehicleText: {
    fontSize: 12,
    color: colors.SECONDARY,
    marginLeft: 6,
    fontWeight: "600",
  },
  formSection: {
    flex: 1,
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
    marginLeft: 10,
  },
  publicBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },
  publicText: {
    fontSize: 11,
    color: colors.SECONDARY,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  inputContainer: {
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    minHeight: 120,
    padding: 16,
    fontSize: 15,
    color: colors.DARK,
    lineHeight: 22,
  },
  inputFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "flex-end",
  },
  charCount: {
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 4,
  },
  proTipContainer: {
    flexDirection: "row",
    backgroundColor: "#F4FADE",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
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
    padding: 20,
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  submitBtn: {
    backgroundColor: colors.PRIMARY,
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
  },
});
