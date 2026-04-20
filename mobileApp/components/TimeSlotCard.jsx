import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { useRouter } from "expo-router";

export default function TimeSlotCard({ slot, onBookingPress }) {
  const isFull = slot.isFull;

  return (
    <View style={styles.timeSlotContainer}>
      {/* Left Side: Time and Timeline */}
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{slot.time}</Text>
        <View style={styles.timelineLine} />
      </View>

      {/* Right Side: Details Card */}
      <View
        style={[
          styles.slotCard,
          isFull ? styles.slotCardFull : styles.slotCardNormal,
        ]}
      >
        {/* Badge */}
        <View
          style={[
            styles.badge,
            isFull ? styles.badgeFull : styles.badgeNormal,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isFull ? styles.badgeTextFull : styles.badgeTextNormal,
            ]}
          >
            {slot.status}
          </Text>
        </View>

        {/* Vehicle List */}
        <View style={styles.vehiclesContainer}>
          {slot.vehicles && slot.vehicles.length > 0 ? (
            slot.vehicles.map((v, i) => (
              <TouchableOpacity
                key={i}
                style={styles.vehicleRow}
                onPress={() => onBookingPress && onBookingPress(v)}
              >
                <Text style={styles.vehiclePlate}>{v.plate}</Text>
                <Ionicons
                  name={v.type === "bus" || v.type === "van" ? "bus-outline" : "build-outline"}
                  size={16}
                  color={colors.SECONDARY}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptySlotContainer}>
              <Text style={styles.emptySlotText}>No bookings for this slot</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  timeSlotContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timeColumn: {
    width: 70,
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.SECONDARY,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: colors.BORDER_COLOR,
    marginTop: 8,
    opacity: 0.6,
  },
  slotCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: colors.LIGHT,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    marginLeft: 8,
  },
  slotCardNormal: {
    borderColor: colors.BORDER_COLOR,
  },
  slotCardFull: {
    borderColor: "#FECDD3",
    backgroundColor: "#FFFAFA",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  badgeNormal: {
    backgroundColor: "#F3FADD",
    borderWidth: 1,
    borderColor: "#E1F2A7",
  },
  badgeFull: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  badgeTextNormal: {
    color: "#65A30D",
  },
  badgeTextFull: {
    color: colors.DANGER_COLOR,
  },
  vehiclesContainer: {
    gap: 8,
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  vehiclePlate: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.DARK,
  },
  emptySlotContainer: {
    paddingVertical: 10,
  },
  emptySlotText: {
    color: colors.SECONDARY,
    fontSize: 13,
    fontStyle: "italic",
  },
});
