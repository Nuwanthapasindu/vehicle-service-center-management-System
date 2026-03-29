import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../../../constants/colors';
import DropdownInput from '../../../../components/DropdownInput';

export default function AddInvoice() {
  const [service, setService] = useState('');
  const [inventory, setInventory] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Customer Details */}
        <Text style={styles.sectionHeader}>CUSTOMER DETAILS</Text>
        <View style={styles.customerRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={colors.SECONDARY} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="License Plate or Mobile Number"
              placeholderTextColor={colors.SECONDARY}
            />
          </View>
          <TouchableOpacity style={styles.addCustomerBtn}>
            <Ionicons name="person-add-outline" size={22} color={colors.PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Service Selector */}
        <Text style={styles.sectionHeader}>SERVICE SELECTOR</Text>
        <DropdownInput 
          value={service}
          options={['Ceramic Coating Pro', 'Brake Pad Fitment', 'Full Wash']}
          onSelect={setService}
          placeholder="Add Catalog Service"
        />

        <View style={{height: 16}} />

        {/* Inventory Selector */}
        <Text style={styles.sectionHeader}>INVENTORY SELECTOR</Text>
        <DropdownInput 
          value={inventory}
          options={['Synthetic Oil 5W-30', 'Coolant', 'Wiper Blades']}
          onSelect={setInventory}
          placeholder="Add Parts & Fluids"
        />

        <View style={{height: 24}} />

        {/* Invoice Items */}
        <View style={styles.itemsHeaderRow}>
          <Text style={styles.sectionHeader}>INVOICE ITEMS</Text>
          <Text style={styles.itemsCountText}>3 Items Added</Text>
        </View>

        {/* Item 1 */}
        <View style={styles.itemCard}>
          <View style={styles.itemIconContainer}>
            <MaterialCommunityIcons name="car-wash" size={24} color={colors.PRIMARY} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Ceramic Coating Pro</Text>
            <Text style={styles.itemSubtitle}>Catalog Service</Text>
          </View>
          <Text style={styles.itemPrice}>Rs. 15,000</Text>
          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color={colors.DANGER_COLOR} />
          </TouchableOpacity>
        </View>

        {/* Item 2 */}
        <View style={styles.itemCard}>
          <View style={styles.itemIconContainer}>
            <MaterialCommunityIcons name="oil" size={24} color={colors.PRIMARY} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Synthetic Oil 5W-30</Text>
            <Text style={styles.itemSubtitle}>Inventory Item</Text>
          </View>
          <Text style={styles.itemPrice}>Rs. 4,500</Text>
          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color={colors.DANGER_COLOR} />
          </TouchableOpacity>
        </View>

        {/* Item 3 */}
        <View style={styles.itemCard}>
          <View style={styles.itemIconContainer}>
            <MaterialCommunityIcons name="wrench" size={24} color={colors.PRIMARY} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Brake Pad Fitment</Text>
            <Text style={styles.itemSubtitle}>Labor Charge</Text>
          </View>
          <Text style={styles.itemPrice}>Rs. 5,000</Text>
          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color={colors.DANGER_COLOR} />
          </TouchableOpacity>
        </View>

        <View style={styles.dashedLineContainer}>
           <View style={styles.dashedLine} />
        </View>
        
        <View style={{height: 20}} />
      </ScrollView>

      {/* Bottom Summary & Actions */}
      <View style={styles.bottomPanel}>
        {/* Total Card */}
        <View style={styles.totalCard}>
           <View>
             <Text style={styles.runningTotalLabel}>RUNNING TOTAL</Text>
             <View style={styles.totalAmountRow}>
               <Text style={styles.currencyLabel}>Rs.</Text>
               <View style={styles.amountValueContainer}>
                  <Text style={styles.totalAmountSub}>24</Text>
                  <Text style={styles.totalAmountSub}>,500</Text>
               </View>
             </View>
           </View>
           <TouchableOpacity style={styles.discountBtn}>
              <MaterialCommunityIcons name="receipt-text-remove-outline" size={26} color={colors.DARK} />
           </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveDraftBtn}>
          <Ionicons name="mail-outline" size={20} color={colors.LIGHT} />
          <Text style={styles.saveDraftText}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.generateBtn}>
          <Ionicons name="checkmark-circle-outline" size={22} color={colors.DARK} />
          <Text style={styles.generateBtnText}>Generate & Mark Paid</Text>
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
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginBottom: 10,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    height: 48,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK,
  },
  addCustomerBtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(142, 219, 0, 0.15)', // light primary hue
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemsCountText: {
    fontSize: 13,
    color: '#94A3B8', // subtle slate
    fontWeight: '500',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(142, 219, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.DARK,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.DARK,
    marginRight: 12,
  },
  deleteBtn: {
    padding: 4,
  },
  dashedLineContainer: {
    height: 1,
    overflow: 'hidden',
    marginTop: 10,
  },
  dashedLine: {
    height: 2,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderStyle: 'dashed',
    marginTop: -1,
  },
  bottomPanel: {
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  totalCard: {
    backgroundColor: colors.DARK,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  runningTotalLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currencyLabel: {
    color: colors.PRIMARY,
    fontSize: 18,
    fontWeight: '800',
    marginRight: 4,
    marginBottom: 4,
  },
  amountValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalAmountMain: {
    color: colors.LIGHT,
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 40,
  },
  totalAmountSub: {
    color: colors.LIGHT,
    fontSize: 28,
    fontWeight: '900',
  },
  discountBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.DARK,
    height: 54,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveDraftText: {
    color: colors.LIGHT,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY,
    height: 54,
    borderRadius: 12,
  },
  generateBtnText: {
    color: colors.DARK,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
});
