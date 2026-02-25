import React from "react";
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
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";

import colors from "../../constants/colors";
import CustomInput from "../../components/CustomInput";

const validationSchema = Yup.object().shape({
  mobileNumber: Yup.string()
    .strict(true)
    .trim("Mobile number cannot contain leading or trailing spaces")
    .matches(
      /^(?:\+94|94|0)?7[0-8]\d{7}$/,
      "Please provide a valid mobile number",
    )
    .required("Mobile number is required"),
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
              onSubmit={(values) => router.replace("/OtpVerification")}
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
                  <CustomInput
                    label="Mobile Number"
                    icon={
                      <Ionicons
                        name="phone-portrait-outline"
                        size={20}
                        color={colors.SECONDARY}
                      />
                    }
                    placeholder="e.g., +1 234 567 890"
                    keyboardType="num-pad"
                    autoCapitalize="none"
                    value={values.mobileNumber}
                    onChangeText={handleChange("mobileNumber")}
                    onBlur={handleBlur("mobileNumber")}
                    error={errors.mobileNumber}
                    touched={touched.mobileNumber}
                  />

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
