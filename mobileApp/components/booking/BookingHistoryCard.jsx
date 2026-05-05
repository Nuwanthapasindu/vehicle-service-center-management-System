import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import getImageFullUrl from "../../utils/getImageFullUrl";
import FALLBACK_IMG from "../../assets/default-car.png";

export default function BookingHistoryCard({ item, onPress }) {
  const [imgError, setImgError] = useState(false);

  const imagePath = item.vehicleImage;
  const imgSource = imagePath ? { uri: getImageFullUrl(imagePath) } : FALLBACK_IMG;

  return (
    <View style={styles.historyCard}>
      <View style={styles.historyCardHeader}>
        <Text style={styles.historyDate}>{new Date(item.date).toISOString().split("T")[0]}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.jobStatus === "FINISH" ? "#D1FAE5" : "#FEF3C7" }]}>
          <Text style={[styles.statusText, { color: item.jobStatus === "FINISH" ? "#059669" : "#D97706" }]}>{item.jobStatus}</Text>
        </View>
      </View>
      
      <View style={styles.historyCardBody}>
        <View style={styles.historyInfoCol}>
          <Text style={styles.historyVehicleName}>{item.vehicle}</Text>
          <Text style={styles.historyVehiclePlate}>{item.licensePlate}</Text>
          
          <View style={styles.historyRow}>
            <Ionicons name="person-outline" size={16} color={colors.SECONDARY} />
            <Text style={styles.historyDetailText}>{item.customer} ({item.customerMobile})</Text>
          </View>
          <View style={styles.historyRow}>
            <Ionicons name="build-outline" size={16} color={colors.SECONDARY} />
            <Text style={styles.historyDetailText}>{item.service}</Text>
          </View>
        </View>

        <Image
          source={imgError ? FALLBACK_IMG : imgSource}
          style={styles.vehicleImage}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      </View>

      <TouchableOpacity style={styles.historyActionBtn} onPress={onPress}>
        <Text style={styles.historyActionText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.DARK} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  historyCard: { backgroundColor: colors.LIGHT, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.BORDER_COLOR, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  historyCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.BORDER_COLOR, paddingBottom: 12 },
  historyDate: { fontSize: 14, fontWeight: "800", color: colors.DARK },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "800" },
  historyCardBody: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  historyInfoCol: { flex: 1, paddingRight: 12 },
  historyVehicleName: { fontSize: 18, fontWeight: "800", color: colors.DARK, marginBottom: 2 },
  historyVehiclePlate: { fontSize: 13, color: colors.SECONDARY, fontWeight: "600", marginBottom: 12 },
  historyRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  historyDetailText: { fontSize: 13, color: colors.SECONDARY, marginLeft: 8, fontWeight: "500" },
  vehicleImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: colors.BORDER_COLOR },
  historyActionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#F0FBB0", paddingVertical: 12, borderRadius: 12, gap: 4 },
  historyActionText: { fontSize: 14, fontWeight: "800", color: colors.DARK }
});
