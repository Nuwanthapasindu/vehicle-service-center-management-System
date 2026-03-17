import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, PlusCircle, Trash2, CheckCircle, Save } from 'lucide-react-native';
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { styles } from './styles';

export default function AddOrder({ onBack, API }) {
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  useEffect(() => {
    axios.get(`${API}/suppliers`).then(res => setSuppliers(res.data)).catch(err => console.log(err));
    axios.get(`${API}/inventory`).then(res => setInventory(res.data)).catch(err => console.log(err));
  }, []);

  const handleAddNewItemLine = () => {
    setItems([...items, { id: Date.now().toString(), name: '', qty: '1', price: '0', itemId: null }]);
  };

  const handleUpdateItem = (id, field, value) => {
    const updated = items.map(item => item.id === id ? { ...item, [field]: value } : item);
    setItems(updated);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handlePlaceOrder = async (status = 'Sent') => {
    if (!selectedSupplier) return Alert.alert("Error", "Please select a supplier.");
    if (items.length === 0) return Alert.alert("Error", "Add at least one item.");

    const invalidItems = items.filter(i => !i.name);
    if (invalidItems.length > 0) return Alert.alert("Error", "Please select an item for all rows.");

    setIsSubmitting(true);

    const formattedItems = items.map(i => {
      const qty = parseFloat(i.qty) || 1;
      const price = parseFloat(i.price) || 0;
      
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(i.itemId);

      const itemPayload = {
        name: i.name,
        qty: qty,
        unitType: i.unitType || 'Nos',
        price: price, 
        cost: qty * price 
      };

      if (isValidMongoId) {
        itemPayload.inventoryId = i.itemId;
      }

      return itemPayload;
    });

    const totalCost = formattedItems.reduce((sum, item) => sum + item.cost, 0);

    const orderData = {
      supplierId: selectedSupplier._id,
      items: formattedItems,
      totalCost: totalCost,
      status: status
    };

    try {
      const resp = await axios.post(`${API}/orders`, orderData);
      if (status === 'Draft') {
        generatePDF(orderData, resp.data._id);
      } else {
        Alert.alert("Success", "Order placed successfully!");
        onBack();
      }
    } catch (error) {
      console.log('Order Error:', error?.response?.data || error.message);
      Alert.alert("Error", "Could not place order.");
      setIsSubmitting(false);
    }
  };

  const generatePDF = async (orderData, orderId) => {
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #84CC16; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 32px; font-weight: bold; color: #1F2937; margin: 0; letter-spacing: 1px; }
            .draft-badge { display: inline-block; background-color: #FEF3C7; color: #D97706; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 14px; text-transform: uppercase; margin-top: 10px; border: 1px solid #FDE68A; }
            .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .info-block { width: 45%; }
            .info-block h3 { margin-top: 0; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
            .info-text { font-size: 15px; color: #1F2937; margin: 4px 0; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #F9FAFB; color: #4B5563; font-weight: 600; text-transform: uppercase; font-size: 12px; padding: 14px 12px; text-align: left; border-bottom: 2px solid #E5E7EB; border-top: 1px solid #E5E7EB; }
            td { padding: 14px 12px; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #374151; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-section { display: flex; justify-content: flex-end; margin-top: 20px; }
            .total-box { width: 350px; background-color: #F9FAFB; padding: 20px; border-radius: 8px; border: 1px solid #E5E7EB; }
            .total-row { display: flex; justify-content: space-between; font-size: 15px; color: #4B5563; margin-bottom: 8px; }
            .total-row.grand-total { font-weight: bold; font-size: 20px; color: #111827; border-top: 2px solid #D1D5DB; padding-top: 15px; margin-top: 10px; margin-bottom: 0; }
            .footer { margin-top: 60px; text-align: center; color: #9CA3AF; font-size: 12px; border-top: 1px solid #E5E7EB; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">PURCHASE ORDER</h1>
              <div class="draft-badge">Document Draft</div>
            </div>
            <div class="text-right">
              <p class="info-text"><strong>Order No:</strong> #${orderId.toString().slice(-6).toUpperCase()}</p>
              <p class="info-text"><strong>Date:</strong> ${currentDate}</p>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-block">
              <h3>Supplier Information</h3>
              <p class="info-text"><strong>${selectedSupplier.companyName}</strong></p>
              ${selectedSupplier.email ? `<p class="info-text">${selectedSupplier.email}</p>` : ''}
              ${selectedSupplier.phone || selectedSupplier.contactNumber ? `<p class="info-text">${selectedSupplier.phone || selectedSupplier.contactNumber}</p>` : ''}
            </div>
            <div class="info-block" style="text-align: right;">
              <h3>Order Details</h3>
              <p class="info-text"><strong>Status:</strong> Draft</p>
              <p class="info-text"><strong>System ID:</strong> ${orderId}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th width="5%">#</th>
                <th width="45%">Item Description</th>
                <th width="15%" class="text-center">Quantity</th>
                <th width="15%" class="text-right">Unit Price</th>
                <th width="20%" class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((i, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td><strong>${i.name}</strong></td>
                  <td class="text-center">${i.qty} ${i.unitType || 'Nos'}</td>
                  <td class="text-right">Rs. ${Number(i.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td class="text-right">Rs. ${(Number(i.qty) * Number(i.price)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-box">
              <div class="total-row grand-total">
                <span>Grand Total</span>
                <span>Rs. ${Number(orderData.totalCost).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This is a system generated purchase order draft. Please review before final submission.</p>
          </div>
        </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
      Alert.alert("Success", "Draft saved and PDF downloaded successfully!");
      onBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not generate PDF");
      onBack();
    }
  };

  const getAvailableItemsForSupplier = () => {
    if (!selectedSupplier) return [];

    if (selectedSupplier.items && selectedSupplier.items.length > 0) {
      return selectedSupplier.items;
    }
    if (selectedSupplier.suppliedItems && selectedSupplier.suppliedItems.length > 0) {
      return selectedSupplier.suppliedItems;
    }

    return inventory.filter(inv => {
      const invSupId = inv.supplierId?._id || inv.supplierId || inv.supplier?._id || inv.supplier;
      return invSupId === selectedSupplier._id;
    });
  };

  const availableItemsList = getAvailableItemsForSupplier();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><ChevronLeft color="#84CC16" size={32} /></TouchableOpacity>
        <Text style={styles.headerTitle}>ADD NEW ORDER</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.smallLabelCaps}>SELECT SUPPLIER</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowSupplierDropdown(!showSupplierDropdown)}
        >
          <Text style={styles.dropdownText}>
            {selectedSupplier ? selectedSupplier.companyName : 'Choose a supplier...'}
          </Text>
          <ChevronDown size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {showSupplierDropdown && (
          <View style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderTopWidth: 0, borderRadius: 8, borderTopLeftRadius: 0, borderTopRightRadius: 0, marginBottom: 15 }}>
            {suppliers.map(sup => (
              <TouchableOpacity
                key={sup._id}
                style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: selectedSupplier?._id === sup._id ? '#F4FCE3' : '#FFF' }}
                onPress={() => {
                  setSelectedSupplier(sup);
                  setShowSupplierDropdown(false);
                  setItems([]); 
                }}
              >
                <Text style={{ color: '#1F2937' }}>{sup.companyName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[styles.sectionTitleRow, { justifyContent: 'space-between', marginBottom: 15 }]}>
          <Text style={styles.smallLabelCaps}>ORDER ITEMS</Text>
          <TouchableOpacity style={styles.addItemBtn} onPress={handleAddNewItemLine}>
            <PlusCircle size={16} color="#84CC16" />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {items.map(item => (
          <View key={item.id} style={styles.orderItemCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.tinyLabel}>SELECT ITEM FROM SUPPLIER:</Text>
              <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.dropdown, { height: 40, marginBottom: 10 }]}
              onPress={() => setActiveDropdownId(activeDropdownId === item.id ? null : item.id)}
            >
              <Text style={styles.dropdownText}>
                {item.name ? item.name : 'Choose item...'}
              </Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {activeDropdownId === item.id && (
              <View style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 15, maxHeight: 150 }}>
                {!selectedSupplier ? (
                  <Text style={{ padding: 12, color: '#EF4444', fontWeight: 'bold' }}>⚠️ Please select a supplier first!</Text>
                ) : (
                  <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                    {availableItemsList.map((inv, index) => {
                      const isString = typeof inv === 'string';
                      const itemName = isString ? inv : (inv.itemName || inv.name || inv.item || inv.title || inv.productName || `Item ${index + 1}`);
                      const itemPrice = isString ? '0' : (inv.unitPrice || inv.price || inv.buyingPrice || inv.cost || '0');
                      const itemId = isString ? `string_item_${index}` : (inv._id || inv.itemId || inv.id || `no_id_item_${index}`);

                      return (
                        <TouchableOpacity
                          key={itemId}
                          style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: item.itemId === itemId ? '#F4FCE3' : '#FFF' }}
                          onPress={() => {
                            const updatedItems = items.map(i => i.id === item.id ? {
                              ...i,
                              itemId: itemId,
                              name: itemName,
                              unitType: inv.unitType || 'Nos',
                              price: itemPrice.toString()
                            } : i);
                            setItems(updatedItems);
                            setActiveDropdownId(null);
                          }}
                        >
                          <Text style={{ color: '#1F2937', fontWeight: item.itemId === itemId ? 'bold' : 'normal' }}>
                            {itemName} {itemPrice !== '0' ? `- Rs. ${itemPrice}` : ''}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                    {availableItemsList.length === 0 && (
                       <Text style={{ padding: 12, color: '#9CA3AF' }}>No items found for this supplier.</Text>
                    )}
                  </ScrollView>
                )}
              </View>
            )}

            <View style={styles.inputRow}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.tinyLabel}>QUANTITY</Text>
                <TextInput style={styles.formInputSmall} value={item.qty} onChangeText={(val) => handleUpdateItem(item.id, 'qty', val)} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tinyLabel}>UNIT PRICE (Rs.)</Text>
                <TextInput style={styles.formInputSmall} value={item.price} onChangeText={(val) => handleUpdateItem(item.id, 'price', val)} keyboardType="numeric" />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { height: 160, justifyContent: 'center' }]}>
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={() => handlePlaceOrder('Sent')} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#1F2937" /> : (
            <>
              <CheckCircle size={20} color="#1F2937" style={{ marginRight: 8 }} />
              <Text style={styles.saveSupplierBtnText}>PLACE ORDER</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveSupplierBtn, { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB', marginTop: 10 }]}
          onPress={() => handlePlaceOrder('Draft')}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#1F2937" /> : (
            <>
              <Save size={20} color="#374151" style={{ marginRight: 8 }} />
              <Text style={[styles.saveSupplierBtnText, { color: '#374151' }]}>SAVE AS DRAFT (PDF)</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}