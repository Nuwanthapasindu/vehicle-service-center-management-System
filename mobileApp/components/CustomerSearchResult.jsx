import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

export default function CustomerSearchResult({ 
  title, 
  subtitle, 
  isHistory = false, 
  onPress 
}) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={[styles.iconContainer, isHistory && styles.historyIcon]}>
        <Ionicons 
          name={isHistory ? "time-outline" : "person"} 
          size={isHistory ? 18 : 16} 
          color={isHistory ? "#94A3B8" : colors.PRIMARY} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR + "40",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(142, 219, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyIcon: {
    backgroundColor: "transparent",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.DARK,
  },
  subtitle: {
    fontSize: 12,
    color: colors.SECONDARY,
    marginTop: 2,
  },
});
