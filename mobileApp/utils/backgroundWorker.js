import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storageKeys from "../constants/storageKeys";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

// Configure local notifications presentation
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  try {
    const token = await SecureStore.getItemAsync(storageKeys.PERSONAL_ACCESS_TOKEN);
    if (!token) return BackgroundTask.BackgroundTaskResult.Success;

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiUrl) return BackgroundTask.BackgroundTaskResult.Failed;

    const response = await fetch(`${apiUrl}/notifications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401 || response.status === 403) {
      // If the request fails due to authorization, return Success to prevent repeated failure reports
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    if (!response.ok) {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }

    const json = await response.json();
    const notifications = json?.payload || [];

    if (notifications.length === 0) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    // Get last checked notification timestamp
    const lastCheckStr = await AsyncStorage.getItem("LAST_NOTIFICATION_CHECK");
    const lastCheck = lastCheckStr ? new Date(lastCheckStr) : new Date(0);

    // Filter unread and newer than last check
    const newNotifications = notifications.filter(
      (n) => !n.isRead && new Date(n.createdAt) > lastCheck
    );

    if (newNotifications.length > 0) {
      // Trigger local OS notifications for new unread entries
      for (const notification of newNotifications) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title || "New Booking",
            body: notification.message || "A new booking has been confirmed.",
            data: notification.data || {},
          },
          trigger: null, // immediate
        });
      }

      // Update last checked timestamp to the newest notification's date
      const newestDate = newNotifications.reduce((latest, current) => {
        const currentDate = new Date(current.createdAt);
        return currentDate > latest ? currentDate : latest;
      }, lastCheck);

      await AsyncStorage.setItem("LAST_NOTIFICATION_CHECK", newestDate.toISOString());
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("Error in background notification task:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// Helper to register background task
export async function registerBackgroundNotificationTask() {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
    if (!isRegistered) {
      // Request local notification permissions on register
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permissions not granted");
      }

      await BackgroundTask.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        minimumInterval: 15, // 15 minutes (OS minimum)
      });
      console.log("Background Notification Task registered successfully");
    }
  } catch (err) {
    console.error("Failed to register Background Notification Task:", err);
  }
}

// Helper to unregister background task
export async function unregisterBackgroundNotificationTask() {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
    if (isRegistered) {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      console.log("Background Notification Task unregistered successfully");
    }
  } catch (err) {
    console.error("Failed to unregister Background Notification Task:", err);
  }
}
