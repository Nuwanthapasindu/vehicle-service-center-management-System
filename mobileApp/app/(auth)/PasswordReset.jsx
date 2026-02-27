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
import { useRouter } from "expo-router";

import colors from "../../constants/colors";
import CustomInput from "../../components/CustomInput";
import { passwordResetValidationSchema } from "../../schema/authSchemas";

export default function PasswordReset() {
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
            <Formik
              initialValues={{ newPassword: "", confirmPassword: "" }}
              validationSchema={passwordResetValidationSchema}
              onSubmit={(values) => console.log(values)}
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
                  {/* Password Input */}
                  <CustomInput
                    label=" New Password"
                    icon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.SECONDARY}
                      />
                    }
                    placeholder="Enter your password"
                    value={values.newPassword}
                    onChangeText={handleChange("newPassword")}
                    onBlur={handleBlur("newPassword")}
                    error={errors.newPassword}
                    touched={touched.newPassword}
                    isPassword={true}
                  />
                  {/* Password Input */}
                  <CustomInput
                    label="Confirm Password"
                    icon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.SECONDARY}
                      />
                    }
                    placeholder="Enter your password"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    isPassword={true}
                  />

                  {/* Send OTP Button */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>RESET PASSWORD</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: "center",
    marginTop: 40,
  },
  inputsSection: {
    width: "100%",
  },
  submitButton: {
    backgroundColor: colors.PRIMARY,
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
});
