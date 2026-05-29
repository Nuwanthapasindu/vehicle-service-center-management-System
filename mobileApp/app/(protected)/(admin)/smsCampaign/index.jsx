import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Mail, Plus, Users, Calendar, User } from "lucide-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import colors from "../../../../constants/colors";
import { smsService } from "../../../../services/sms/sms.service";

export default function SmsCampaignList() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCampaigns = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const data = await smsService.getSmsCampaigns();
      setCampaigns(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch campaigns",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCampaigns();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCampaigns(true);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " " + date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item }) => {
    const isPromo = item.campaignType === "PROMOTIONAL";
    return (
      <View style={styles.campaignCard}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.typeBadge,
              isPromo ? styles.promoBadge : styles.transBadge,
            ]}
          >
            <Text style={[styles.typeText, isPromo ? styles.promoText : styles.transText]}>
              {item.campaignType}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Calendar size={12} color={colors.SECONDARY} style={{ marginRight: 4 }} />
            <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
          </View>
        </View>

        <Text style={styles.campaignTitle}>{item.title}</Text>
        <Text style={styles.campaignMessage}>{item.message}</Text>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.footerInfoItem}>
            <Users size={14} color={colors.SECONDARY} style={{ marginRight: 4 }} />
            <Text style={styles.footerInfoText}>{item.recipientsCount} customers</Text>
          </View>
          <View style={styles.footerInfoItem}>
            <User size={14} color={colors.SECONDARY} style={{ marginRight: 4 }} />
            <Text style={styles.footerInfoText} numberOfLines={1}>
              By {item.sentBy?.name || "Admin"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={campaigns}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.PRIMARY]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          campaigns.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Mail size={48} color="#D1D5DB" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No Campaigns Sent</Text>
            <Text style={styles.emptySubtitle}>
              Create a new SMS campaign to dispatch promotions or alerts to all customers.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push("/(protected)/(admin)/smsCampaign/create")}
      >
        <Plus size={24} color={colors.DARK} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  listContent: {
    padding: 16,
    paddingBottom: 88, // space for FAB
  },
  campaignCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  promoBadge: {
    backgroundColor: "rgba(142, 219, 0, 0.1)",
  },
  transBadge: {
    backgroundColor: "rgba(249, 115, 22, 0.1)",
  },
  typeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  promoText: {
    color: "#65A30D",
  },
  transText: {
    color: "#EA580C",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 11,
    color: colors.SECONDARY,
    fontWeight: "500",
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 6,
  },
  campaignMessage: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  footerInfoText: {
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.SECONDARY,
    textAlign: "center",
    lineHeight: 18,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: colors.PRIMARY,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});
