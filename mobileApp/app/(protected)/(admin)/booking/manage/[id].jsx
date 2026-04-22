import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import colors from "../../../../../constants/colors";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatTimeStringForDisplay } from "../../../../../utils/timeFormatter";
import { Formik } from "formik";
import { manageBookingSchema } from "../../../../../schemas/manageBooking.schema";

const { width } = Dimensions.get("window");

export default function ManageBooking() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [booking, setBooking] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Formik Initialization State
  const [initialFormValues, setInitialFormValues] = React.useState({
    selectedDate: new Date(),
    selectedSlotId: null,
  });

  // Reschedule state
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [availableSlots, setAvailableSlots] = React.useState([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);

  // Initial data loader
  const loadInitialData = React.useCallback(async () => {
    try {
      setLoading(true);
      // 1. Fetch Booking Details
      const bookingRes = await axios.get(`/booking/admin/${id}/details`);
      const details = bookingRes.data.payload.data;
      setBooking(details);

      // 2. Fetch Slots for the booking date
      if (details.date) {
        const targetDate = new Date(details.date);
        
        setInitialFormValues({ selectedDate: targetDate, selectedSlotId: null });

        const dateStr = details.date; // Use string from details directly if it's YYYY-MM-DD
        const slotsRes = await axios.get(`/timeslot/available?date=${dateStr}`);
        setAvailableSlots(slotsRes.data.payload.slots || []);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load management data",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const fetchSlotsOnly = React.useCallback(async (date) => {
    setLoadingSlots(true);
    try {
      const dateStr = date.toISOString().split("T")[0];
      const response = await axios.get(`/timeslot/available?date=${dateStr}`);
      setAvailableSlots(response.data.payload.slots || []);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch available slots",
      });
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleReschedule = async (values) => {
    try {
      setIsUpdating(true);
      const dateStr = values.selectedDate.toISOString().split("T")[0];
    const response =  await axios.patch(`/booking/admin/${id}`, {
        date: dateStr,
        slot: values.selectedSlotId,
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.payload.message,
      });
      router.replace("/(protected)/(admin)/booking");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2:
          error.response?.data?.payload?.message || "Failed to update booking",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking? This will remove it from the schedule.",
      [
        { text: "No, Keep it", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setIsUpdating(true);
              await axios.delete(`/booking/admin/${id}`);
              Toast.show({
                type: "success",
                text1: "Cancelled",
                text2: "Booking has been removed",
              });
              router.replace("/(protected)/(admin)/booking");
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2:
                  error.response?.data?.payload?.message ||
                  "Failed to cancel booking",
              });
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color={colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Booking</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking Summary Card */}
        <View style={styles.infoCard}>
          <View style={styles.vehicleInfo}>
            <MaterialCommunityIcons
              name="car-outline"
              size={32}
              color={colors.PRIMARY}
            />
            <View style={styles.vehicleText}>
              <Text style={styles.plateNumber}>{booking?.vehicle?.plate}</Text>
              <Text style={styles.vehicleModel}>{booking?.vehicle?.name}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.currentSchedule}>
            <View style={styles.scheduleDetail}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.SECONDARY}
              />
              <Text style={styles.scheduleText}>{booking?.date}</Text>
            </View>
            <View style={styles.scheduleDetail}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.SECONDARY}
              />
              <Text style={styles.scheduleText}>{booking?.time}</Text>
            </View>
          </View>
        </View>

        <Formik
          initialValues={initialFormValues}
          enableReinitialize={true}
          validationSchema={manageBookingSchema}
          onSubmit={handleReschedule}
        >
          {({ values, setFieldValue, handleSubmit, errors, touched }) => (
            <View>
              {/* Reschedule Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reschedule Service</Text>

                <Text style={styles.label}>Select Date</Text>
                <TouchableOpacity
                  style={styles.datePickerBtn}
                  onPress={() => setShowDatePicker( prev=> !prev)}
                >
                  <View style={styles.datePickerContent}>
                    <Ionicons name="calendar" size={20} color={colors.PRIMARY} />
                    <Text style={styles.dateValue}>
                      {values.selectedDate ? values.selectedDate.toDateString() : "Loading..."}
                    </Text>
                  </View>
                  <Ionicons
                    name={showDatePicker ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.SECONDARY}
                  />
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={values.selectedDate || new Date()}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (event.type === "set" && date) {
                        setFieldValue("selectedDate", date);
                        setFieldValue("selectedSlotId", null);
                        fetchSlotsOnly(date);
                      }
                    }}
                  />
                )}
                {touched.selectedDate && errors.selectedDate && (
                  <Text style={styles.errorText}>{errors.selectedDate}</Text>
                )}

                <Text style={[styles.label, { marginTop: 12 }]}>Select Available Timeslot</Text>
                {loadingSlots ? (
                  <ActivityIndicator
                    color={colors.PRIMARY}
                    style={{ marginTop: 20 }}
                  />
                ) : (
                  <View style={styles.slotsGrid}>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => {
                        const isFull = slot.isFull;
                        const isSelected = values.selectedSlotId === slot.id;

                        return (
                          <TouchableOpacity
                            key={slot.id}
                            style={[
                              styles.slotItem,
                              isSelected && styles.slotItemSelected,
                              isFull && styles.slotItemDisabled,
                            ]}
                            disabled={isFull}
                            onPress={() => setFieldValue("selectedSlotId", slot.id)}
                          >
                            <Text
                              style={[
                                styles.slotTime,
                                isSelected && styles.slotTimeSelected,
                                isFull && styles.slotTextDisabled,
                              ]}
                            >
                              {formatTimeStringForDisplay(slot.startTime)}
                            </Text>
                            <Text
                              style={[
                                styles.slotCapacity,
                                isSelected && styles.slotCapacitySelected,
                                isFull && styles.slotTextDisabled,
                              ]}
                            >
                              {isFull
                                ? "FULLY BOOKED"
                                : `${slot.maxCapacity - slot.booked} left`}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text style={styles.noSlotsText}>
                        No active slots available for this date.
                      </Text>
                    )}
                  </View>
                )}
                {touched.selectedSlotId && errors.selectedSlotId && (
                  <Text style={styles.errorText}>{errors.selectedSlotId}</Text>
                )}
              </View>

              {/* Actions */}
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.applyBtn, isUpdating && { opacity: 0.7 }]}
                  onPress={handleSubmit}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.applyBtnText}>Update Schedule</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBookingBtn}
                  onPress={handleCancelBooking}
                  disabled={isUpdating}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.DANGER_COLOR}
                  />
                  <Text style={styles.cancelBookingBtnText}>Cancel this booking</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    flex: 1,
    textAlign: "right",
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  vehicleText: {
    marginLeft: 16,
  },
  plateNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.DARK,
  },
  vehicleModel: {
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
    marginBottom: 16,
  },
  currentSchedule: {
    flexDirection: "row",
    gap: 20,
  },
  scheduleDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.SECONDARY,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.DARK,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.SECONDARY,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginBottom: 10,
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },
  slotItem: {
    width: (width - 52) / 2,
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    alignItems: "center",
  },
  slotItemSelected: {
    borderColor: colors.PRIMARY,
    backgroundColor: "#F4FADE",
    borderWidth: 2,
  },
  slotItemDisabled: {
    backgroundColor: "#F1F5F9",
    opacity: 0.6,
  },
  slotTime: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 4,
  },
  slotTimeSelected: {
    color: colors.DARK,
  },
  slotCapacity: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.SECONDARY,
  },
  slotCapacitySelected: {
    color: colors.PRIMARY,
  },
  slotTextDisabled: {
    color: "#94A3B8",
  },
  noSlotsText: {
    textAlign: "center",
    color: colors.SECONDARY,
    marginTop: 10,
    width: "100%",
  },
  actionContainer: {
    gap: 12,
    marginBottom: 40,
  },
  applyBtn: {
    backgroundColor: colors.DARK,
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  applyBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
  },
  cancelBookingBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.DANGER_COLOR,
    gap: 10,
  },
  cancelBookingBtnText: {
    color: colors.DANGER_COLOR,
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: colors.DANGER_COLOR,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
});

