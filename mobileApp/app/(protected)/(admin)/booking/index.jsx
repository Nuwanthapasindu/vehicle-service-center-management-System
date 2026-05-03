import React, { useState, useEffect, useMemo, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

import colors from "../../../../constants/colors";
import { useRouter } from "expo-router";
import { generateNextDays } from "../../../../utils/dateUtils";
import TimeSlotCard from "../../../../components/TimeSlotCard";
import Toast from "react-native-toast-message";
import { formatTimeStringForDisplay } from "../../../../utils/timeFormatter";

const { width } = Dimensions.get("window");

export default function Bookings() {
  const router = useRouter();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);


  // Modal states
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);


  // Generate next viewing days
  const DAYS_COUNT = 31;
  const dates = useMemo(() => generateNextDays(DAYS_COUNT), []);


  const fetchSchedule = async () => {
    setLoading(true);
    setScheduleData([]); // Reset stale data before fetching new results
    try {
      const dateStr = dates[selectedDateIndex].isoDate;
      const response = await axios.get(`/timeslot/schedule?date=${dateStr}`);
      if (response.data?.payload?.schedule) {
        setScheduleData(response.data.payload.schedule);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.payload?.message || "Failed to fetch schedule",
      });
      setScheduleData([]); // Ensure it's cleared on error as well
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSchedule();
    }, [selectedDateIndex])
  );


  const handleBookingPress = (booking) => {
    setSelectedBooking(booking);
    setShowActionModal(true);
  };

  const renderDateItem = (item, index) => {
    const isSelected = index === selectedDateIndex;

    return (
      <TouchableOpacity
        key={index}
        style={[styles.dateCard, isSelected && styles.dateCardSelected]}
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
              scheduleData.map((slot) => (
                <TimeSlotCard
                  key={slot.id}
                  slot={slot}
                  onBookingPress={handleBookingPress}
                />
              ))
            ) : (
              <Text style={styles.emptyScheduleText}>
                No schedule found for this date.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Action Selection Modal */}
      <Modal visible={showActionModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionModal(false)}
        >
          <View style={styles.actionModalContainer}>
            <Text style={styles.modalTitle}>Select Action</Text>
            <Text style={styles.modalSubtitle}>
              Vehicle: {selectedBooking?.plate}
            </Text>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                setShowActionModal(false);
                router.push(
                  `/(protected)/(admin)/booking/${selectedBooking.id}`
                );
              }}
            >
              <Ionicons name="eye-outline" size={24} color={colors.PRIMARY} />
              <Text style={styles.actionBtnText}>Open this booking</Text>
            </TouchableOpacity>

            {selectedBooking?.jobStatus !== "FINISH" && (
              <TouchableOpacity
                style={[styles.actionBtn, { borderBottomWidth: 0 }]}
                onPress={() => {
                  setShowActionModal(false);
                  router.push(
                    `/(protected)/(admin)/booking/manage/${selectedBooking.id}`
                  );
                }}
              >
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={colors.SECONDARY}
                />
                <Text style={styles.actionBtnText}>Manage this booking</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowActionModal(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    alignItems: "center",
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
  emptyScheduleText: {
    color: colors.SECONDARY,
    textAlign: "center",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  actionModalContainer: {
    backgroundColor: colors.LIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.DARK,
    textAlign: "center",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.SECONDARY,
    textAlign: "center",
    marginBottom: 24,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
    gap: 16,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
  },
  cancelBtn: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.SECONDARY,
  },
});
