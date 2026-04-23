import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import colors from "../../../../constants/colors";
import ReviewItem from "../../../../components/ReviewItem";
import ReviewService from "../../../../services/review/review.service";
import getImageFullUrl from "../../../../utils/getImageFullUrl";
import enums from "../../../../constants/enums";

export default function ReviewsModeration() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(enums.REVIEW_FILTER_TABS.ALL);
  const tabs = [enums.REVIEW_FILTER_TABS.ALL, enums.REVIEW_FILTER_TABS.PUBLISHED];

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = async (pageNumber = 1, isRefreshing = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const isApproved = activeTab === enums.REVIEW_FILTER_TABS.PUBLISHED ? true : undefined;
      const response = await ReviewService.getAdminReviews(pageNumber, 10, isApproved);
      const newReviews = response?.payload?.reviews || [];
      
      const formattedReviews = newReviews.map(formatReview);

      if (isRefreshing) {
        setReviews(formattedReviews);
      } else {
        setReviews((prev) => [...prev, ...formattedReviews]);
      }
      
      setHasMore(newReviews.length === 10);
      setPage(pageNumber);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to fetch reviews",
        text2: error?.response?.data?.payload?.message || error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReviews(1, true);
    }, [activeTab])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReviews(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchReviews(page + 1);
    }
  };

  const formatReview = (review) => {
    const customerName = review.customer?.name || "Unknown";
    const initials = customerName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const make = review.booking?.vehicle?.make;
    const model = review.booking?.vehicle?.model;
    const vehicle = make && model ? `${make} ${model}` : "Unknown Vehicle";
    
    // Format date/time
    const dateObj = new Date(review.createdAt);
    const time = dateObj.toLocaleDateString();
    return {
      id: review._id,
      author: customerName,
      initials,
      vehicle,
      time,
      rating: review.rating,
      text: review.comment ? `"${review.comment}"` : "No comment",
      image: review.booking?.vehicle?.image?.filePath ? getImageFullUrl(review.booking.vehicle.image.filePath) : null,
      isApproved: review.isApproved,
    };
  };

  const toggleApproval = async (id, isApproved) => {
    try {
      const {payload} = await ReviewService.updateApprovalStatus(id, isApproved);
      Toast.show({
        type: "success",
        text1: "Review status updated successfully",
        text2: payload?.message,
      });
      onRefresh(); // Refresh current tab list
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to update review status",
        text2: error?.response?.data?.payload?.message || error.message || "Something went wrong",
      });
    }
  };

  const renderReviewItem = ({ item }) => (
    <ReviewItem
      item={item}
      onTogglePublish={() => toggleApproval(item.id, !item.isApproved)}
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
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PRIMARY]} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews found</Text>
            </View>
          )
        }
        ListFooterComponent={
          loading && !refreshing ? (
            <View style={styles.footerContainer}>
              <ActivityIndicator size="large" color={colors.PRIMARY} />
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
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: colors.SECONDARY,
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 12,
  },
});
