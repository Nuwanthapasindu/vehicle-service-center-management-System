import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import { useFocusEffect, useRouter } from "expo-router";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import axios from "axios";
import { formatTimeStringForDisplay } from "../../../../utils/timeFormatter";

export default function TimeslotConfiguration() {
  const router = useRouter();
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchTimeslots = async () => {
    try {
      const response = await axios.get("/timeslot/all");
      setTimeslots(response.data.payload.slots || []);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch timeslots",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTimeslots();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTimeslots();
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      setTogglingId(id);
      await axios.patch(`/timeslot/${id}/state`, { isActive: !currentStatus });
      
      // Optimized local state update
      setTimeslots(prev =>
        prev.map(slot => (slot._id === id ? { ...slot, isActive: !currentStatus } : slot))
      );
      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Slot ${!currentStatus ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to update status",
      });
    } finally {
      setTogglingId(null);
    }
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerLabel}>SHINE DEPOT ADMIN</Text>
          <Text style={styles.headerTitle}>Daily Availability</Text>
          <Text style={styles.headerSubtitle}>
            Manage active service slots and vehicle capacities.
          </Text>
        </View>

        <View style={styles.slotsContainer}>
          {Array.isArray(timeslots) && timeslots.map((slot) => (
            <TouchableOpacity 
              key={slot._id}
              activeOpacity={0.7}
              onPress={() => router.push(`/(protected)/(admin)/timeslots/${slot._id}`)}
              style={[styles.card, !slot.isActive && styles.disabledCard]}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.timeText, !slot.isActive && styles.disabledText]}>
                    {formatTimeStringForDisplay(slot.startTime)}
                  </Text>
                  <View style={styles.capacityWrapper}>
                    <Ionicons name="car-outline" size={16} color={slot.isActive ? colors.SECONDARY : "#CBD5E1"} />
                    <Text style={[styles.capacityText, !slot.isActive && styles.disabledText]}>
                      Max Capacity: {slot.maxCapacity} Vehicles
                    </Text>
                  </View>
                </View>
                {togglingId === slot._id ? (
                  <ActivityIndicator size="small" color={colors.PRIMARY} style={{ marginHorizontal: 10 }} />
                ) : (
                  <Switch
                    value={slot.isActive}
                    onValueChange={() => handleToggle(slot._id, slot.isActive)}
                    trackColor={{ false: "#E2E8F0", true: colors.PRIMARY }}
                    thumbColor="#FFFFFF"
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {timeslots.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyText}>No timeslots configured.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(protected)/(admin)/timeslots/add")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={colors.DARK} />
      </TouchableOpacity>
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
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.PRIMARY,
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.SECONDARY,
    lineHeight: 20,
  },
  slotsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  disabledCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 6,
  },
  capacityWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  capacityText: {
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "500",
    marginLeft: 6,
  },
  disabledText: {
    color: "#94A3B8",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.SECONDARY,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors.PRIMARY,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});
