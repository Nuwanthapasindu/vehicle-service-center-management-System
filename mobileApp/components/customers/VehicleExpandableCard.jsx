import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react-native';

import colors from '../../constants/colors';
import getImageFullUrl from '../../utils/getImageFullUrl';

export default function VehicleExpandableCard({ 
  vehicle, 
  vehicleJobCards = [], 
  maxMileage, 
  isExpanded, 
  onToggle 
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.vehicleCardWrapper}>
      <TouchableOpacity 
        style={styles.vehicleCard} 
        activeOpacity={0.8} 
        onPress={() => onToggle(vehicle._id)}
      >
        <View style={styles.vehicleCardTop}>
          {vehicle.image?.filePath && !imageError ? (
            <Image 
              source={{ uri: getImageFullUrl(vehicle.image.filePath) }} 
              style={styles.vehicleImage} 
              onError={() => setImageError(true)}
            />
          ) : (
            <Image 
              source={require('../../assets/default-car.png')} 
              style={styles.vehicleImage} 
            />
          )}
          
          <View style={styles.vehicleInfo}>
            <View style={styles.plateRow}>
              <View style={[styles.badge, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.badgeText, { color: '#0284C7' }]}>{vehicle.licensePlate}</Text>
              </View>
              {isExpanded ? <ChevronUp size={20} color="#9CA3AF" /> : <ChevronDown size={20} color="#9CA3AF" />}
            </View>
            <Text style={styles.vehicleTitle}>{vehicle.make} {vehicle.model}</Text>
            <Text style={styles.vehicleSubtitle}>Year: {vehicle.year} • Mileage: {maxMileage > 0 ? `${maxMileage} km` : 'N/A'}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedSection}>
          <Text style={styles.historyTitle}>Service History ({vehicleJobCards.length})</Text>
          {vehicleJobCards.length > 0 ? (
            vehicleJobCards.map(({ booking: b, jobCard: jc, invoice: inv }) => (
              <View key={b._id} style={styles.historyCard}>
                <View style={styles.historyHeaderRow}>
                  <View style={styles.dateRow}>
                    <Calendar size={14} color={colors.PRIMARY} />
                    <Text style={styles.dateText}>{new Date(inv?.date || b.date).toLocaleDateString()}</Text>
                  </View>
                  {jc && (
                    <View style={[styles.statusBadge, { backgroundColor: jc.status === 'FINISH' ? '#E8F5E9' : '#FFF3E0' }]}>
                      <Text style={[styles.statusText, { color: jc.status === 'FINISH' ? '#2E7D32' : '#E65100' }]}>
                        {jc.status}
                      </Text>
                    </View>
                  )}
                </View>
                {b.specialNote && <Text style={styles.historySubtitle}>Note: {b.specialNote}</Text>}
                {jc && jc.milageCount > 0 && <Text style={styles.historySubtitle}>Recorded Mileage: {jc.milageCount} km</Text>}
              </View>
            ))
          ) : (
            <Text style={styles.emptyHistoryText}>No service history for this vehicle.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  vehicleCardWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    overflow: "hidden",
  },
  vehicleCard: {
    padding: 16,
  },
  vehicleCardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#F3F4F6",
  },
  vehicleImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleInfo: {
    flex: 1,
  },
  plateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 4,
  },
  vehicleSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.SECONDARY,
  },
  expandedSection: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.03)",
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  historyHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.DARK,
  },
  historySubtitle: {
    fontSize: 13,
    color: colors.SECONDARY,
    marginTop: 2,
  },
  emptyHistoryText: {
    fontSize: 13,
    color: colors.SECONDARY,
    fontStyle: "italic",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
