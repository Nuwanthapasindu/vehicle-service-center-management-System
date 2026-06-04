import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Car } from "lucide-react-native";
import colors from "../../../../../constants/colors";
import VehicleExpandableCard from "../../../../../components/customers/VehicleExpandableCard";
import { useCustomerDetails } from "./_layout";

export default function CustomerVehiclesTab() {
  const { details } = useCustomerDetails();
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);

  const { vehicles, bookings, jobCards, invoices = [] } = details;

  const toggleExpand = (vId) => {
    setExpandedVehicleId(expandedVehicleId === vId ? null : vId);
  };

  return (
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
                const inv = invoices.find(i => i.jobCard?._id === jc._id || i.jobCard === jc._id || i.jobCard?.id === jc._id);
                vehicleJobCards.push({ booking: b, jobCard: jc, invoice: inv });
                if (jc.milageCount > maxMileage) maxMileage = jc.milageCount;
              } else {
                vehicleJobCards.push({ booking: b, jobCard: null, invoice: null });
              }
            });

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
  );
}

const styles = StyleSheet.create({
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
});
