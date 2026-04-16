import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, ActivityIndicator, Modal, FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import colors from "../../../../constants/colors";
import getImageFullUrl from "../../../../utils/getImageFullUrl";
import getStatusColor from "../../../../utils/getStatusColor";
import DropdownInput from "../../../../components/DropdownInput";
import Toast from "react-native-toast-message";
import enums from "../../../../constants/enums";

const { width, height } = Dimensions.get("window");

export default function BookingDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [assignedTeam, setAssignedTeam] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Dropdown States
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [statusZone, setStatusZone] = useState("PENDING");

  const FALLBACK_IMG = require("../../../../assets/default-car.png");
  const STATUSES = Object.values(enums.JOBCARD_STATUS);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setData(null);
    setSelectedPackage(null);
    setSelectedTier(null);
    setAssignedTeam(null);
    setImgError(false);

    try {
      // Fetch Booking Details and Packages in parallel to reconcile them
      const [bookingResponse, pkgResponse] = await Promise.all([
        axios.get(`/booking/admin/${id}/details`),
        axios.get(`/job-cards/packages`)
      ]);

      const details = bookingResponse.data.payload.data;
      const allPackages = pkgResponse.data.payload.data || [];

      setData(details);
      setPackages(allPackages);

      if (details.assignedTeam) setAssignedTeam(details.assignedTeam);

      // Hydrate selections using the full packages list to ensure pricingTiers are available
      if (details.service && details.service.package) {
        const fullPkg = allPackages.find(p => p.name === details.service.package);
        if (fullPkg) {
          setSelectedPackage(fullPkg);
          if (details.service.pricingTier) {
            const fullTier = fullPkg.pricingTiers?.find(t => t.tierName === details.service.pricingTier);
            if (fullTier) {
              setSelectedTier(fullTier);
            }
          }
        } else {
          // Fallback if full package info is not found
          setSelectedPackage({ name: details.service.package });
        }
        setStatusZone(details.service.statusZone || "PENDING");
      }

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch booking details",
      });
      router.push("/(protected)/(admin)/booking");
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: colors.SECONDARY }}>Booking not found.</Text>
        <TouchableOpacity onPress={() => router.push("/(protected)/(admin)/booking")} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.PRIMARY, fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const imagePath = typeof data.vehicle.image === 'object' ? data.vehicle.image?.filePath : data.vehicle.image;
  const imgSource = imagePath ? { uri: getImageFullUrl(imagePath) } : FALLBACK_IMG;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(protected)/(admin)/booking")}>
          <Ionicons name="chevron-back" size={28} color={colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Schedule Info */}
        <View style={styles.section}>
          <Text style={styles.subtext}>SCHEDULED FOR</Text>
          <Text style={styles.dateText}>{data.date}</Text>
          <View style={styles.timeBadgeRow}>
            <Ionicons name="time-outline" size={16} color={colors.SECONDARY} />
            <Text style={styles.timeText}>{data.time || "Unknown"}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusZone === 'PENDING' ? "#FEF3C7" : "#E0F2FE" }]}>
            <View style={[styles.dot, { backgroundColor: getStatusColor(statusZone) }]} />
            <Text style={[styles.statusBadgeText, { color: getStatusColor(statusZone) }]}>{statusZone}</Text>
          </View>
        </View>

        {/* Customer & Vehicle Card */}
        <View style={styles.card}>
          <View style={styles.customerRow}>
            <View>
              <Text style={styles.customerName}>{data.customer.name || "Unknown Customer"}</Text>
              <View style={styles.vehicleInfoRow}>
                <Ionicons name="car-outline" size={14} color={colors.SECONDARY} />
                <Text style={styles.vehicleInfoText}>
                  {data.vehicle.name || "Unknown Vehicle"} • {data.vehicle.plate || "Unknown"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call-outline" size={20} color={colors.DARK} />
            </TouchableOpacity>
          </View>
          <Image
            source={imgError ? FALLBACK_IMG : imgSource}
            style={styles.vehicleImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        </View>

        {/* Service Details */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="build-outline" size={16} color={colors.SECONDARY} />
          <Text style={styles.sectionHeaderText}>SERVICE DETAILS</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Assign Package / Service</Text>
          <DropdownInput
            value={selectedPackage ? selectedPackage.name : null}
            options={packages.map(p => p.name)}
            placeholder="Pending Selection"
            modalTitle="Assign Package"
            onSelect={(name) => {
              const pkg = packages.find(p => p.name === name);
              setSelectedPackage(pkg);
              setSelectedTier(null);
            }}
          />

          <Text style={styles.label}>Select Pricing tier</Text>
          <DropdownInput
            value={selectedTier ? (selectedTier.price !== undefined ? `${selectedTier.tierName} - LKR ${selectedTier.price}` : selectedTier.tierName) : null}
            options={selectedPackage && selectedPackage.pricingTiers ? selectedPackage.pricingTiers.map(t => `${t.tierName} - LKR ${t.price}`) : []}
            placeholder="Pending Selection"
            modalTitle="Select Pricing tier"
            onSelect={(str) => {
              if (selectedPackage && selectedPackage.pricingTiers) {
                const tr = selectedPackage.pricingTiers.find(t => `${t.tierName} - LKR ${t.price}` === str);
                if (tr) setSelectedTier(tr);
              }
            }}
          />

          <Text style={styles.label}>Status Zone</Text>
          <DropdownInput
            value={statusZone}
            options={STATUSES}
            placeholder="Select Status"
            modalTitle="Select Status"
            onSelect={(s) => setStatusZone(s)}
          />
        </View>

        {/* Team Assignment */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="people-outline" size={16} color={colors.SECONDARY} />
          <Text style={styles.sectionHeaderText}>TEAM ASSIGNMENT</Text>
        </View>

        <View style={styles.teamList}>
          {data.teams.map((team) => {
            const teamStatus = team.status || "Available Now";
            const teamColor = team.statusColor || "#8EDB00";
            const isAssigned = assignedTeam === team.id;
            const isBusy = teamColor === "#EF4444";

            return (
              <View key={team.id} style={styles.teamCard}>
                <View style={styles.teamInfo}>
                  <View style={styles.teamAvatar}>
                    <Text style={styles.teamAvatarText}>
                      {team.name.split(" ").map(w => w.charAt(0)).join("").substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <View style={styles.teamStatusRow}>
                      <View style={[styles.dot, { backgroundColor: teamColor }]} />
                      <Text style={styles.teamStatusText}>{teamStatus}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.assignButton,
                    isAssigned && styles.assignedButton,
                    isBusy && styles.disabledButton
                  ]}
                  disabled={isBusy}
                  onPress={() => isAssigned ? setAssignedTeam(null) : setAssignedTeam(team.id)}
                >
                  <Text style={[
                    styles.assignButtonText,
                    isBusy && styles.disabledButtonText,
                    isAssigned && styles.assignedButtonText
                  ]}>
                    {isAssigned ? "Assigned" : "Assign"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>SAVE</Text>
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.DARK} style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.invoiceButton}>
          <Ionicons name="receipt-outline" size={20} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.invoiceButtonText}>View / Manage Invoice</Text>
        </TouchableOpacity>
      </View>



    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    flex: 1,
    textAlign: "right",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  subtext: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.DARK,
    marginBottom: 8,
  },
  timeBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.SECONDARY,
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  customerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 4,
  },
  vehicleInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleInfoText: {
    fontSize: 13,
    color: colors.SECONDARY,
    marginLeft: 4,
    fontWeight: "500",
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FBB0",
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.BORDER_COLOR // added background color so it doesn't look completely invisible while loading
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginLeft: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 6,
    marginTop: 10,
  },
  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: colors.DARK,
  },
  teamList: {
    gap: 12,
    paddingBottom: 20,
  },
  teamCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.DARK, // Changed to dark for contrast
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  teamAvatarText: {
    color: "#FFF",
    fontSize: 15, // reduced size slightly to fit 2 characters better
    fontWeight: "800",
  },
  teamName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 2,
  },
  teamStatusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamStatusText: {
    fontSize: 12,
    color: colors.SECONDARY,
  },
  assignButton: {
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignedButton: {
    backgroundColor: colors.DARK,
  },
  assignedButtonText: {
    color: "#FFF",
  },
  disabledButton: {
    backgroundColor: "#F3F4F6",
  },
  assignButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.DARK,
  },
  disabledButtonText: {
    color: colors.SECONDARY,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
    gap: 12,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
  },
  invoiceButton: {
    flexDirection: "row",
    backgroundColor: colors.DARK,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  invoiceButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.BACKGROUND_COLOR,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
    paddingBottom: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: colors.BORDER_COLOR,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  dropdownOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: colors.DARK,
    fontWeight: '600'
  }
});
