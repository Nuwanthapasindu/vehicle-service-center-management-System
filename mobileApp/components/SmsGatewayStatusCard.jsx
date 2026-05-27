import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { MessageSquare } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import colors from "../constants/colors";
import { smsService } from "../services/sms/sms.service";

export default function SmsGatewayStatusCard({ refreshing }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch when screen gains focus
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      
      const fetchStatus = async () => {
        if (!status) {
          setLoading(true);
        }
        try {
          const data = await smsService.getSmsAccountStatus();
          if (isMounted) {
            setStatus(data);
          }
        } catch (error) {
          console.error("Failed to fetch SMS status in card (focus):", error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchStatus();

      return () => {
        isMounted = false;
      };
    }, [status])
  );

  // Fetch when parent screen triggers refresh (e.g. pull-to-refresh)
  useEffect(() => {
    let isMounted = true;
    if (refreshing) {
      const fetchStatus = async () => {
        try {
          const data = await smsService.getSmsAccountStatus();
          if (isMounted) {
            setStatus(data);
          }
        } catch (error) {
          console.error("Failed to fetch SMS status in card (refresh):", error);
        }
      };
      fetchStatus();
    }
    return () => {
      isMounted = false;
    };
  }, [refreshing]);

  if (loading) {
    return (
      <View style={[styles.statusCard, styles.center]}>
        <ActivityIndicator size="small" color={colors.PRIMARY} />
      </View>
    );
  }

  // Handle data structure: payload is { success: true, data: { status, sms_credit_balance, ... } }
  const smsData = status?.data || null;
  const isSmsActive = smsData?.status === "active";
  const displayStatus = smsData?.status 
    ? smsData.status.toUpperCase() 
    : (status ? "INACTIVE" : "OFFLINE");
  const displayBalance = smsData?.sms_credit_balance 
    ? parseFloat(smsData.sms_credit_balance.replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "N/A";

  const badgeBg = isSmsActive 
    ? "rgba(34, 197, 94, 0.08)" 
    : "rgba(239, 68, 68, 0.08)";
  const badgeBorder = isSmsActive 
    ? "rgba(34, 197, 94, 0.2)" 
    : "rgba(239, 68, 68, 0.2)";
  const badgeColor = isSmsActive 
    ? "#22C55E" 
    : "#EF4444";

  return (
    <View style={styles.statusCard}>
      <View style={styles.statusHeaderRow}>
        <Text style={styles.statusCardTitle}>SMS Gateway</Text>
        <View style={[styles.onlineBadge, { backgroundColor: badgeBg, borderColor: badgeBorder }]}>
          <View style={[styles.onlineDot, { backgroundColor: badgeColor }]} />
          <Text style={[styles.onlineText, { color: badgeColor }]}>{displayStatus}</Text>
        </View>
      </View>

      <View style={styles.statusContentRow}>
        <View>
          <Text style={styles.statusAmount}>{displayBalance}</Text>
          <Text style={styles.statusLabel}>SMS Credits Remaining (LKR)</Text>
        </View>
        <View style={styles.statusIconWrapper}>
          <MessageSquare size={44} color="rgba(142, 219, 0, 0.18)" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 120,
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusCardTitle: {
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statusContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  statusAmount: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.DARK,
    letterSpacing: -1,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: "600",
    marginTop: 4,
  },
  statusIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
