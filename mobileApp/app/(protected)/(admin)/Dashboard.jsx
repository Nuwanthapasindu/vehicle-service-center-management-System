import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Truck, BarChart2, List, Star, CreditCard, ChevronRight } from "lucide-react-native";
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
        text1: "Data Error",
        text2: error?.response?.data?.payload?.message || "Failed to sync dashboard",
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
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PRIMARY]} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER SECTION */}
      <View style={styles.headerHero}>
        <Text style={styles.greetingText}>Welcome back, Admin</Text>
        <Text style={styles.subGreetingText}>Here is your summary for today</Text>

        <View style={styles.revenueCard}>
          <View style={styles.revenueHeaderRow}>
            <Text style={styles.revenueCardTitle}>Today's Revenue</Text>
            <TouchableOpacity onPress={() => router.push("/(protected)/(admin)/revenue")}>
              <Text style={styles.revenueActionText}>View Report</Text>
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <ActivityIndicator size="small" color="#FFF" style={styles.loader} />
          ) : (
            <Text style={styles.revenueAmount}>
              LKR {revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          )}
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.bodyContent}>
        <Text style={styles.sectionTitle}>Overview & Actions</Text>

        <View style={styles.actionGrid}>
          {/* Action Tile 1 */}
          <TouchableOpacity 
            style={styles.actionTile}
            onPress={() => router.push("/(protected)/(admin)/supplychain")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Truck size={22} color="#1976D2" />
            </View>
            <Text style={styles.tileTitle}>Supply Chain</Text>
            <Text style={styles.tileSubtitle}>Vendors & Purchases</Text>
          </TouchableOpacity>

          {/* Action Tile 2 */}
          <TouchableOpacity 
            style={styles.actionTile}
            onPress={() => router.push("/(protected)/(admin)/revenue")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
              <CreditCard size={22} color="#388E3C" />
            </View>
            <Text style={styles.tileTitle}>Financials</Text>
            <Text style={styles.tileSubtitle}>Invoices & Revenue</Text>
          </TouchableOpacity>

          {/* Action Tile 3 */}
          <TouchableOpacity 
            style={styles.actionTile}
            onPress={() => router.push("/(protected)/(admin)/(InventoryAnalysis)")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
              <BarChart2 size={22} color="#F57C00" />
            </View>
            <Text style={styles.tileTitle}>Stock Analysis</Text>
            <Text style={styles.tileSubtitle}>Inventory Health</Text>
          </TouchableOpacity>

          {/* Action Tile 4 */}
          <TouchableOpacity 
            style={styles.actionTile}
            onPress={() => router.push("/(protected)/(admin)/(InventoryLog)")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
              <List size={22} color="#7B1FA2" />
            </View>
            <Text style={styles.tileTitle}>Stock Logs</Text>
            <Text style={styles.tileSubtitle}>Movement History</Text>
          </TouchableOpacity>
        </View>

        {/* List Section */}
        <Text style={styles.sectionTitle}>Engagement</Text>
        <TouchableOpacity 
          style={styles.listRow}
          onPress={() => router.push("/(protected)/(admin)/reviews")}
          activeOpacity={0.7}
        >
          <View style={styles.listRowIconContainer}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF8E1' }]}>
              <Star size={24} color="#FFA000" fill="#FFA000" />
            </View>
          </View>
          <View style={styles.listRowTextContainer}>
            <Text style={styles.listRowTitle}>Customer Feedback</Text>
            <Text style={styles.listRowSubtitle}>Review & Moderate User Comments</Text>
          </View>
          <ChevronRight size={20} color="#BDBDBD" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.listRow}
          onPress={() => router.push("/(protected)/(admin)/reviews/report")}
          activeOpacity={0.7}
        >
          <View style={styles.listRowIconContainer}>
            <View style={[styles.iconBox, { backgroundColor: '#E0F2F1' }]}>
              <BarChart2 size={24} color="#00897B" />
            </View>
          </View>
          <View style={styles.listRowTextContainer}>
            <Text style={styles.listRowTitle}>Satisfaction Report</Text>
            <Text style={styles.listRowSubtitle}>Analyze Customer Sentiment</Text>
          </View>
          <ChevronRight size={20} color="#BDBDBD" />
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerHero: {
    backgroundColor: colors.LIGHT,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    zIndex: 10,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.DARK,
    letterSpacing: -0.5,
  },
  subGreetingText: {
    fontSize: 14,
    color: colors.SECONDARY,
    marginTop: 4,
    marginBottom: 24,
  },
  revenueCard: {
    backgroundColor: colors.PRIMARY,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  revenueHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  revenueCardTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  revenueActionText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "700",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  revenueAmount: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  loader: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  bodyContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 28,
  },
  actionTile: {
    width: "47%",
    backgroundColor: colors.LIGHT,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 4,
  },
  tileSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.SECONDARY,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  listRowIconContainer: {
    marginRight: 16,
  },
  listRowTextContainer: {
    flex: 1,
  },
  listRowTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 4,
  },
  listRowSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.SECONDARY,
  },
});