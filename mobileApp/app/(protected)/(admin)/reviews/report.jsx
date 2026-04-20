import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Star, TrendingUp } from "lucide-react-native";
import colors from "../../../../constants/colors";

export default function SatisfactionReport() {
  const router = useRouter();

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
        fill={i < Math.floor(rating) ? "transparent" : "transparent"} // Outline only for the design shown
      />
    ));
  };

  const breakdowns = [
    { stars: 5, percentage: 72 },
    { stars: 4, percentage: 18 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 1 },
  ];

  const recentFeedback = [
    {
      id: 1,
      name: "Marcus Thompson",
      service: "Oil Change",
      time: "2 hours ago",
      rating: 5,
      comment: `"Incredible speed and professional service. The app made it easy to track my progress while I waited in the lounge."`
    },
    {
      id: 2,
      name: "Elena Rodriguez",
      service: "Brake Inspection",
      time: "Yesterday",
      rating: 4,
      comment: `"Technician was very thorough. Only took off one star because the parts delivery was slightly delayed."`
    },
    {
      id: 3,
      name: "Samuel Chen",
      service: "Tire Rotation",
      time: "2 days ago",
      rating: 5,
      comment: `"The best mechanic shop experience I've had in years. Highly recommend Shine Depot to everyone."`
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* OVERALL RATING CARD */}
      <View style={styles.card}>
        <Text style={styles.cardSuperTitle}>OVERALL RATING</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.bigScore}>4.8</Text>
          <Text style={styles.scoreScale}> / 5.0</Text>
        </View>
        <View style={styles.starRow}>
          {renderStars(4.8)}
        </View>
        <Text style={styles.verifiedText}>Based on 1,240 verified reviews</Text>
        
        <View style={styles.trendPill}>
          <TrendingUp size={14} color="#2E7D32" style={styles.trendIcon} />
          <Text style={styles.trendText}>+0.2% from last month</Text>
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

      {recentFeedback.map((fb) => (
        <View key={fb.id} style={[styles.card, styles.feedbackCard]}>
          <View style={styles.feedbackHeader}>
            <Text style={styles.feedbackName}>{fb.name}</Text>
            <View style={styles.smallStarRow}>
              {renderSmallStars(fb.rating)}
            </View>
          </View>
          <Text style={styles.feedbackMeta}>{fb.service} • {fb.time}</Text>
          <Text style={styles.feedbackComment}>{fb.comment}</Text>
        </View>
      ))}

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
