import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../../constants/colors";

const DUMMY_SERVICES = [
  {
    id: 1,
    tag: "CutPolish",
    name: "Full Exterior Polish",
    duration: "120 mins",
    price: "150.00",
    active: true,
  },
  {
    id: 2,
    tag: "Sanitation",
    name: "Interior Deep Clean",
    duration: "90 mins",
    price: "85.00",
    active: true,
  },
  {
    id: 3,
    tag: "Protection",
    name: "Ceramic Coating Pro",
    duration: "240 mins",
    price: "450.00",
    active: true,
  },
  {
    id: 4,
    tag: "Maintenance",
    name: "Standard Hand Wash",
    duration: "45 mins",
    price: "40.00",
    active: true,
  },
  {
    id: 5,
    tag: "CutPolish",
    name: "Headlight Restoration",
    duration: "60 mins",
    price: "65.00",
    active: true,
  },
  {
    id: 6,
    tag: "INACTIVE",
    name: "Engine Bay Steam Clean",
    duration: "Seasonal Availability",
    price: "120.00",
    active: false,
  },
];

export default function Service() {
  return (
    <View style={styles.container}>
      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.SECONDARY + "80"}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search services..."
            placeholderTextColor={colors.SECONDARY + "80"}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Subtitle */}
        <Text style={styles.sectionTitle}>ACTIVE SERVICES (12)</Text>

        {/* List */}
        <View style={styles.listContainer}>
          {DUMMY_SERVICES.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.card, !service.active && styles.cardInactive]}
              activeOpacity={0.7}
              disabled={!service.active}
            >
              <View style={styles.cardLeft}>
                <View
                  style={[
                    styles.tagWrapper,
                    !service.active && styles.tagWrapperInactive,
                  ]}
                >
                  <Text style={styles.tagText}>{service.tag}</Text>
                </View>
                <Text
                  style={[
                    styles.serviceName,
                    !service.active && styles.textInactive,
                  ]}
                >
                  {service.name}
                </Text>
                <Text
                  style={[
                    styles.durationText,
                    !service.active && styles.subtextInactive,
                  ]}
                >
                  {service.active
                    ? `Duration: ${service.duration}`
                    : service.duration}
                </Text>
              </View>

              <View style={styles.cardRight}>
                <Text
                  style={[
                    styles.priceText,
                    !service.active && styles.textInactiveLight,
                  ]}
                >
                  ${service.price}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={
                    service.active ? colors.SECONDARY : colors.BORDER_COLOR
                  }
                  style={styles.chevron}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color={colors.LIGHT} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR + "40",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100, // Leave room for FAB
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR + "60",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardInactive: {
    opacity: 0.8,
  },
  cardLeft: {
    flex: 1,
    justifyContent: "center",
  },
  tagWrapper: {
    alignSelf: "flex-start",
    backgroundColor: colors.DARK,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  tagWrapperInactive: {
    backgroundColor: "#B4BFCB",
  },
  tagText: {
    color: colors.LIGHT,
    fontSize: 10,
    fontWeight: "600",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 4,
  },
  durationText: {
    fontSize: 13,
    color: colors.SECONDARY,
  },
  textInactive: {
    color: "#94A3B8",
  },
  subtextInactive: {
    color: "#CBD5E1",
  },
  textInactiveLight: {
    color: "#B4BFCB",
  },
  cardRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 2, // Minor padding mapping
  },
  priceText: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.DARK,
  },
  chevron: {
    marginTop: "auto", // Push chevron to bottom
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});
