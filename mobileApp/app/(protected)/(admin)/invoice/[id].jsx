import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import SwipeableItemCard from '../../../../components/SwipeableItemCard';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import colors from '../../../../constants/colors';
import { pdfGenerator } from '../../../../utils/pdfGenerator';
import { getInvoiceTemplate } from '../../../../templates/pdf/invoiceTemplate';
import { useLocalSearchParams } from 'expo-router';
import { invoiceService } from '../../../../services/invoice/invoice.service';
import enums from '../../../../constants/enums';
import getImageFullUrl from '../../../../utils/getImageFullUrl';
import formatPrice from '../../../../utils/formatPrice';
import { useRouter, Stack } from 'expo-router';
import DropdownInput from '../../../../components/DropdownInput';
import { inventoryService } from '../../../../services/inventory/inventory.service';
import { serviceService } from '../../../../services/service/service.service';

export default function ViewInvoice() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selectors Data
  const [availableServices, setAvailableServices] = useState([]);
  const [availableInventory, setAvailableInventory] = useState([]);
  const [isProcessingAdd, setIsProcessingAdd] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInitialData();
    }
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [invoiceData, inv, srv] = await Promise.all([
        invoiceService.fetchInvoiceById(id),
        inventoryService.fetchInventory(),
        serviceService.fetchServices()
      ]);
      setInvoice(invoiceData);
      setAvailableInventory(inv || []);
      setAvailableServices(srv || []);
    } catch (error) {
      console.warn("Fetch failed", error);
      Toast.show({
        type: 'error',
        text1: 'Fetch Failed',
        text2: 'Could not load invoice or resource data.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceDetails = async () => {
    try {
      const data = await invoiceService.fetchInvoiceById(id);
      setInvoice(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Fetch Failed',
        text2: error?.response?.data?.payload?.message || 'Could not load invoice details.'
      });
      router.replace("/")
    }
  };

  const handleAddById = async (type, targetId, name, price) => {
    try {
      setIsProcessingAdd(true);
      const payload = {
        type: type,
        data: type === 'ITEM' ? {
          item: targetId,
          qty: 1,
          sellingPrice: price || 0
        } : {
          service: targetId,
          charge: price || 0
        }
      };

      await invoiceService.addInvoiceItem(id, payload);
      await fetchInvoiceDetails();

      Toast.show({
        type: 'success',
        text1: 'Added Successfully',
        text2: `${name} has been appended to the invoice.`
      });
    } catch (error) {
       Toast.show({
        type: 'error',
        text1: 'Failed to add',
        text2: error?.response?.data?.payload?.message || "Operation failed",
      });
    } finally {
      setIsProcessingAdd(false);
    }
  };

  const updateInvoiceItem = async (targetId, currentPrice, newQty, newUnit = null) => {
    try {
      setLoading(true);
      const payload = {
        type: 'ITEM',
        data: {
          item: targetId,
          qty: Number(newQty),
          sellingPrice: currentPrice,
        }
      };
      await invoiceService.addInvoiceItem(id, payload);
      await fetchInvoiceDetails();
    } catch (error) {
       Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error?.response?.data?.payload?.message || "Failed to update item",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleCompleteInvoice = () => {
    Alert.alert(
      "Confirm Completion",
      "Are you sure you want to lock this invoice and deduct inventory? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Lock Invoice", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await invoiceService.completeInvoice(id);
              await fetchInvoiceDetails();
              Toast.show({
                type: 'success',
                text1: 'Invoice Locked',
                text2: 'The items have been billed and inventory stock successfully deducted.',
              });
            } catch (error) {
              console.error("Error completing invoice:", error);
              Toast.show({
                type: 'error',
                text1: 'Completion Failed',
                text2: error?.response?.data?.message || "Failed to complete invoice",
              });
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleRemoveItem = async (type, targetId) => {
    try {
      setLoading(true);
      await invoiceService.removeInvoiceItem(id, { type, targetId });
      await fetchInvoiceDetails(); 
      Toast.show({
        type: 'success',
        text1: 'Item Removed',
        text2: 'The item was successfully removed from the invoice.',
      });
    } catch (error) {
      console.error("Error removing item:", error);
      Toast.show({
        type: 'error',
        text1: 'Removal Failed',
        text2: error?.response?.data?.message || "Failed to remove item",
      });
    } finally {
      setLoading(false);
    }
  };

  const printQuote = async () => {
    try {
      const html = getInvoiceTemplate(invoice);
      await pdfGenerator.print(html);
    } catch (error) {
      console.error('Error printing:', error);
    }
  };

  const sharePDF = async () => {
    try {
      const html = getInvoiceTemplate(invoice);
      await pdfGenerator.share(html, `Invoice_${invoice.invoiceId}`);
    } catch (error) {
      console.error('Error sharing pdf:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  if (!invoice) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.SECONDARY }}>Invoice not found.</Text>
      </View>
    );
  }

  const vehicle = invoice.jobCard?.booking?.vehicle;
  const isPaid = invoice.isCompleted;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* WIP Header Card */}
        <View style={styles.wipCard}>
          <View style={styles.wipInfo}>
            <View style={styles.wipBadgeRow}>
              <View style={[styles.orangeDot, isPaid && { backgroundColor: '#22C55E' }]} />
              <Text style={[styles.wipText, isPaid && { color: '#22C55E' }]}>
                {isPaid ? enums.INVOICE_STATUS.COMPLETED : enums.INVOICE_STATUS.WORK_IN_PROGRESS}
              </Text>
            </View>
            <Text style={styles.vehicleTitle}>Vehicle: {vehicle?.licensePlate || 'N/A'}</Text>
            <Text style={styles.vehicleSubtitle}>{vehicle?.year || ''} {vehicle?.make || ''} {vehicle?.model || ''}</Text>
          </View>
          <View style={styles.vehicleImagePlaceholder}>
            {vehicle?.image?.filePath ? (
              <Image source={{ uri: getImageFullUrl(vehicle.image.filePath) }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
            ) : (
              <Ionicons name="car-sport" size={36} color={colors.SECONDARY} />
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>BILLED ITEMS</Text>

        {/* Selected Package */}
        {invoice.selectedPackage?.selectedPackageTier && (
          <View style={styles.billedItemCard}>
            <View style={styles.itemMain}>
              <Text style={styles.itemTitle}>
                {invoice.selectedPackage.package?.name || ''}
                </Text>
              <Text style={styles.itemSubtitle}>
                {invoice.selectedPackage.selectedPackageTier.name}
                </Text>
            </View>
            <Text style={styles.itemPrice}>{formatPrice(invoice.selectedPackage.selectedPackageTier.price)}</Text>
          </View>
        )}

        {/* Additional Items */}
        {invoice.additionalItems?.map((item, index) => (
          <SwipeableItemCard 
            key={`item-${index}`}
            title={item.item?.itemName || item.item?.name || 'Item'}
            subtitle={item.item?.unitType ? `Billed in ${item.item.unitType}` : 'Part / Fluid'}
            price={formatPrice((item.sellingPrice || 0) * (item.qty || 1))}
            onDelete={() => handleRemoveItem('ITEM', item.item?._id)}
            disabled={isPaid}
            quantity={item.qty}
            onUpdateQuantity={(newQty) => updateInvoiceItem(item.item?._id, item.sellingPrice, newQty)}
            unit={item.item?.unitType}
          />
        ))}

        {/* Additional Services */}
        {invoice.additionalServices?.map((service, index) => (
          <SwipeableItemCard 
            key={`service-${index}`}
            title={service.service?.serviceName || service.service?.name || 'Service'}
            subtitle={'Labor & Service'}
            price={formatPrice(service.charge)}
            onDelete={() => handleRemoveItem('SERVICE', service.service?._id)}
            disabled={isPaid}
          />
        ))}

        {/* Total Card */}
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>RUNNING TOTAL AMOUNT</Text>
            <Text style={styles.totalValue}>{formatPrice(invoice.totalPrice, 'LKR')}</Text>
          </View>
          <Ionicons name="receipt-outline" size={48} color="rgba(255,255,255,0.1)" />
        </View>

        {/* Selection Section (Matches AddInvoice Pattern) */}
        {!isPaid && (
          <View style={styles.selectorsSection}>
            <Text style={styles.sectionTitle}>ADD ADDITIONAL SERVICE</Text>
            <DropdownInput 
              value={null}
              options={availableServices.map(s => s.name)}
              placeholder="Select Additional Service"
              onSelect={(name) => {
                const s = availableServices.find(srv => srv.name === name);
                if (s) handleAddById('SERVICE', s._id || s.id, s.name, s.prices && s.prices[0]?.price);
              }}
              disabled={isProcessingAdd}
            />

            <View style={{ height: 16 }} />

            <Text style={styles.sectionTitle}>ADD ADDITIONAL PARTS & FLUIDS</Text>
            <DropdownInput 
              value={null}
              options={availableInventory.map(i => i.name)}
              placeholder="Select Inventory Item"
              onSelect={(name) => {
                const i = availableInventory.find(inv => inv.name === name);
                if (i) handleAddById('ITEM', i._id || i.id, i.name, i.sellingPrice);
              }}
              disabled={isProcessingAdd}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomPanel}>
        {isPaid && (
          <View style={styles.rowButtons}>
            <TouchableOpacity style={[styles.halfBtn, { marginRight: 12 }]} onPress={printQuote}>
              <Feather name="printer" size={16} color={colors.DARK} />
              <Text style={styles.halfBtnText}>Print Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.halfBtn} onPress={sharePDF}>
              <Feather name="share" size={16} color={colors.DARK} />
              <Text style={styles.halfBtnText}>Share PDF</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isPaid && (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleCompleteInvoice}>
            <Feather name="lock" size={18} color={colors.DARK} />
            <Text style={styles.primaryBtnText}>LOCK INVOICE & MARK PAID</Text>
          </TouchableOpacity>
        )}
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
  },
  selectorsSection: {
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: colors.LIGHT,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
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
