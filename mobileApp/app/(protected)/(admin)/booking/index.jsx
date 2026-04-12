import React, { useState, useEffect, useMemo } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import colors from "../../../../constants/colors";
import { useRouter } from "expo-router";
import { generateNextDays } from "../../../../utils/dateUtils";

const { width } = Dimensions.get("window");

export default function Bookings() {
  const router = useRouter();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate next viewing days
  const DAYS_COUNT = 14;
  const dates = useMemo(() => generateNextDays(DAYS_COUNT), []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const dateStr = dates[selectedDateIndex].isoDate;
      const response = await axios.get(`/timeslot/schedule?date=${dateStr}`);
      if (response.data?.payload?.schedule) {
        setScheduleData(response.data.payload.schedule);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [selectedDateIndex]);

  const renderDateItem = (item, index) => {
    const isSelected = index === selectedDateIndex;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dateCard,
          isSelected && styles.dateCardSelected,
        ]}
        onPress={() => setSelectedDateIndex(index)}
      >
        <Text style={[styles.dayText, isSelected && styles.textBlack]}>
          {item.day}
        </Text>
        <Text style={[styles.dateText, isSelected && styles.textBlack]}>
          {item.date}
        </Text>
        {isSelected && <View style={styles.selectedDot} />}
      </TouchableOpacity>
    );
  };

  const renderTimeSlot = (slot) => {
    const isFull = slot.isFull;

    return (
      <View key={slot.id} style={styles.timeSlotContainer}>
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
                  onPress={() => router.push(`/(protected)/(admin)/booking/${v.id}`)}
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
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Date Selector */}
      <View style={styles.headerArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScrollContent}
        >
          {dates.map((item, index) => renderDateItem(item, index))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainScrollContent}
      >
        <Text style={styles.scheduleTitle}>
          {dates[selectedDateIndex].fullDate}
        </Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.PRIMARY} />
          </View>
        ) : (
          <View style={styles.scheduleWrapper}>
            {scheduleData.length > 0 ? (
              scheduleData.map((slot) => renderTimeSlot(slot))
            ) : (
              <Text style={styles.emptyScheduleText}>No schedule found for this date.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  loaderContainer: {
    marginTop: 40,
    alignItems: "center"
  },
  headerArea: {
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  dateScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dateCard: {
    width: 64,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    backgroundColor: colors.LIGHT,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateCardSelected: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.SECONDARY,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.DARK,
  },
  textBlack: {
    color: colors.DARK,
  },
  selectedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.DARK,
    marginTop: 6,
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.DARK,
    marginBottom: 24,
  },
  scheduleWrapper: {
    paddingLeft: 4,
  },
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
    borderColor: "#FECDD3", // light red border for full slot
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
    borderColor: "rgba(0,0,0,0.03)"
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
    fontStyle: "italic"
  },
  emptyScheduleText: {
    color: colors.SECONDARY,
    textAlign: "center",
    marginTop: 20
  }
});
