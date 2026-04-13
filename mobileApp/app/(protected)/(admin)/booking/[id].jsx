import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, ActivityIndicator, Modal, FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import axios from "axios";
import colors from "../../../../constants/colors";
import getImageFullUrl from "../../../../utils/getImageFullUrl";
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
  const [statusZone, setStatusZone] = useState(enums.JOBCARD_STATUS.PENDING);

  const [activeDropdown, setActiveDropdown] = useState(null); // 'package' | 'tier' | 'status'

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
      // Fetch Booking Details
      const response = await axios.get(`/booking/admin/${id}/details`);
      const details = response.data.payload.data;
      setData(details);

      if (details.assignedTeam) setAssignedTeam(details.assignedTeam);

      // Fetch Packages List for Dropdown
      const pkgResponse = await axios.get(`/job-cards/packages`);
      const fetchedPackages = pkgResponse.data.payload.data || [];
      setPackages(fetchedPackages);

      // If backend has existing service data
      if (details.service && details.service.package) {
        const matchedPackage = fetchedPackages.find(p => p.name === details.service.package) || { name: details.service.package };
        setSelectedPackage(matchedPackage);

        if (details.service.pricingTier) {
          const matchedTier = matchedPackage.pricingTiers?.find(t => t.tierName === details.service.pricingTier) || { tierName: details.service.pricingTier };
          setSelectedTier(matchedTier);
        }
        setStatusZone(details.service.statusZone || enums.JOBCARD_STATUS.PENDING);
      }

    } catch (error) {
      console.error("Error fetching admin booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case enums.JOBCARD_STATUS.PENDING: return '#F59E0B'; // Orange
      case enums.JOBCARD_STATUS.START: return '#3B82F6'; // Blue
      case enums.JOBCARD_STATUS.FINISH: return '#10B981'; // Green
      default: return '#F59E0B';
    }
  };

  const openDropdown = (type) => {
    setActiveDropdown(type);
  };

  const closeDropdown = () => setActiveDropdown(null);

  const handleSelect = (item) => {
    if (activeDropdown === 'package') {
      setSelectedPackage(item);
      setSelectedTier(null); // reset tier when package changes
    } else if (activeDropdown === 'tier') {
      setSelectedTier(item);
    } else if (activeDropdown === 'status') {
      setStatusZone(item);
    }
    closeDropdown();
  };

  // Render Modal List Items based on what's active
  const renderDropdownItems = () => {
    if (activeDropdown === 'package') {
      return packages.map((pkg, idx) => (
        <TouchableOpacity key={idx} style={styles.dropdownOption} onPress={() => handleSelect(pkg)}>
          <Text style={styles.dropdownOptionText}>{pkg.name}</Text>
        </TouchableOpacity>
      ));
    } else if (activeDropdown === 'tier') {
      if (!selectedPackage || !selectedPackage.pricingTiers) {
        return <Text style={{ padding: 20, textAlign: 'center', color: colors.SECONDARY }}>Select a package first</Text>;
      }
      return selectedPackage.pricingTiers.map((tier, idx) => (
        <TouchableOpacity key={idx} style={styles.dropdownOption} onPress={() => handleSelect(tier)}>
          <Text style={styles.dropdownOptionText}>{tier.tierName} - LKR {tier.price}</Text>
        </TouchableOpacity>
      ));
    } else if (activeDropdown === 'status') {
      return STATUSES.map((status, idx) => (
        <TouchableOpacity key={idx} style={styles.dropdownOption} onPress={() => handleSelect(status)}>
          <Text style={[styles.dropdownOptionText, { color: getStatusColor(status), fontWeight: 'bold' }]}>{status}</Text>
        </TouchableOpacity>
      ));
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

  const imgSource = data.vehicle.image ? { uri: getImageFullUrl(data.vehicle.image) } : FALLBACK_IMG;

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen options={{ headerShown: false }} />

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
          <View style={[styles.statusBadge, { backgroundColor: statusZone === enums.JOBCARD_STATUS.PENDING ? "#FEF3C7" : "#E0F2FE" }]}>
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
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openDropdown('package')}>
            <Ionicons name="search-outline" size={18} color={colors.SECONDARY} style={styles.inputIcon} />
            <Text style={styles.inputText}>{selectedPackage ? selectedPackage.name : "Pending Selection"}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.SECONDARY} />
          </TouchableOpacity>

          <Text style={styles.label}>Select Pricing tier</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openDropdown('tier')}>
            <Ionicons name="search-outline" size={18} color={colors.SECONDARY} style={styles.inputIcon} />
            <Text style={styles.inputText}>{selectedTier ? selectedTier.tierName : "Pending Selection"}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.SECONDARY} />
          </TouchableOpacity>

          <Text style={styles.label}>Status Zone</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={() => openDropdown('status')}>
            <Text style={[styles.inputText, { color: getStatusColor(statusZone), fontWeight: "bold" }]}>{statusZone}</Text>
            <Ionicons name="chevron-expand" size={18} color={colors.SECONDARY} />
          </TouchableOpacity>
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

      {/* Dropdown Modal */}
      <Modal visible={activeDropdown !== null} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeDropdown}>
          <View style={styles.modalContainer}>
            <View style={styles.indicator} />
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
              {renderDropdownItems()}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

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
