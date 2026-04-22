import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../constants/colors';

export default function EmployeeCard({ item, onPress, selectable = false, selected = false }) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(item); // For selections, pass back the item instead of directly routing
    } else {
      router.push(`/(protected)/(admin)/staff/(employee)/${item._id}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
    >
      {selectable ? (
        <Ionicons name="person-circle" size={44} color={colors.PRIMARY} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.user?.name ? item.user.name.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.user?.name || "Unknown Employee"}</Text>
        <Text style={styles.roleText}>
          {item.user?.role || "No Role Assigned"}
        </Text>

        {!selectable && (
          <Text
            style={[
              styles.statusText,
              { color: item.isAvailable ? "#4CAF50" : "#F44336" },
            ]}
          >
            {item.isAvailable ? "● Available" : "○ Unavailable"}
          </Text>
        )}
      </View>

      {selectable ? (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && (
            <Ionicons name="checkmark" size={16} color={colors.LIGHT} />
          )}
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.SECONDARY} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.PRIMARY + "30",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  avatarText: {
    color: colors.PRIMARY,
    fontWeight: "bold",
    fontSize: 18,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
  roleText: {
    color: colors.SECONDARY,
    fontSize: 14,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.BORDER_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },
});
