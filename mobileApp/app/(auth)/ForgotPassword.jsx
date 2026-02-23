import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";

import colors from "../../constants/colors";

const validationSchema = Yup.object().shape({
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .min(10, "Mobile number is too short"),
});

export default function ForgotPassword() {
  const router = useRouter();

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
            <Ionicons name="chevron-back" size={28} color={colors.DARK} />
          </TouchableOpacity>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* Top Icon Banner */}
            <View style={styles.iconSquare}>
              <Ionicons name="sync" size={30} color={colors.PRIMARY} />
              <View style={styles.miniLock}>
                {/* <Ionicons name="lock-closed" size={12} color={colors.DARK} /> */}
              </View>
            </View>

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your registered mobile number to receive a one-time password
              (OTP).
            </Text>

            <Formik
              initialValues={{ mobileNumber: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => console.log("OTP Request:", values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.inputsSection}>
                  {/* Mobile Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        touched.mobileNumber &&
                          errors.mobileNumber &&
                          styles.inputError,
                      ]}
                    >
                      <Ionicons
                        name="phone-portrait-outline"
                        size={20}
                        color={colors.SECONDARY}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="e.g., +1 234 567 890"
                        placeholderTextColor="#94A3B8"
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        onChangeText={handleChange("mobileNumber")}
                        onBlur={handleBlur("mobileNumber")}
                        value={values.mobileNumber}
                      />
                    </View>
                    {touched.mobileNumber && errors.mobileNumber && (
                      <Text style={styles.errorText}>
                        {errors.mobileNumber}
                      </Text>
                    )}
                  </View>

                  {/* Send OTP Button */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>SEND OTP</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={colors.LIGHT}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>

        {/* Footer Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // using the constant background equivalent
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    padding: 4,
    marginLeft: -4,
  },
  formContainer: {
    flex: 1,
    marginTop: 40,
  },
  iconSquare: {
    width: 56,
    height: 56,
    backgroundColor: "#E7F7C7", // Light green mix
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  miniLock: {
    position: "absolute",
    bottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.DARK,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.SECONDARY,
    lineHeight: 24,
    marginBottom: 32,
    paddingRight: 20,
  },
  inputsSection: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    height: 52,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: colors.DANGER_COLOR,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.DARK,
  },
  errorText: {
    color: colors.DANGER_COLOR,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: colors.DARK,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.LIGHT,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
    marginTop: "auto",
  },
  footerText: {
    color: colors.SECONDARY,
    fontSize: 15,
  },
  loginText: {
    color: colors.DARK,
    fontSize: 15,
    fontWeight: "bold",
  },
});
