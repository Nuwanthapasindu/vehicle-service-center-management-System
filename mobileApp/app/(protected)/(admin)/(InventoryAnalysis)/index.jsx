import { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AlertTriangle, Package, DollarSign } from "lucide-react-native";
import colors from "../../../../constants/colors";
import { inventoryAnalysisService } from "../../../../services/inventory/inventoryAnalysis.service";
import StatCard from "../../../../components/inventoryAnalysis/StatCard";
import CategoryChart from "../../../../components/inventoryAnalysis/CategoryChart";
import MovementChart from "../../../../components/inventoryAnalysis/MovementChart";
import Toast from "react-native-toast-message";

export default function InventoryAnalysisScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [movementData, setMovementData] = useState([]);
  const lastFetched = useRef(0);

  const fetchData = async (isManualRefresh = false) => {
    const now = Date.now();
    if (!isManualRefresh && lastFetched.current && now - lastFetched.current < 120000) {
      setLoading(false);
      return;
    }

    try {
      if (!isManualRefresh) setLoading(true);
      const [statsRes, categoryRes, movementRes] = await Promise.all([
        inventoryAnalysisService.fetchStats(),
        inventoryAnalysisService.fetchCategoryBreakdown(),
        inventoryAnalysisService.fetchStockMovement()
      ]);
      setStats(statsRes);
      setCategoryData(categoryRes);
      setMovementData(movementRes);
      lastFetched.current = Date.now();

      if (isManualRefresh) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Analysis data updated'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to fetch analysis data'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading Analysis...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PRIMARY]} />
        }
      >
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Items"
            value={stats?.totalItems || 0}
            icon={Package}
            color="#007bff"
          />
          <StatCard
            title="Low Stock"
            value={stats?.lowStockItems || 0}
            icon={AlertTriangle}
            color="#ffc107"
          />
          <StatCard
            title="Stock Value"
            value={`Rs. ${(stats?.totalStockValue || 0).toLocaleString()}`}
            icon={DollarSign}
            color="#28a745"
          />
        </View>

        <Text style={styles.sectionTitle}>Top 5 Categories (by Value)</Text>
        <CategoryChart data={[...categoryData].sort((a, b) => b.totalValue - a.totalValue).slice(0, 5)} />

        <Text style={styles.sectionTitle}>Activity Trends</Text>
        <MovementChart data={movementData} />

        <View style={styles.footer}>
          <Text style={styles.lastUpdated}>
            Last updated: {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.DARK,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    color: '#6c757d',
    fontSize: 14,
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212529',
    marginBottom: 20,
  },
  statsGrid: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginTop: 8,
    marginBottom: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#adb5bd',
  },
});
