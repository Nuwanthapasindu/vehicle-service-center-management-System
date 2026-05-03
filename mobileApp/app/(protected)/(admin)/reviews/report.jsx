import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Star, TrendingUp } from "lucide-react-native";
import colors from "../../../../constants/colors";
import { reviewService } from "../../../../services/review/review.service";
import Toast from "react-native-toast-message";
import ReviewItem from "../../../../components/ReviewItem";

export default function SatisfactionReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getAdminReviewReport({ limit: 5 });
      if (response && response.payload) {
        setStats(response.payload.stats);
        setRecentFeedback(response.payload.reviews || []);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to load report",
        text2: error?.response?.data?.payload?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={24}
        color={i < rating ? colors.PRIMARY : "#E0E0E0"}
        fill={i < Math.floor(rating) ? colors.PRIMARY : "transparent"}
      />
    ));
  };

  const renderSmallStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        color={i < rating ? colors.PRIMARY : "#E0E0E0"}
        fill={i < Math.floor(rating) ? "transparent" : "transparent"}
      />
    ));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  if (!stats) return null;

  // Calculate percentages dynamically
  const breakdowns = [5, 4, 3, 2, 1].map((stars) => {
    const count = stats.distribution[stars] || 0;
    const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
    return { stars, percentage };
  });

  const formatReviewForComponent = (review) => {
    const getInitials = (name) => {
      if (!name) return "U";
      const names = name.split(" ");
      if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
      return name[0].toUpperCase();
    };

    const getRelativeTime = (dateString) => {
      if (!dateString) return "Recently";
      const now = new Date();
      const reviewDate = new Date(dateString);
      const diffInHours = Math.floor((now - reviewDate) / (1000 * 60 * 60));
      if (diffInHours < 24) return `${diffInHours || 0} hours ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    };

    return {
      _id: review._id,
      initials: getInitials(review.customerName),
      author: review.customerName,
      vehicle: review.service || review.includedServices?.[0] || "General Service",
      time: getRelativeTime(review.date),
      rating: review.rating,
      text: review.comment,
      image: null,
      adminReply: review.adminReply,
      isApproved: true, // We assume true for report or ignore toggling
    };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* OVERALL RATING CARD */}
      <View style={styles.card}>
        <Text style={styles.cardSuperTitle}>OVERALL RATING</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.bigScore}>{stats.average}</Text>
          <Text style={styles.scoreScale}> / 5.0</Text>
        </View>
        <View style={styles.starRow}>
          {renderStars(stats.average)}
        </View>
        <Text style={styles.verifiedText}>Based on {stats.total} verified reviews</Text>
        
        <View style={styles.trendPill}>
          <TrendingUp size={14} color="#2E7D32" style={styles.trendIcon} />
          <Text style={styles.trendText}>Up to date stats</Text>
        </View>
      </View>

      {/* REVIEW BREAKDOWN SECTION */}
      <Text style={styles.sectionTitle}>Review Breakdown</Text>
      <View style={[styles.card, styles.breakdownCard]}>
        {breakdowns.map((b) => (
          <View key={b.stars} style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{b.stars}</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: `${b.percentage}%` }]} />
            </View>
            <Text style={styles.breakdownPercent}>{b.percentage}%</Text>
          </View>
        ))}
      </View>

      {/* RECENT FEEDBACK SECTION */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent Feedback</Text>
        <TouchableOpacity onPress={() => router.push("/(protected)/(admin)/reviews")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {recentFeedback.map((fb, idx) => {
        const formattedItem = formatReviewForComponent(fb);
        return (
          <ReviewItem 
            key={formattedItem._id || idx} 
            item={formattedItem} 
            onTogglePublish={() => router.push(`/(protected)/(admin)/reviews/${formattedItem._id}`)}
            onReply={() => router.push(`/(protected)/(admin)/reviews/${formattedItem._id}`)}
            hideActions={true}
          />
        );
      })}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 12,
  },
  cardSuperTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#78909C',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bigScore: {
    fontSize: 54,
    fontWeight: '900',
    color: '#1A237E', // Deep slate
    letterSpacing: -1.5,
  },
  scoreScale: {
    fontSize: 22,
    fontWeight: '700',
    color: '#90A4AE',
  },
  starRow: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 12,
  },
  verifiedText: {
    fontSize: 13,
    color: '#607D8B',
    fontWeight: '600',
    marginBottom: 16,
  },
  trendPill: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  trendIcon: {
    marginRight: 6,
  },
  trendText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 20,
    marginBottom: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  seeAllText: {
    color: colors.PRIMARY,
    fontWeight: '700',
    fontSize: 14,
  },
  breakdownCard: {
    alignItems: 'stretch',
    paddingVertical: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  breakdownLabel: {
    width: 20,
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.PRIMARY,
    borderRadius: 5,
  },
  breakdownPercent: {
    width: 34,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  feedbackCard: {
    alignItems: 'stretch',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 8,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedbackName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  smallStarRow: {
    flexDirection: 'row',
    gap: 2,
  },
  feedbackMeta: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 12,
  },
  feedbackComment: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    fontStyle: "italic",
  },
});
