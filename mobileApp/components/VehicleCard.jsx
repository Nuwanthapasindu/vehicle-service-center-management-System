import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Car, User } from "lucide-react-native";
import colors from "../constants/colors";
import getImageFullUrl from "../utils/getImageFullUrl";

export default function VehicleCard({ vehicle }) {
  const imageUrl = vehicle.image?.filePath
    ? getImageFullUrl(vehicle.image.filePath)
    : null;

  const isDeleted = vehicle.isDeleted || vehicle.licensePlate?.includes("-deleted-");
  const displayPlate = vehicle.licensePlate?.split("-deleted-")[0] || vehicle.licensePlate;

  return (
    <View style={styles.card}>
      {/* Top Section: Large Square-ish Image */}
      <View style={styles.imageWrapper}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.vehicleImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Car size={48} color={colors.SECONDARY} />
          </View>
        )}
      </View>

      {/* Bottom Section: Details Grid */}
      <View style={styles.detailsContainer}>
        {/* Title, Type and Year Row */}
        <View style={styles.titleRow}>
          <Text style={styles.vehicleTitle} numberOfLines={1}>
            {vehicle.make} {vehicle.model}
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              {vehicle.type} • {vehicle.year}
            </Text>
          </View>
        </View>

        {/* License Plate Row */}
        <View style={styles.plateRow}>
          <View style={styles.plateContainer}>
            <Text style={styles.plateLabel}>LK</Text>
            <Text style={styles.plateNumber} numberOfLines={1}>
              {displayPlate}
            </Text>
          </View>

          {isDeleted && (
            <View style={styles.deletedBadge}>
              <View style={styles.neonDotOuter}>
                <View style={styles.neonDotInner} />
              </View>
              <Text style={styles.deletedText}>DELETED</Text>
            </View>
          )}
        </View>

        {/* Separator */}
        <View style={styles.divider} />

        {/* Owner Info (Full Width) */}
        <View style={styles.ownerContainer}>
          <View style={styles.avatarBox}>
            <User size={16} color={colors.PRIMARY} />
          </View>
          <View style={styles.ownerTextContainer}>
            <Text style={styles.ownerLabel}>Registered Owner</Text>
            {vehicle.ownerId ? (
              <Text style={styles.ownerName} numberOfLines={1}>
                {vehicle.ownerId.name} •{" "}
                <Text style={styles.ownerMobile}>{vehicle.ownerId.mobile}</Text>
              </Text>
            ) : (
              <Text style={styles.ownerName}>No Owner Registered</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    width: "100%", // Full width
  },
  imageWrapper: {
    width: "100%",
    height: 180, // Taller image wrapper for a square-ish block aesthetic
    backgroundColor: "#F1F5F9",
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
  },
  detailsContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    flex: 1,
    marginRight: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "850",
    color: colors.SECONDARY,
    textTransform: "uppercase",
  },
  plateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  plateLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.SECONDARY,
    marginRight: 8,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    paddingRight: 8,
  },
  plateNumber: {
    fontSize: 14,
    fontWeight: "850",
    color: colors.DARK,
    letterSpacing: 0.5,
  },
  deletedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 49, 49, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 49, 49, 0.25)",
  },
  neonDotOuter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 49, 49, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  neonDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF3131",
  },
  deletedText: {
    color: "#FF3131",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
    marginVertical: 14,
    opacity: 0.8,
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4FADE", // Soft green matching colors.PRIMARY hue
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ownerTextContainer: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.SECONDARY,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 13,
    fontWeight: "750",
    color: colors.DARK,
  },
  ownerMobile: {
    color: colors.SECONDARY,
    fontWeight: "600",
  },
});
