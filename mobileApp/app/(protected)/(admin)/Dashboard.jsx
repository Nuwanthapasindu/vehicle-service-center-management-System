import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { invoiceService } from "../../../services/invoice/invoice.service";
import Toast from "react-native-toast-message";

export default function Dashboard() {
  const router = useRouter();
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const report = await invoiceService.fetchIncomeReport("today");
      setRevenue(report.totalIncome || 0);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching dashboard data",
        text2:error?.response?.data?.payload?.message || error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PRIMARY]} />
      }
    >
      {/* KEY PERFORMANCE INDICATORS */}
      <Text style={styles.sectionTitle}>KEY PERFORMANCE INDICATORS</Text>

      <View style={styles.kpiContainer}>
        {/* Revenue Card */}
        <View style={styles.card}>
          <View>
            <Text style={styles.cardSubtitle}>Today's Revenue</Text>
            {loading && !refreshing ? (
              <ActivityIndicator size="small" color={colors.PRIMARY} style={{ alignSelf: 'flex-start', marginTop: 10 }} />
            ) : (
              <Text style={styles.revenueAmount}>
                LKR {revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* QUICK NAVIGATION */}
      <Text style={styles.sectionTitle}>QUICK NAVIGATION</Text>

      <View style={styles.navGrid}>
        {/* Supply Chain Tile */}
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push("/(protected)/(admin)/supplychain")}
        >
          <View style={styles.navIconWrapperGreen}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={colors.PRIMARY} />
          </View>
          <Text style={styles.navTitle}>Supply Chain</Text>
          <Text style={styles.navSubtitle}>MANAGE VENDORS</Text>
        </TouchableOpacity>

        {/* Inventory Analysis */}
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push("/(protected)/(admin)/(InventoryAnalysis)")}
        >
          <View style={styles.navIconWrapperGreen}>
            <Ionicons name="bar-chart-outline" size={24} color={colors.PRIMARY} />
          </View>
          <Text style={styles.navTitle}>Stock Analysis</Text>
          <Text style={styles.navSubtitle}>ANALYZE REPORT</Text>
        </TouchableOpacity>

        {/* Inventory Logs */}
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => router.push("/(protected)/(admin)/(InventoryLog)")}
        >
          <View style={styles.navIconWrapperGreen}>
            <Ionicons name="list-outline" size={24} color={colors.PRIMARY} />
          </View>
          <Text style={styles.navTitle}>Inventory Logs</Text>
          <Text style={styles.navSubtitle}>ITEM HISTORY</Text>
        </TouchableOpacity>

        {/* Customer Reviews */}
        <TouchableOpacity 
          style={styles.navCard}
          onPress={() => router.push("/(protected)/(admin)/reviews")}
        >
          <View style={styles.navIconWrapperGreen}>
            <Ionicons name="star-outline" size={24} color={colors.PRIMARY} />
          </View>
          <Text style={styles.navTitle}>Reviews</Text>
          <Text style={styles.navSubtitle}>MODERATE FEEDBACK</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  kpiContainer: {
    gap: 16,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  borderedCard: {
    borderWidth: 1,
    borderColor: colors.PRIMARY + "30",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSubtitle: {
    fontSize: 15,
    color: colors.SECONDARY,
    marginBottom: 4,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.DARK,
    marginTop: 4,
  },
  kpiValue: {
    fontSize: 34,
    fontWeight: "900",
    fontStyle: "italic",
    marginTop: 4,
  },
  kpiValueDark: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.DARK,
    marginTop: 4,
  },
  iconWrapperGreen: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.PRIMARY + "25",
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapperGray: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.SECONDARY + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  navGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  navCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 20,
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  navIconWrapperGreen: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.PRIMARY + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    lineHeight: 22,
  },
  navSubtitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.SECONDARY,
    marginTop: 8,
  },
});