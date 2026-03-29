import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../../../../constants/colors';

export default function ViewInvoice() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* WIP Header Card */}
        <View style={styles.wipCard}>
          <View style={styles.wipInfo}>
            <View style={styles.wipBadgeRow}>
              <View style={styles.orangeDot} />
              <Text style={styles.wipText}>WORK IN PROGRESS</Text>
            </View>
            <Text style={styles.vehicleTitle}>Vehicle: ABC-1234</Text>
            <Text style={styles.vehicleSubtitle}>2022 Tesla Model 3 • Silver</Text>
          </View>
          <View style={styles.vehicleImagePlaceholder}>
            <Ionicons name="car-sport" size={36} color={colors.SECONDARY} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>BILLED ITEMS</Text>

        {/* Billed Items List */}
        <View style={styles.billedItemCard}>
          <View style={styles.itemMain}>
            <Text style={styles.itemTitle}>Full Synthetic Oil Change</Text>
            <Text style={styles.itemSubtitle}>Labor & Materials</Text>
          </View>
          <Text style={styles.itemPrice}>$85.00</Text>
          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <View style={styles.billedItemCard}>
          <View style={styles.itemMain}>
            <Text style={styles.itemTitle}>Premium Oil Filter</Text>
            <Text style={styles.itemSubtitle}>Part #OF-992-B</Text>
          </View>
          <Text style={styles.itemPrice}>$22.50</Text>
          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <View style={styles.billedItemCard}>
          <View style={styles.itemMain}>
            <Text style={styles.itemTitle}>Brake Pad Set (Front)</Text>
            <Text style={styles.itemSubtitle}>Ceramic Performance</Text>
          </View>
          <Text style={styles.itemPrice}>$145.00</Text>
          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Total Card */}
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>RUNNING TOTAL AMOUNT</Text>
            <Text style={styles.totalValue}>LKR 22,520.50</Text>
          </View>
          <Ionicons name="receipt-outline" size={48} color="rgba(255,255,255,0.1)" />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={colors.SECONDARY} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search parts or labor items..."
            placeholderTextColor={colors.SECONDARY}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomPanel}>
        <View style={styles.rowButtons}>
          <TouchableOpacity style={[styles.halfBtn, { marginRight: 12 }]}>
            <Feather name="printer" size={16} color={colors.DARK} />
            <Text style={styles.halfBtnText}>Print Quote</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.halfBtn}>
            <Feather name="share" size={16} color={colors.DARK} />
            <Text style={styles.halfBtnText}>Share PDF</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryBtn}>
          <Feather name="lock" size={18} color={colors.DARK} />
          <Text style={styles.primaryBtnText}>LOCK INVOICE & MARK PAID</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  wipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  wipInfo: {
    flex: 1,
  },
  wipBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginRight: 6,
  },
  wipText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.DARK,
    marginBottom: 4,
  },
  vehicleSubtitle: {
    fontSize: 13,
    color: colors.SECONDARY,
    fontWeight: '500',
  },
  vehicleImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginBottom: 12,
  },
  billedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.LIGHT,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  itemMain: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.DARK,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.DARK,
    marginRight: 12,
  },
  deleteBtn: {
    padding: 4,
  },
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  totalLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  totalValue: {
    color: colors.LIGHT,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.LIGHT,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    height: 52,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK,
  },
  bottomPanel: {
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 12,
    height: 48,
  },
  halfBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.DARK,
    marginLeft: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY,
    height: 56,
    borderRadius: 12,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.DARK,
    marginLeft: 10,
  },
});
