import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  DeviceEventEmitter,
} from "react-native";
import { useRouter } from "expo-router";
import { Bell, CheckSquare, ChevronRight, Inbox } from "lucide-react-native";
import colors from "../../../constants/colors";
import { notificationService } from "../../../services/notification/notification.service";
import Toast from "react-native-toast-message";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.payload?.message || "Failed to load notifications",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen to real-time notification updates
    const subscription = DeviceEventEmitter.addListener("REFRESH_NOTIFICATIONS", () => {
      fetchNotifications(false);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      DeviceEventEmitter.emit("REFRESH_NOTIFICATIONS");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "All notifications marked as read",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to mark all as read",
      });
    }
  };

  const handleNotificationPress = async (item) => {
    try {
      if (!item.isRead) {
        await notificationService.markAsRead(item._id);
        DeviceEventEmitter.emit("REFRESH_NOTIFICATIONS");
      }
      // Navigate to bookings list (Option B preference)
      router.push("/(protected)/(admin)/booking");
    } catch (error) {
      router.push("/(protected)/(admin)/booking");
    }
  };

  const renderItem = ({ item }) => {
    const isUnread = !item.isRead;
    return (
      <TouchableOpacity
        style={[styles.notifCard, isUnread && styles.unreadCard]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notifHeader}>
          <View style={styles.titleContainer}>
            {isUnread && <View style={styles.unreadDot} />}
            <Text style={[styles.notifTitle, isUnread && styles.unreadText]}>
              {item.title}
            </Text>
          </View>
          <Text style={styles.notifTime}>
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}{" "}
            {new Date(item.createdAt).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <Text style={styles.notifMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <View style={styles.notifFooter}>
          <Text style={styles.actionText}>View Booking</Text>
          <ChevronRight size={16} color={colors.SECONDARY} />
        </View>
      </TouchableOpacity>
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
      {notifications.length > 0 && (
        <View style={styles.headerActions}>
          <Text style={styles.countText}>
            {notifications.filter((n) => !n.isRead).length} Unread Notifications
          </Text>
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <CheckSquare size={16} color={colors.PRIMARY} style={{ marginRight: 6 }} />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PRIMARY]} />
        }
        contentContainerStyle={[styles.listContent, notifications.length === 0 && { flex: 1 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Inbox size={48} color="#D1D5DB" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>You have no notifications at this time.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  listContent: {
    padding: 16,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 13,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  markAllText: {
    fontSize: 12,
    color: colors.DARK,
    fontWeight: "700",
  },
  notifCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  unreadCard: {
    borderColor: "rgba(142, 219, 0, 0.15)",
    backgroundColor: "rgba(142, 219, 0, 0.02)",
  },
  notifHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.PRIMARY,
    marginRight: 8,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.DARK,
  },
  unreadText: {
    fontWeight: "800",
  },
  notifTime: {
    fontSize: 11,
    color: colors.SECONDARY,
    fontWeight: "500",
  },
  notifMessage: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 12,
  },
  notifFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.03)",
    paddingTop: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.PRIMARY,
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
  },
});
