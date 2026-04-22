import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Platform, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import colors from '../../../../constants/colors'
import { useRouter } from 'expo-router'
import { invoiceService } from '../../../../services/invoice/invoice.service'

export default function AllInvoice() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('All');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInvoices();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeFilter]);

  const fetchInvoices = async () => {
    try {
      if (!refreshing) setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (activeFilter === 'Paid') params.isCompleted = true;
      if (activeFilter === 'Unpaid') params.isCompleted = false;

      const data = await invoiceService.fetchInvoices(params);
      setInvoices(data);
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchInvoices();
  }, [searchQuery, activeFilter]);

  const filteredInvoices = invoices;

  const renderItem = ({ item }) => {
    const isPaid = item.isCompleted;
    const dateStr = new Date(item.createdAt).toLocaleDateString();
    // Default to LKR for formatting
    const totalAmount = item.totalPrice ? `LKR ${item.totalPrice.toFixed(2)}` : 'LKR 0.00';
    const customerName = item.customer?.name || 'Walk-in Customer';
    const plateno = item.jobCard?.booking?.vehicle?.licensePlate || 'N/A';

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => {
          if (item._id) {
            router.push(`/(protected)/(admin)/invoice/${item._id}`);
          }
        }} 
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.invoiceId}>{item.invoiceId}</Text>
          <View style={[styles.badge, isPaid ? styles.badgePaid : styles.badgeUnpaid]}>
            <Text style={[styles.badgeText, isPaid ? styles.badgeTextPaid : styles.badgeTextUnpaid]}>{isPaid ? 'PAID' : 'UNPAID'}</Text>
          </View>
        </View>
        
        <Text style={styles.customerInfo}>{customerName} • {plateno}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>{dateStr}</Text>
          <Text style={styles.amountText}>{totalAmount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.SECONDARY} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search by Invoice ID..."
          placeholderTextColor={colors.SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {['All', 'Paid', 'Unpaid'].map(filter => (
          <TouchableOpacity 
            key={filter} 
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>RECENT INVOICES</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.PRIMARY} />
        </View>
      ) : (
        <FlatList 
          data={filteredInvoices}
          keyExtractor={(item, index) => item._id || item.invoiceId || index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.PRIMARY]} // Android
              tintColor={colors.PRIMARY} // iOS
            />
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(protected)/(admin)/invoice/AddInvoice')}>
        <Ionicons name="add" size={28} color={colors.DARK} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },
  filterText: {
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.DARK,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceId: {
    color: colors.PRIMARY,
    fontWeight: '800',
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePaid: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)', 
  },
  badgeUnpaid: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgeTextPaid: {
    color: '#22C55E', 
  },
  badgeTextUnpaid: {
    color: '#F59E0B', 
  },
  customerInfo: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.DARK,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 13,
    color: colors.SECONDARY,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.DARK,
    letterSpacing: -0.5,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.PRIMARY,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  }
});