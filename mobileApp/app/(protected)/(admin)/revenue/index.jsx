import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import { invoiceService } from "../../../../services/invoice/invoice.service";

const RANGES = [
  { label: "Today", value: "today" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export default function RevenueReportScreen() {
  const [range, setRange] = useState("weekly");
  const [report, setReport] = useState({ totalIncome: 0, data: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.fetchIncomeReport(range);
      setReport(data);
    } catch (error) {
      console.error("Revenue report fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReport();
    }, [range])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReport();
  };

  const renderDataRow = useCallback(({ item }) => (
    <View style={styles.dataRow}>
      <View style={styles.dataRowLeft}>
        <Ionicons name="calendar-outline" size={20} color={colors.SECONDARY} />
        <Text style={styles.dataDate}>{item._id}</Text>
      </View>
      <View style={styles.dataRowRight}>
        <Text style={styles.dataCount}>{item.count} Invoices</Text>
        <Text style={styles.dataIncome}>
          LKR {(item.income || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {RANGES.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[
                styles.filterChip,
                range === r.value && styles.filterChipActive,
              ]}
              onPress={() => setRange(r.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  range === r.value && styles.filterTextActive,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Overview Card */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewLabel}>Total Revenue ({RANGES.find(r => r.value === range)?.label})</Text>
        {loading && !refreshing ? (
          <ActivityIndicator size="small" color={colors.PRIMARY} style={{ alignSelf: 'flex-start', marginTop: 10 }} />
        ) : (
          <Text style={styles.overviewAmount}>
            LKR {(report.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
        )}
      </View>

      {/* Data List */}
      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>Revenue Breakdown</Text>
        {loading && !refreshing && report.data.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.PRIMARY} />
          </View>
        ) : (
          <FlatList
            data={report.data}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={renderDataRow}
            contentContainerStyle={styles.flatListContent}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PRIMARY]} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color={colors.SECONDARY} />
                <Text style={styles.emptyText}>No revenue data found for this period.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.BACKGROUND_COLOR,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  filterChipActive: {
    backgroundColor: colors.PRIMARY + "30",
    borderColor: colors.PRIMARY,
  },
  filterText: {
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  filterTextActive: {
    color: colors.DARK,
    fontWeight: "bold",
  },
  overviewCard: {
    margin: 16,
    padding: 24,
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewLabel: {
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "600",
    marginBottom: 8,
  },
  overviewAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.DARK,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  listHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  dataRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataDate: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.DARK,
    fontWeight: "600",
  },
  dataRowRight: {
    alignItems: "flex-end",
  },
  dataCount: {
    fontSize: 12,
    color: colors.SECONDARY,
    marginBottom: 4,
  },
  dataIncome: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.PRIMARY,
  },
  centered: {
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    color: colors.SECONDARY,
    fontSize: 14,
    textAlign: "center",
  },
});
