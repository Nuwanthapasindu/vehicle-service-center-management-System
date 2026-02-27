import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "../../constants/colors";
import useAsyncStorage from "../../hooks/useAsyncStorage";
import storageKeys from "../../constants/storageKeys";
import logo from "../../assets/logo.png";
import slider1 from "../../assets/slider1.jpg";
import slider2 from "../../assets/slider2.jpg";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to\nAutoMate",
    subtitle:
      "The ultimate command center\nfor modern mechanics and shop\nadmins.",
    image: slider1,
  },
  {
    id: "2",
    title: "Real-time\nSMS update",
    subtitle:
      "The ultimate command center\nfor modern mechanics and shop\nadmins.",
    image: slider2,
  },
];

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);
  const router = useRouter();
  const { writeToStorage } = useAsyncStorage();
  const handleComplete = async () => {
    try {
      await writeToStorage(storageKeys.HAS_VIEWED_ONBOARDING, "true");
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Error setting onboarding status", error);
    }
  };

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slideContainer}>
        {/* Hero Image Section */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.heroImage} />
          {/* Default overlay applied to match the prior design */}
          <View style={styles.iconOverlay}>
            <Ionicons
              name="hardware-chip-outline"
              size={90}
              color={colors.PRIMARY}
            />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Image source={logo} style={styles.logoPlaceholder} />
          </View>
          <Text style={styles.logoText}>AutoMate</Text>
        </View>
        <TouchableOpacity onPress={handleComplete}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel Section */}
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      {/* Footer Section (Pagination & Button) */}
      <View style={styles.footerContainer}>
        {/* Pagination Indicators */}
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View
              key={index.toString()}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={handleComplete}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={24} color={colors.DARK} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  slideContainer: {
    width,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: colors.DARK,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.DARK,
  },
  skipText: {
    fontSize: 16,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  heroImage: {
    width: width - 48,
    height: width - 80,
    borderRadius: 20,
    opacity: 0.9,
  },
  iconOverlay: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 30,
    width: "100%",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.DARK,
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.SECONDARY,
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.PRIMARY,
    opacity: 0.3,
  },
  activeDot: {
    width: 30,
    opacity: 1,
  },
  primaryButton: {
    backgroundColor: colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 14,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.DARK,
  },
});
