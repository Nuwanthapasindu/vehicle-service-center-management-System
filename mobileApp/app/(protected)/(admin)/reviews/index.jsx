import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import colors from "../../../../constants/colors";
import ReviewItem from "../../../../components/ReviewItem";

const MOCK_REVIEWS = [
  {
    id: "1",
    author: "Jonathan Miller",
    initials: "JM",
    service: "Full Interior Detail",
    time: "2h ago",
    rating: 5,
    text: '"The attention to detail was incredible. My car looks brand new! Highly recommend the team at Shine Depot. They even got the stains out of the passenger seat."',
    image:
      "https://images.unsplash.com/photo-1600705436622-5f65eb5629c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "2",
    author: "Amanda Sterling",
    initials: "AS",
    service: "Ceramic Coating",
    time: "5h ago",
    rating: 4,
    text: '"Excellent work on the ceramic coating. A bit pricey but worth every penny for the shine. Wait time was longer than expected though."',
    image:
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "3",
    author: "Robert Kane",
    initials: "RK",
    service: "Oil Change",
    time: "Yesterday",
    rating: 5,
    text: '"Fast service and very professional. The mechanic explained everything clearly."',
    image: null,
  },
];

export default function ReviewsModeration() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Pending");

  const tabs = ["Pending", "Approved", "Rejected"];

  const renderReviewItem = ({ item }) => (
    <ReviewItem
      item={item}
      onApprove={() => console.log("Approve", item.id)}
      onReject={() => console.log("Reject", item.id)}
      onReply={() => router.push(`/(protected)/(admin)/reviews/${item.id}`)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, isActive && styles.activeTabText]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={activeTab === "Pending" ? MOCK_REVIEWS : []} // Just mapping for Pending to mock for now
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          activeTab === "Pending" ? (
            <View style={styles.footerContainer}>
              <View style={styles.loadingCircle}>
                <View style={styles.loadingIndicatorFill} />
              </View>
              <Text style={styles.loadingText}>LOADING MORE</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 16,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.SECONDARY,
  },
  activeTabText: {
    color: colors.DARK,
    fontWeight: "800",
  },
  listContainer: {
    padding: 16,
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 4,
    borderColor: "#E2E8F0",
    borderTopColor: colors.PRIMARY,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
