import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

export default function CustomInput({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  isPassword = false,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[styles.inputWrapper, touched && error && styles.inputError]}
      >
        {icon && <View style={styles.inputIcon}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={colors.SECONDARY}
            />
          </TouchableOpacity>
        )}
      </View>
      {touched && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
    width: "100%",
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
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: colors.DANGER_COLOR,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
