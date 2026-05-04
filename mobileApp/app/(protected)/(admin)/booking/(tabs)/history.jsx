import React, { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { bookingService } from "../../../../../services/booking/booking.service";
import colors from "../../../../../constants/colors";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import BookingHistoryCard from "../../../../../components/booking/BookingHistoryCard";

export default function HistoryBookings() {
  const router = useRouter();
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await bookingService.getBookingHistoryAdmin();
      if (response.data?.payload?.history) {
        setHistoryData(response.data.payload.history);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch history",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const renderHistoryItem = (item) => {
    return (
      <BookingHistoryCard
        key={item.id}
        item={item}
        onPress={() => router.push(`/(protected)/(admin)/booking/${item.id}`)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.mainScrollContent}>
        <Text style={styles.scheduleTitle}>Booking History</Text>
        {loadingHistory ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.PRIMARY} />
          </View>
        ) : (
          <View style={styles.scheduleWrapper}>
            {historyData.length > 0 ? (
              historyData.map(renderHistoryItem)
            ) : (
              <Text style={styles.emptyScheduleText}>No booking history found.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.BACKGROUND_COLOR },
  loaderContainer: { marginTop: 40, alignItems: "center" },
  mainScroll: { flex: 1 },
  mainScrollContent: { padding: 20, paddingBottom: 40 },
  scheduleTitle: { fontSize: 20, fontWeight: "900", color: colors.DARK, marginBottom: 24 },
  scheduleWrapper: { paddingLeft: 4 },
  emptyScheduleText: { color: colors.SECONDARY, textAlign: "center", marginTop: 20 },
});
