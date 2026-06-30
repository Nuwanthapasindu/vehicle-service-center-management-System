import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import storageKeys from "../constants/storageKeys";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: setNotificationHandler MUST be called at the top-level module
// scope (not inside a component or useEffect) so it is registered before
// any notification arrives — even when the app is launched from a cold start
// by the background task executor.
// ─────────────────────────────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,  // iOS 14+
    shouldShowList: true,    // iOS 14+
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Create an Android notification channel so notifications actually appear
// when the app is in the background / killed.
// This is a no-op on iOS.
// ─────────────────────────────────────────────────────────────────────────────
export async function setupAndroidNotificationChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default Notifications",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
    enableVibrate: true,
    showBadge: true,
    sound: "default",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Background Task Definition
// defineTask MUST be called at the top-level module scope — NOT inside a
// component, hook, or effect — so the task is available when Android wakes
// the JS runtime in the background (the app is NOT open at that point).
// ─────────────────────────────────────────────────────────────────────────────
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  try {
    const token = await SecureStore.getItemAsync(
      storageKeys.PERSONAL_ACCESS_TOKEN
    );
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

    // If auth expired, clean tokens and stop polling
    if (response.status === 401 || response.status === 403) {
      console.warn(
        "Background notification task: unauthorized. Cleaning up tokens."
      );
      try {
        await SecureStore.deleteItemAsync(storageKeys.PERSONAL_ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(storageKeys.REFRESH_TOKEN);
      } catch (err) {
        console.error("Failed to delete tokens in background task:", err);
      }
      try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(
          BACKGROUND_NOTIFICATION_TASK
        );
        if (isRegistered) {
          await BackgroundTask.unregisterTaskAsync(
            BACKGROUND_NOTIFICATION_TASK
          );
        }
      } catch (err) {
        console.error(
          "Failed to unregister background task during auth cleanup:",
          err
        );
      }
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

    // Filter: unread AND newer than last check
    const newNotifications = notifications.filter(
      (n) => !n.isRead && new Date(n.createdAt) > lastCheck
    );

    if (newNotifications.length > 0) {
      // Fire one OS-level notification per new unread entry
      for (const notification of newNotifications) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title || "New Booking",
            body: notification.message || "A new booking has been confirmed.",
            data: notification.data || {},
            // Specify the channel created above — required for Android 8+
            ...(Platform.OS === "android" && { channelId: "default" }),
            sound: "default",
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null, // fire immediately
        });
      }

      // Advance the watermark to the newest notification date
      const newestDate = newNotifications.reduce((latest, current) => {
        const currentDate = new Date(current.createdAt);
        return currentDate > latest ? currentDate : latest;
      }, lastCheck);

      await AsyncStorage.setItem(
        "LAST_NOTIFICATION_CHECK",
        newestDate.toISOString()
      );
    }

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("Error in background notification task:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Register the background task (call after user logs in as ADMIN)
// ─────────────────────────────────────────────────────────────────────────────
export async function registerBackgroundNotificationTask() {
  try {
    // Ensure the Android notification channel exists before scheduling
    await setupAndroidNotificationChannel();

    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("Notification permissions not granted");
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_NOTIFICATION_TASK
    );
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        minimumInterval: 15 * 60, // 15 minutes in seconds (OS enforced minimum)
      });
      console.log("Background Notification Task registered successfully");
    }
  } catch (err) {
    console.error("Failed to register Background Notification Task:", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Unregister the background task (call on logout)
// ─────────────────────────────────────────────────────────────────────────────
export async function unregisterBackgroundNotificationTask() {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_NOTIFICATION_TASK
    );
    if (isRegistered) {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      console.log("Background Notification Task unregistered successfully");
    }
  } catch (err) {
    console.error("Failed to unregister Background Notification Task:", err);
  }
}
