import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import colors from '../../../../constants/colors'

const INVOICES = [
  { id: '1', invoiceId: '#INV-2023-001', name: 'James Wilson', plate: 'ABC-1234', date: 'Oct 24, 2023', amount: '$245.00', status: 'PAID' },
  { id: '2', invoiceId: '#INV-2023-002', name: 'Sarah Jenkins', plate: 'XYZ-9876', date: 'Oct 23, 2023', amount: '$1,120.50', status: 'UNPAID' },
  { id: '3', invoiceId: '#INV-2023-004', name: 'Robert Chen', plate: 'BBA-4422', date: 'Oct 21, 2023', amount: '$432.10', status: 'PAID' },
  { id: '4', invoiceId: '#INV-2023-005', name: 'Linda G.', plate: 'KKK-1122', date: 'Oct 20, 2023', amount: '$150.00', status: 'UNPAID' },
]

export default function AllInvoice() {
  const [activeFilter, setActiveFilter] = useState('All');

  const renderItem = ({ item }) => {
    const isPaid = item.status === 'PAID';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.invoiceId}>{item.invoiceId}</Text>
          <View style={[styles.badge, isPaid ? styles.badgePaid : styles.badgeUnpaid]}>
            <Text style={[styles.badgeText, isPaid ? styles.badgeTextPaid : styles.badgeTextUnpaid]}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={styles.customerInfo}>{item.name} • {item.plate}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.amountText}>{item.amount}</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.SECONDARY} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search by plate or invoice ID"
          placeholderTextColor={colors.SECONDARY}
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
      <FlatList 
        data={INVOICES}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
      />

      <TouchableOpacity style={styles.fab}>
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