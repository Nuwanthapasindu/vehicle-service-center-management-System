import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../constants/colors";

export default function Dashboard() {
  return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* KEY PERFORMANCE INDICATORS */}
        <Text style={styles.sectionTitle}>KEY PERFORMANCE INDICATORS</Text>

        <View style={styles.kpiContainer}>
          {/* Revenue Card */}
          <View style={styles.card}>
            <View>
              <Text style={styles.cardSubtitle}>Today's Revenue</Text>
              <Text style={styles.revenueAmount}>$4,250.00</Text>
            </View>
          </View>

          {/* Active Jobs Card */}
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View>
                <Text style={styles.cardSubtitle}>Active Jobs</Text>
                <Text style={[styles.kpiValue, { color: colors.PRIMARY }]}>
                  12
                </Text>
              </View>
              <View style={styles.iconWrapperGreen}>
                <Ionicons
                  name="construct-outline"
                  size={24}
                  color={colors.PRIMARY}
                />
              </View>
            </View>
          </View>

          {/* Pending Card */}
          <View style={[styles.card, styles.borderedCard]}>
            <View style={styles.cardRow}>
              <View>
                <Text style={styles.cardSubtitle}>Pending</Text>
                <Text style={styles.kpiValueDark}>8</Text>
              </View>
              <View style={styles.iconWrapperGray}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={colors.SECONDARY}
                />
              </View>
            </View>
          </View>

          {/* Completed Jobs Card */}
          <View style={[styles.card, styles.borderedCard]}>
            <View style={styles.cardRow}>
              <View>
                <Text style={styles.cardSubtitle}>Completed Jobs</Text>
                <Text style={styles.kpiValueDark}>8</Text>
              </View>
              <View style={styles.iconWrapperGray}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={colors.SECONDARY}
                />
              </View>
            </View>
          </View>
        </View>

        {/* QUICK NAVIGATION */}
        <Text style={styles.sectionTitle}>QUICK NAVIGATION</Text>

        <View style={styles.navGrid}>
          {/* Booking Trends */}
          <TouchableOpacity style={styles.navCard}>
            <View style={styles.navIconWrapperGreen}>
              <Ionicons name="trending-up" size={24} color={colors.PRIMARY} />
            </View>
            <Text style={styles.navTitle}>Booking Trends</Text>
            <Text style={styles.navSubtitle}>ANALYZE VOLUME</Text>
          </TouchableOpacity>

          {/* Inventory Status */}
          <TouchableOpacity style={styles.navCard}>
            <View style={styles.navIconWrapperGreen}>
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={24}
                color={colors.PRIMARY}
              />
            </View>
            <Text style={styles.navTitle}>Inventory Status</Text>
            <Text style={styles.navSubtitle}>STOCK ALERTS</Text>
          </TouchableOpacity>

          {/* Customer Reviews */}
          <TouchableOpacity style={styles.navCard}>
            <View style={styles.navIconWrapperGreen}>
              <Ionicons name="star-outline" size={24} color={colors.PRIMARY} />
            </View>
            <Text style={styles.navTitle}>Customer</Text>
            <Text style={styles.navTitle}>Reviews</Text>
            <Text style={styles.navSubtitle}>RECENT FEEDBACK</Text>
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
    borderColor: colors.PRIMARY + "30", // adding transparency to primary color
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
    borderRadius: 24, // circular looking
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
