import React, { createContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Vibration, DeviceEventEmitter } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export const SocketContext = createContext(null);

const getSocketUrl = (apiUrl) => {
  if (!apiUrl) return "";
  const url = apiUrl.replace(/\/$/, "");
  return url.replace(/\/api\/v1$/, "");
};

export default function SocketProvider({ children }) {
  const { accessToken, user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (accessToken && user && user.role === "ADMIN") {
      const socketUrl = getSocketUrl(process.env.EXPO_PUBLIC_API_URL);
      if (!socketUrl) return;

      // Initialize Socket connection
      const socket = io(socketUrl, {
        auth: {
          token: `Bearer ${accessToken}`,
        },
        transports: ["websocket"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket connected successfully");
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
      });

      socket.on("newNotification", (notification) => {
        // Trigger haptic vibration
        Vibration.vibrate(500);

        // Emit local refresh event for UI update
        DeviceEventEmitter.emit("REFRESH_NOTIFICATIONS");

        // Display in-app push toast banner
        Toast.show({
          type: "info",
          text1: notification.title || "New Notification",
          text2: notification.message || "You have a new message",
          visibilityTime: 6000,
          autoHide: true,
          onPress: () => {
            router.push("/(protected)/(admin)/booking");
            Toast.hide();
          },
        });
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
        socketRef.current = null;
      };
    }
  }, [accessToken, user, router]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}
