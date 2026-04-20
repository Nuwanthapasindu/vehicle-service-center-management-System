import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { useRouter } from "expo-router";

import colors from "../../constants/colors";
import logo from "../../assets/logo.png";
import CustomInput from "../../components/CustomInput";
import { loginValidationSchema } from "../../schema/authSchemas";
import axios from "axios";
import Toast from "react-native-toast-message";
import storageKeys from "../../constants/storageKeys";
import useSecureStorage from "../../hooks/useSecureStorage";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../store/slices/authSlice";
const { width } = Dimensions.get("window");
const initialValues = {
  userName: "",
  password: "",
};
export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { saveItem } = useSecureStorage();

  const handleLogin = async (values) => {
    try {
      
      const response = await axios.post("/auth/login", values);
      const { payload } = response.data;
      await saveItem(storageKeys.PERSONAL_ACCESS_TOKEN, payload.accessToken);
      await saveItem(storageKeys.REFRESH_TOKEN, payload.refreshToken);
      dispatch(fetchUser(payload.accessToken));
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: error.response?.data?.payload?.message,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Background Faint Gear Icon */}
        <View style={styles.backgroundIconContainer} pointerEvents="none">
          <Ionicons
            name="settings"
            size={width * 1.3}
            color="#E2E8F0"
            style={styles.backgroundIcon}
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Header & Logo */}
            <View style={styles.headerContainer}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>AutoMate</Text>
              <Text style={styles.subtitle}>SHINE DEPOT</Text>
            </View>

            {/* Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={loginValidationSchema}
              onSubmit={handleLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
                status,
              }) => (
                <View style={styles.formContainer}>
                  {status && (
                    <Text
                      style={[
                        styles.errorText,
                        { marginBottom: 16, fontSize: 14, textAlign: "center" },
                      ]}
                    >
                      {status}
                    </Text>
                  )}
                  {/* Username Input */}
                  <CustomInput
                    label="Username"
                    icon={
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={colors.SECONDARY}
                      />
                    }
                    placeholder="Enter your username"
                    value={values.userName}
                    onChangeText={handleChange("userName")}
                    onBlur={handleBlur("userName")}
                    error={errors.userName}
                    touched={touched.userName}
                    autoCapitalize="none"
                    autoFocus={true}
                  />

                  {/* Password Input */}
                  <CustomInput
                    label="Password"
                    icon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.SECONDARY}
                      />
                    }
                    placeholder="Enter your password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={errors.password}
                    touched={touched.password}
                    isPassword={true}
                  />

                  {/* Login Button */}
                  <TouchableOpacity
                    style={[styles.loginButton, isSubmitting && { opacity: 0.7 }]}
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.loginButtonText}>
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Text>
                    {!isSubmitting && (
                      <Ionicons
                        name="log-in-outline"
                        size={22}
                        color={colors.DARK}
                      />
                    )}
                  </TouchableOpacity>

                  {/* Forgot Password */}
                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => router.push("/(auth)/ForgotPassword")}
                  >
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>ADMIN SUPPORT</Text>
                    <View style={styles.divider} />
                  </View>
                </View>
              )}
            </Formik>
          </ScrollView>
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
  backgroundIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "center",
    top: -50,
  },
  backgroundIcon: {
    opacity: 0.25,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.DARK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.SECONDARY,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  formContainer: {
    width: "100%",
  },
  formContainer: {
    width: "100%",
  },
  loginButton: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.DARK,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 24,
  },
  forgotPasswordText: {
    color: colors.SECONDARY,
    fontSize: 15,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
  },
  dividerText: {
    color: colors.SECONDARY,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    marginHorizontal: 16,
  },
});
