import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Users, Search, ChevronRight } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import colors from "../../../../constants/colors";
import { userService } from "../../../../services/user/user.service";

export default function CustomersList() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async (query = "") => {
    setLoading(true);
    try {
      const data = await userService.getAllCustomers(query);
      setCustomers(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch customers",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCustomers(searchQuery);
    }, [])
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      {/* HEADER HERO */}
      <View style={styles.headerHero}>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroTitle}>Customer Directory</Text>
            <Text style={styles.heroSubtitle}>Manage and view your clients</Text>
          </View>
          <View style={styles.heroIconBox}>
            <Users size={28} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or mobile..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          All Customers ({customers.length})
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.PRIMARY} style={{ marginTop: 40 }} />
        ) : customers.length > 0 ? (
          customers.map((customer) => (
            <TouchableOpacity
              key={customer._id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => router.push(`/(protected)/(admin)/customers/${customer._id}`)}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.avatarBox, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={styles.avatarText}>{customer.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.customerMobile}>{customer.mobile}</Text>
                </View>
              </View>
              <View style={styles.arrowBox}>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Users size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No customers found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerHero: {
    backgroundColor: colors.PRIMARY,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  heroIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: colors.DARK,
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0284C7",
  },
  infoCol: {
    marginLeft: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
  },
  customerMobile: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.SECONDARY,
    marginTop: 4,
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    textAlign: "center",
    color: colors.SECONDARY,
    marginTop: 16,
    fontSize: 15,
    fontWeight: "500",
  },
});
