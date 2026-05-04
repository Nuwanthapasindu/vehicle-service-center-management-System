import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Phone, MapPin, Car, AlertCircle } from "lucide-react-native";

import colors from "../../../../constants/colors";
import { userService } from "../../../../services/user/user.service";
import VehicleExpandableCard from "../../../../components/customers/VehicleExpandableCard";

const { width } = Dimensions.get("window");

export default function CustomerDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await userService.getCustomerDetails(id);
      setDetails(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch details",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (vId) => {
    setExpandedVehicleId(expandedVehicleId === vId ? null : vId);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  if (!details || !details.user) {
    return (
      <View style={[styles.container, styles.center]}>
        <AlertCircle size={48} color="#D1D5DB" />
        <Text style={styles.emptyText}>Customer not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { user, vehicles, bookings, jobCards } = details;

  return (
    <View style={styles.container}>
      {/* HEADER HERO */}
      <View style={styles.headerHero}>
        <View style={styles.heroProfileRow}>
          <View style={styles.heroAvatarBox}>
            <Text style={styles.heroAvatarText}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.heroInfoCol}>
            <Text style={styles.heroName}>{user.name}</Text>
            <View style={styles.heroDetailRow}>
              <Phone size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroDetailText}>{user.mobile}</Text>
            </View>
            {user.address && (
              <View style={styles.heroDetailRow}>
                <MapPin size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroDetailText}>{user.address}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionHeader}>
          <Car size={20} color={colors.DARK} />
          <Text style={styles.sectionTitle}>Customer Vehicles ({vehicles?.length || 0})</Text>
        </View>
        
        {vehicles?.length > 0 ? (
          <View style={styles.cardsWrapper}>
            {vehicles.map((v) => {
              const vehicleBookings = bookings.filter(b => b.vehicle?._id === v._id || b.vehicle === v._id);
              
              // Find max mileage
              let maxMileage = 0;
              const vehicleJobCards = [];
              vehicleBookings.forEach(b => {
                const jc = jobCards.find(j => j.booking?._id === b._id || j.booking === b._id);
                if (jc) {
                  vehicleJobCards.push({ booking: b, jobCard: jc });
                  if (jc.milageCount > maxMileage) maxMileage = jc.milageCount;
                } else {
                  vehicleJobCards.push({ booking: b, jobCard: null });
                }
              });

              const isExpanded = expandedVehicleId === v._id;

              return (
                <VehicleExpandableCard
                  key={v._id}
                  vehicle={v}
                  vehicleJobCards={vehicleJobCards}
                  maxMileage={maxMileage}
                  isExpanded={expandedVehicleId === v._id}
                  onToggle={toggleExpand}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyBoxText}>No saved vehicles.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerHero: {
    backgroundColor: colors.PRIMARY,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10,
  },
  heroProfileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroAvatarBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroAvatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.PRIMARY,
  },
  heroInfoCol: {
    flex: 1,
  },
  heroName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  heroDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  heroDetailText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    letterSpacing: -0.5,
  },
  cardsWrapper: {
    gap: 12,
    marginBottom: 24,
  },
  emptyBox: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  emptyBoxText: {
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "500",
  },
  emptyText: {
    color: colors.SECONDARY,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  backBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.PRIMARY,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
