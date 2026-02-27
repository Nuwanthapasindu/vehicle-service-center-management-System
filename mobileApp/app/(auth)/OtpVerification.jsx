import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { OtpInput } from "react-native-otp-entry";
import { useRouter, useLocalSearchParams } from "expo-router";

import colors from "../../constants/colors";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function OtpVerification() {
  const router = useRouter();
  const { mobileNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Timer logic for resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter a valid 6-digit OTP",
      });
      return;
    }

    router.push({
      pathname: "/(auth)/PasswordReset",
      params: { otp },
    });
  };

  const handleResend = async () => {
    try {
      const endpoint = "/auth/verification/resend";
      const payload = { mobile: mobileNumber };
      const response = await axios.post(endpoint, payload);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response?.data?.payload?.message || "OTP resent successfully",
      });
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: error.response?.data?.payload?.message || "Failed to resend OTP",
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.contentContainer}
        >
          {/* Header Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color={colors.DARK} />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your{"\n"}
              mobile number{" "}
              <Text style={styles.subtitleBold}>{mobileNumber}</Text>
            </Text>
          </View>

          <View style={styles.otpContainerWrapper}>
            <OtpInput
              numberOfDigits={6}
              focusColor={colors.PRIMARY}
              onTextChange={(text) => setOtp(text)}
              onFilled={(text) => setOtp(text)}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.pinCodeContainer,
                pinCodeTextStyle: styles.pinCodeText,
                focusPinCodeContainerStyle: styles.activePinCodeContainer,
                focusedPinCodeContainerStyle: styles.activePinCodeContainer,
              }}
            />
          </View>

          <View style={styles.resendContainer}>
            <View style={styles.timerRow}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.SECONDARY}
                style={styles.clockIcon}
              />
              <Text style={styles.timerText}>
                Resend code in{" "}
                <Text style={styles.timerBold}>
                  0:{timer < 10 ? `0${timer}` : timer}
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              disabled={isResendDisabled}
              onPress={handleResend}
              style={styles.resendButton}
            >
              <Text
                style={[
                  styles.resendButtonText,
                  isResendDisabled && styles.resendTextDisabled,
                ]}
              >
                RESEND OTP
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          {/* Bottom Verify Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={handleVerify}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "VERIFYING..." : "VERIFY & CONTINUE"}
            </Text>
            {!isSubmitting && (
              <Ionicons name="chevron-forward" size={24} color={colors.DARK} />
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 32,
  },
  headerTextContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.SECONDARY,
    lineHeight: 24,
  },
  subtitleBold: {
    fontWeight: "700",
    color: colors.DARK,
  },
  otpContainerWrapper: {
    marginBottom: 40,
  },
  otpContainer: {
    width: "100%",
    justifyContent: "space-between",
  },
  pinCodeContainer: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    backgroundColor: colors.LIGHT,
  },
  activePinCodeContainer: {
    borderColor: colors.PRIMARY,
    borderWidth: 2,
  },
  pinCodeText: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.DARK,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  clockIcon: {
    marginRight: 6,
  },
  timerText: {
    fontSize: 14,
    color: colors.SECONDARY,
  },
  timerBold: {
    fontWeight: "700",
    color: colors.DARK,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.PRIMARY,
    letterSpacing: 1,
  },
  resendTextDisabled: {
    color: "#CBD5E1",
  },
  spacer: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 10,
    gap: 8,
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
    letterSpacing: 0.5,
  },
});
