import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import timeslotSchema from "../../../../schema/timeslotSchema";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import CustomInput from "../../../../components/CustomInput";
import CustomButton from "../../../../components/CustomButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { parseTimeString, formatSyncTime, formatDisplayTime } from "../../../../utils/timeFormatter";

export default function UpdateTimeslot() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [initialValues, setInitialValues] = useState({
    startTime: new Date(),
    endTime: new Date(),
    maxCapacity: "5",
    isActive: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: timeslotSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          startTime: formatSyncTime(values.startTime),
          endTime: formatSyncTime(values.endTime),
          maxCapacity: parseInt(values.maxCapacity),
          isActive: values.isActive,
        };

        const response = await axios.put(`/timeslot/${id}`, payload);

        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.data.payload.message || "Time slot updated successfully",
        });
        router.back();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.response?.data?.payload?.message || "Failed to update time slot",
        });
      } finally {
        setLoading(false);
      }
    },
  });



  const fetchTimeslot = useCallback(async () => {
    try {
      const response = await axios.get(`/timeslot/${id}`);
      const slot = response.data.payload.slot;
      if (slot) {
        setInitialValues({
          startTime: parseTimeString(slot.startTime),
          endTime: parseTimeString(slot.endTime),
          maxCapacity: String(slot.maxCapacity),
          isActive: slot.isActive,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch timeslot details",
      });
      router.back();
    } finally {
      setInitialLoad(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchTimeslot();
  }, [fetchTimeslot]);

  const onStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) {
      formik.setFieldValue("startTime", selectedDate);
    }
  };

  const onEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) {
      formik.setFieldValue("endTime", selectedDate);
    }
  };





  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this time slot?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axios.delete(`/timeslot/${id}`);
              Toast.show({
                type: "success",
                text1: "Success",
                text2: response.data?.payload?.message || "Time slot deleted successfully",
              });
              router.back();
            } catch (error) {
              setLoading(false);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: error.response?.data?.payload?.message || "Failed to delete time slot",
              });
            }
          }
        }
      ]
    );
  };

  if (initialLoad) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SCHEDULE DETAILS</Text>
            <View style={styles.sectionCard}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => {
                  setShowEndPicker(false);
                  setShowStartPicker(!showStartPicker);
                }}
              >
                <Text style={styles.timeValue}>{formatDisplayTime(formik.values.startTime)}</Text>
                <Ionicons name="time-outline" size={24} color={colors.SECONDARY} />
              </TouchableOpacity>

              <Text style={[styles.inputLabel, { marginTop: 20 }]}>End Time</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => {
                  setShowStartPicker(false);
                  setShowEndPicker(!showEndPicker);
                }}
              >
                <Text style={styles.timeValue}>{formatDisplayTime(formik.values.endTime)}</Text>
                <Ionicons name="time-outline" size={24} color={colors.SECONDARY} />
              </TouchableOpacity>
              {formik.touched.endTime && formik.errors.endTime && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>{formik.errors.endTime}</Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OPERATIONAL LIMITS</Text>
            <View style={styles.sectionCard}>
               <CustomInput
                label="Maximum Capacity"
                placeholder="e.g. 5"
                value={formik.values.maxCapacity}
                onChangeText={formik.handleChange("maxCapacity")}
                onBlur={formik.handleBlur("maxCapacity")}
                error={formik.errors.maxCapacity}
                touched={formik.touched.maxCapacity}
                keyboardType="numeric"
                icon={<Ionicons name="people-outline" size={20} color={colors.SECONDARY} />}
              />

              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Is Active?</Text>
                  <Text style={styles.switchSubtitle}>Enable this slot for bookings</Text>
                </View>
                <Switch
                  value={formik.values.isActive}
                  onValueChange={(value) => formik.setFieldValue("isActive", value)}
                  trackColor={{ false: "#E2E8F0", true: colors.PRIMARY }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            text={loading ? "UPDATING..." : "UPDATE TIME SLOT"}
            onPress={formik.handleSubmit}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
            icon={!loading && <Ionicons name="checkmark-circle-outline" size={24} color={colors.DARK} />}
            disabled={loading}
          />
          <CustomButton
            text="Delete Time Slot"
            onPress={handleDelete}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
            icon={<Ionicons name="trash-outline" size={20} color="#ef4444" />}
            disabled={loading}
          />
        </View>

        {showStartPicker && (
          <View style={Platform.OS === "ios" && styles.pickerContainer}>
            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowStartPicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
            <DateTimePicker
              value={formik.values.startTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onStartTimeChange}
            />
          </View>
        )}

        {showEndPicker && (
          <View style={Platform.OS === "ios" && styles.pickerContainer}>
             {Platform.OS === "ios" && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowEndPicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
            <DateTimePicker
              value={formik.values.endTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onEndTimeChange}
            />
          </View>
        )}
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.SECONDARY,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 8,
  },
  timePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 52,
  },
  timeValue: {
    fontSize: 16,
    color: colors.DARK,
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
  },
  switchSubtitle: {
    fontSize: 12,
    color: colors.SECONDARY,
    marginTop: 2,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
    gap: 12, // For spacing between the two buttons
  },
  saveButton: {
    backgroundColor: colors.PRIMARY,
    height: 56,
    borderRadius: 12,
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: colors.DARK,
    fontSize: 18,
    fontWeight: "900",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ef4444",
    height: 56,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "700",
  },
  pickerContainer: {
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  doneButton: {
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: colors.BACKGROUND_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  doneButtonText: {
    color: colors.PRIMARY,
    fontWeight: "700",
    fontSize: 16,
  },
});
