import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../../../../constants/colors";

const DUMMY_PACKAGES = [
  {
    id: 1,
    name: "Premium Detailing Bundle",
    vehicles: "Sedan, SUV, Truck",
    servicesCount: 5,
    updatedAt: "Updated 2d ago",
    image:
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=200",
    active: true,
  },
  {
    id: 2,
    name: "Ceramic Coating Gold",
    vehicles: "Sedan, SUV",
    servicesCount: 3,
    updatedAt: "Updated 1w ago",
    image:
      "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&q=80&w=200",
    active: true,
  },
  {
    id: 3,
    name: "Interior Deep Clean",
    vehicles: "All Models",
    servicesCount: 8,
    updatedAt: "Updated 3h ago",
    image:
      "https://images.unsplash.com/photo-1550524458-75c6020c6ae2?auto=format&fit=crop&q=80&w=200",
    active: true,
  },
  {
    id: 4,
    name: "Wheel & Tire Protection",
    vehicles: "Sedan, SUV, Truck, Van",
    servicesCount: 2,
    updatedAt: "Updated 1mo ago",
    image:
      "https://images.unsplash.com/photo-1594246672323-017e8845fc86?auto=format&fit=crop&q=80&w=200",
    active: true,
  },
  {
    id: 5,
    name: "Showroom Gloss Finish",
    vehicles: "Sedan, Sports",
    servicesCount: 4,
    updatedAt: "Updated 5d ago",
    image:
      "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=200",
    active: true,
  },
];

export default function PackageCatalog() {
  const router = useRouter();
  const [filter, setFilter] = useState("Active");

  return (
    <View style={styles.container}>
      {/* Header & Search Section */}
      <View style={styles.headerSection}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.SECONDARY + "80"}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search packages (e.g. Interior, Ceramic)"
            placeholderTextColor={colors.SECONDARY + "80"}
            style={styles.searchInput}
          />
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContainer}
        >
          {["Active", "All Packages", "Deactivated"].map((tab) => {
            const isActive = filter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                activeOpacity={0.7}
                onPress={() => setFilter(tab)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* List */}
        <View style={styles.listContainer}>
          {DUMMY_PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={[styles.card, !pkg.active && styles.cardInactive]}
              activeOpacity={0.7}
              onPress={() =>
                router.push(
                  `/(protected)/(admin)/serviceAndPackage/package/${pkg.id}`,
                )
              }
            >
              <View style={styles.cardImageWrapper}>
                <Image
                  source={{ uri: pkg.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.pkgName}>{pkg.name}</Text>
                <Text style={styles.pkgVehicles}>{pkg.vehicles}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {pkg.servicesCount} SERVICES
                    </Text>
                  </View>
                  <Text style={styles.updatedText}>• {pkg.updatedAt}</Text>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.BORDER_COLOR}
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() =>
          router.push("/(protected)/(admin)/serviceAndPackage/package/add")
        }
      >
        <Ionicons name="add" size={32} color={colors.DARK} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  headerSection: {
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingTop: 16,
    paddingBottom: 4,
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
    paddingHorizontal: 16,
    marginHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK,
  },
  filterTabsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  filterTab: {
    backgroundColor: colors.LIGHT,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  filterTabActive: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.DARK,
  },
  filterTabTextActive: {
    color: colors.DARK,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Leave room for FAB
  },
  listContainer: {
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR + "80",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  cardInactive: {
    opacity: 0.6,
  },
  cardImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  pkgName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 4,
  },
  pkgVehicles: {
    fontSize: 13,
    color: colors.SECONDARY,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#E4F7D4", // Light pastel green matching the screenshot
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2C541A", // Dark green for contrast
  },
  updatedText: {
    fontSize: 12,
    color: colors.SECONDARY + "99",
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 12,
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
    shadowColor: colors.DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
});
