import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { inventoryLogsService } from "../../../../../services/inventory/inventoryLogs.service";
import LogItem from "../../../../../components/inventoryLogs/LogItem";
import LogFilters from "../../../../../components/inventoryLogs/LogFilters";
import colors from "../../../../../constants/colors";
import enums from "../../../../../constants/enums";
import Toast from "react-native-toast-message";

export default function ItemLogView() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  const [actionType, setActionType] = useState("");
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());

  const [debouncedFilters, setDebouncedFilters] = useState({ actionType, period, startDate, endDate });

  const isFetching = useRef(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({ actionType, period, startDate, endDate });
    }, 400);

    return () => clearTimeout(handler);
  }, [actionType, period, startDate, endDate]);

  const actionTypes = Object.values(enums.INVENTORY_ACTION_TYPES);

  const fetchLogs = async (page = 1, isRefreshing = false) => {
    if (isFetching.current && page > 1) return;

    try {
      isFetching.current = true;
      if (!isRefreshing && page === 1) setLoading(true);

      const response = await inventoryLogsService.fetchItemLogs(id, {
        actionType: debouncedFilters.actionType || undefined,
        period: debouncedFilters.period || undefined,
        startDate: debouncedFilters.period === 'custom' ? debouncedFilters.startDate.toISOString() : undefined,
        endDate: debouncedFilters.period === 'custom' ? debouncedFilters.endDate.toISOString() : undefined,
        page,
        limit: 20
      });

      if (page === 1) {
        setLogs(response.data);
      } else {
        setLogs(prev => {
          const existingIds = new Set(prev.map(l => l._id));
          const newItems = response.data.filter(l => !existingIds.has(l._id));
          return [...prev, ...newItems];
        });
      }

      setPagination(response?.pagination || { page: 1, limit: 20, total: 0, pages: 1 });

      if (isRefreshing) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Item logs updated'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to fetch item logs'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetching.current = false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLogs(1);
    }, [id, debouncedFilters])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs(1, true);
  };

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.pages && !loading && !isFetching.current) {
      fetchLogs(pagination.page + 1);
    }
  };

  const renderLogItem = useCallback(({ item }) => <LogItem log={item} />, []);

  return (
    <View style={styles.container}>


      <LogFilters
        actionType={actionType}
        setActionType={setActionType}
        actionTypes={actionTypes}
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      {loading && logs.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.PRIMARY} />
          <Text style={styles.loadingText}>Loading Item Logs...</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item._id}
          renderItem={renderLogItem}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.PRIMARY]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No logs found matching your criteria.</Text>
            </View>
          }
          ListFooterComponent={
            (pagination && pagination.page < pagination.pages) ? (
              <ActivityIndicator size="small" color={colors.PRIMARY} style={{ margin: 20 }} />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6c757d',
  },
  listContainer: {
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6c757d',
    textAlign: 'center',
  },
});
