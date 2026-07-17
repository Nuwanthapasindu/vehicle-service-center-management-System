import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import {
  Car,
  User,
  Phone,
  MapPin,
  Calendar,
  Activity,
  AlertCircle,
  Wrench,
  DollarSign,
  ClipboardList
} from "lucide-react-native";

import colors from "../../../../constants/colors";
import { vehicleService } from "../../../../services/vehicle/vehicle.service";
import getImageFullUrl from "../../../../utils/getImageFullUrl";
import formatPrice from "../../../../utils/formatPrice";

const { width } = Dimensions.get("window");

export default function VehicleDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDetails = async (isRef = false) => {
    if (!isRef) setLoading(true);
    try {
      const data = await vehicleService.getVehicleDetailsAdmin(id);
      setDetails(data);
     } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch vehicle details",
      });
      router.back();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDetails(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  if (!details || !details.vehicle) {
    return (
      <View style={[styles.container, styles.center]}>
        <AlertCircle size={48} color="#D1D5DB" />
        <Text style={styles.emptyText}>Vehicle details not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { vehicle, totalExpenditure, serviceHistory = [], nextServiceDate, nextServiceMileage } = details;
  const isDeleted = vehicle.isDeleted || vehicle.licensePlate?.includes("-deleted-");
  const displayPlate = vehicle.licensePlate?.split("-deleted-")[0] || vehicle.licensePlate;

  const imageUrl = vehicle.image?.filePath
    ? getImageFullUrl(vehicle.image.filePath)
    : null;

  const latestMileage = serviceHistory.length > 0 ? serviceHistory[0].milageCount : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PRIMARY]} />
        }
      >
        {/* HERO IMAGE BANNER */}
        <View style={styles.imageHeroWrapper}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.heroImage} />
          ) : (
            <View style={styles.placeholderHeroImage}>
              <Car size={64} color={colors.SECONDARY} />
            </View>
          )}
          {isDeleted && (
            <View style={styles.heroDeletedBadge}>
              <View style={styles.neonDotOuter}>
                <View style={styles.neonDotInner} />
              </View>
              <Text style={styles.deletedText}>DELETED</Text>
            </View>
          )}
        </View>

        {/* DETAILS BODY */}
        <View style={styles.bodyContent}>
          {/* VEHICLE TITLE AND SPECS */}
          <View style={styles.titleCard}>
            <View style={styles.titleRow}>
              <Text style={styles.vehicleTitle} numberOfLines={2}>
                {vehicle.make} {vehicle.model}
              </Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {vehicle.type} • {vehicle.year}
                </Text>
              </View>
            </View>

            <View style={styles.plateRow}>
              <View style={styles.plateContainer}>
                <Text style={styles.plateNumber}>{displayPlate}</Text>
              </View>
            </View>
          </View>

          {/* STATS ROW GRID */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: "#E6F7FF" }]}>
                <Wrench size={18} color="#1890FF" />
              </View>
              <Text style={styles.statValue}>{serviceHistory.length}</Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: "#FFF7E6" }]}>
                <Activity size={18} color="#FA8C16" />
              </View>
              <Text style={styles.statValue} numberOfLines={1}>
                {latestMileage.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Last km</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: "#F4FADE" }]}>
                <DollarSign size={18} color={colors.PRIMARY} />
              </View>
              <Text style={styles.statValue} numberOfLines={1}>
                {totalExpenditure > 100000 
                  ? `${(totalExpenditure / 1000).toFixed(0)}k`
                  : totalExpenditure.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>

          {/* REGISTERED OWNER */}
          <Text style={styles.sectionHeader}>Registered Owner</Text>
          <View style={styles.ownerCard}>
            {vehicle.ownerId ? (
              <View style={styles.ownerRow}>
                <View style={styles.ownerAvatarBox}>
                  <User size={24} color={colors.PRIMARY} />
                </View>
                <View style={styles.ownerInfoCol}>
                  <Text style={styles.ownerName} numberOfLines={1}>
                    {vehicle.ownerId.name}
                  </Text>
                  
                  <View style={styles.ownerDetailRow}>
                    <Phone size={14} color={colors.SECONDARY} />
                    <Text style={styles.ownerDetailText} numberOfLines={1}>
                      {vehicle.ownerId.mobile}
                    </Text>
                  </View>

                  {vehicle.ownerId.address && (
                    <View style={styles.ownerDetailRow}>
                      <MapPin size={14} color={colors.SECONDARY} />
                      <Text style={styles.ownerDetailText} numberOfLines={2}>
                        {vehicle.ownerId.address}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.noOwnerContainer}>
                <AlertCircle size={20} color={colors.SECONDARY} />
                <Text style={styles.noOwnerText}>No owner registered for this vehicle.</Text>
              </View>
            )}
          </View>

          {/* NEXT SERVICE INFO */}
          {(nextServiceDate || nextServiceMileage) && (
            <>
              <Text style={styles.sectionHeader}>Next Service Details</Text>
              <View style={styles.ownerCard}>
                {nextServiceDate && (
                  <View style={[styles.ownerDetailRow, { marginBottom: nextServiceMileage ? 8 : 0 }]}>
                    <Calendar size={16} color={colors.PRIMARY} />
                    <Text style={[styles.ownerDetailText, { fontSize: 16, marginLeft: 8, color: colors.DARK }]}>
                      Date: {new Date(nextServiceDate).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                {nextServiceMileage && (
                  <View style={styles.ownerDetailRow}>
                    <Activity size={16} color={colors.PRIMARY} />
                    <Text style={[styles.ownerDetailText, { fontSize: 16, marginLeft: 8, color: colors.DARK }]}>
                      Mileage: {nextServiceMileage?.toLocaleString()} km
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {/* SERVICE HISTORY TIMELINE */}
          <Text style={styles.sectionHeader}>Service History ({serviceHistory.length})</Text>
          {serviceHistory.length > 0 ? (
            <View style={styles.timelineContainer}>
              {serviceHistory.map((item, index) => {
                const isLastItem = index === serviceHistory.length - 1;
                return (
                  <View key={item.jobCardId || index} style={styles.timelineItem}>
                    {/* LEFT TRACK */}
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineDot}>
                        <View style={styles.timelineDotInner} />
                      </View>
                      {!isLastItem && <View style={styles.timelineLine} />}
                    </View>

                    {/* RIGHT CARD */}
                    <View style={styles.timelineCard}>
                      <View style={styles.timelineCardHeader}>
                        <Text style={styles.invoiceText}>
                          {item.invoiceId ? `#${item.invoiceId}` : "Job Log"}
                        </Text>
                        <View style={styles.dateRow}>
                          <Calendar size={12} color={colors.SECONDARY} style={{ marginRight: 4 }} />
                          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                        </View>
                      </View>

                      <Text style={styles.packageNameText}>{item.packageName}</Text>
                      {item.packageDescription ? (
                        <Text style={styles.packageDescText} numberOfLines={2}>
                          {item.packageDescription}
                        </Text>
                      ) : null}

                      {/* STATS ROW */}
                      <View style={styles.historyStatsRow}>
                        <View style={styles.historyStatItem}>
                          <Text style={styles.historyStatLabel}>Mileage</Text>
                          <Text style={styles.historyStatVal}>{item.milageCount.toLocaleString()} km</Text>
                        </View>
                        <View style={styles.historyStatItem}>
                          <Text style={styles.historyStatLabel}>Cost</Text>
                          <Text style={styles.historyStatVal}>{formatPrice(item.cost, "LKR")}</Text>
                        </View>
                      </View>

                      {/* INCLUDED SERVICES PILLS */}
                      {item.services && item.services.length > 0 && (
                        <View style={styles.servicesWrapper}>
                          <Text style={styles.servicesTitle}>Services Included</Text>
                          <View style={styles.servicesTagsContainer}>
                            {item.services.map((s, sIdx) => (
                              <View key={sIdx} style={styles.serviceTag}>
                                <Text style={styles.serviceTagText}>{s.name}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyHistoryBox}>
              <ClipboardList size={36} color="#CBD5E1" />
              <Text style={styles.emptyHistoryText}>No service history records found.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageHeroWrapper: {
    width: "100%",
    height: 220,
    backgroundColor: "#E2E8F0",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderHeroImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
  },
  heroDeletedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 49, 49, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  neonDotOuter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  neonDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  deletedText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  bodyContent: {
    padding: 20,
  },
  titleCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 20,
    padding: 20,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  vehicleTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.DARK,
    flex: 1,
  },
  typeBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.SECONDARY,
    textTransform: "uppercase",
  },
  plateRow: {
    marginTop: 14,
  },
  plateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignSelf: "flex-start",
  },
  plateLabel: {
    fontSize: 11,
    fontWeight: "950",
    color: colors.SECONDARY,
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    paddingRight: 10,
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.DARK,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.DARK,
  },
  statLabel: {
    fontSize: 10,
    color: colors.SECONDARY,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  ownerCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  ownerAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F4FADE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  ownerInfoCol: {
    flex: 1,
    gap: 6,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "750",
    color: colors.DARK,
  },
  ownerDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ownerDetailText: {
    fontSize: 13,
    color: colors.SECONDARY,
    fontWeight: "600",
    flex: 1,
  },
  noOwnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  noOwnerText: {
    fontSize: 13,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: "center",
    width: 24,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(142, 219, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    marginTop: 4,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.PRIMARY,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  timelineCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  invoiceText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.PRIMARY,
    textTransform: "uppercase",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 11,
    color: colors.SECONDARY,
    fontWeight: "700",
  },
  packageNameText: {
    fontSize: 15,
    fontWeight: "750",
    color: colors.DARK,
  },
  packageDescText: {
    fontSize: 12,
    color: colors.SECONDARY,
    marginTop: 4,
    lineHeight: 16,
  },
  historyStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  historyStatItem: {
    flex: 1,
  },
  historyStatLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.SECONDARY,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  historyStatVal: {
    fontSize: 12,
    fontWeight: "750",
    color: colors.DARK,
  },
  servicesWrapper: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
  },
  servicesTitle: {
    fontSize: 10,
    fontWeight: "850",
    color: colors.SECONDARY,
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  servicesTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  serviceTag: {
    backgroundColor: "rgba(142, 219, 0, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(142, 219, 0, 0.2)",
  },
  serviceTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#72B000",
  },
  emptyHistoryBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    gap: 12,
  },
  emptyHistoryText: {
    fontSize: 13,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  emptyText: {
    color: colors.SECONDARY,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
  },
  backBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.PRIMARY,
    borderRadius: 10,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
