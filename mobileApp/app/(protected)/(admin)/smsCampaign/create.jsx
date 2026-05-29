import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Send, Type, MessageSquare, AlertCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useFormik } from "formik";

import colors from "../../../../constants/colors";
import { smsService } from "../../../../services/sms/sms.service";
import smsCampaignSchema from "../../../../schema/smsCampaignSchema";

export default function SmsCampaignCreate() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: "",
      message: "",
      campaignType: "PROMOTIONAL",
    },
    validationSchema: smsCampaignSchema,
    onSubmit: async (values) => {
      try {
        await smsService.createSmsCampaign({
          title: values.title.trim(),
          message: values.message.trim(),
          campaignType: values.campaignType,
        });

        Toast.show({
          type: "success",
          text1: "Campaign Sent",
          text2: "SMS campaign has been successfully dispatched to all active customers.",
        });

        router.back();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Sending Failed",
          text2: error.response?.data?.payload?.message || "Failed to dispatch campaign",
        });
      }
    },
  });

  const getCharCountDetails = () => {
    const len = formik.values.message.length;
    // Standard SMS limit is 160 characters (GSM 7-bit)
    const smsCount = len === 0 ? 0 : Math.ceil(len / 160);
    return `${len} characters (${smsCount} SMS part${smsCount !== 1 ? "s" : ""})`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          {/* Campaign Title */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Type size={16} color={colors.DARK} style={{ marginRight: 6 }} />
              <Text style={styles.label}>Campaign Title</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                formik.errors.title && formik.touched.title ? styles.inputErrorBorder : null,
              ]}
              placeholder="e.g. Service Center Closed Today"
              placeholderTextColor="#A0AEC0"
              value={formik.values.title}
              onChangeText={formik.handleChange("title")}
              onBlur={formik.handleBlur("title")}
              disabled={formik.isSubmitting}
            />
            {formik.errors.title && formik.touched.title ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={12} color={colors.DANGER_COLOR} style={{ marginRight: 4 }} />
                <Text style={styles.errorText}>{formik.errors.title}</Text>
              </View>
            ) : null}
          </View>

          {/* Campaign Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Campaign Type</Text>
            <View style={styles.segmentedContainer}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  formik.values.campaignType === "PROMOTIONAL" ? styles.promoActiveButton : null,
                ]}
                activeOpacity={0.8}
                onPress={() => formik.setFieldValue("campaignType", "PROMOTIONAL")}
                disabled={formik.isSubmitting}
              >
                <Text
                  style={[
                    styles.segmentText,
                    formik.values.campaignType === "PROMOTIONAL" ? styles.promoActiveText : null,
                  ]}
                >
                  PROMOTIONAL
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  formik.values.campaignType === "TRANSACTIONAL" ? styles.transActiveButton : null,
                ]}
                activeOpacity={0.8}
                onPress={() => formik.setFieldValue("campaignType", "TRANSACTIONAL")}
                disabled={formik.isSubmitting}
              >
                <Text
                  style={[
                    styles.segmentText,
                    formik.values.campaignType === "TRANSACTIONAL" ? styles.transActiveText : null,
                  ]}
                >
                  TRANSACTIONAL
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              {formik.values.campaignType === "PROMOTIONAL"
                ? "Promotional SMS campaigns are sent using promotional gateway and are ideal for discounts and offers."
                : "Transactional campaigns bypass DND registries and are ideal for emergency alerts (e.g. shop closure)."}
            </Text>
          </View>

          {/* Message Content */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <MessageSquare size={16} color={colors.DARK} style={{ marginRight: 6 }} />
              <Text style={styles.label}>SMS Message Content</Text>
            </View>
            <TextInput
              style={[
                styles.textArea,
                formik.errors.message && formik.touched.message ? styles.inputErrorBorder : null,
              ]}
              placeholder="Write your campaign message details..."
              placeholderTextColor="#A0AEC0"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={formik.values.message}
              onChangeText={formik.handleChange("message")}
              onBlur={formik.handleBlur("message")}
              disabled={formik.isSubmitting}
            />
            <View style={styles.charCountRow}>
              <Text style={styles.charCountText}>{getCharCountDetails()}</Text>
            </View>
            {formik.errors.message && formik.touched.message ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={12} color={colors.DANGER_COLOR} style={{ marginRight: 4 }} />
                <Text style={styles.errorText}>{formik.errors.message}</Text>
              </View>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, formik.isSubmitting ? styles.submitButtonDisabled : null]}
            activeOpacity={0.8}
            onPress={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <ActivityIndicator color={colors.DARK} />
            ) : (
              <>
                <Send size={18} color={colors.DARK} style={{ marginRight: 8 }} />
                <Text style={styles.submitButtonText}>DISPATCH CAMPAIGN</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  contentContainer: {
    padding: 16,
  },
  formCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
    elevation: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.DARK,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.DARK,
  },
  inputErrorBorder: {
    borderColor: colors.DANGER_COLOR,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: colors.DANGER_COLOR,
    fontWeight: "500",
  },
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginTop: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  promoActiveButton: {
    backgroundColor: colors.LIGHT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(142, 219, 0, 0.2)",
  },
  transActiveButton: {
    backgroundColor: colors.LIGHT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.2)",
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.SECONDARY,
  },
  promoActiveText: {
    color: "#65A30D",
  },
  transActiveText: {
    color: "#EA580C",
  },
  helperText: {
    fontSize: 11,
    color: colors.SECONDARY,
    marginTop: 8,
    lineHeight: 16,
  },
  textArea: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.DARK,
    minHeight: 120,
  },
  charCountRow: {
    alignItems: "flex-end",
    marginTop: 6,
  },
  charCountText: {
    fontSize: 11,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: "#E2E8F0",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.DARK,
    letterSpacing: 0.5,
  },
});
