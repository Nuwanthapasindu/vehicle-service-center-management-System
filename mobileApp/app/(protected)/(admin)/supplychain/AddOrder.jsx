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
    // Fetch suppliers so we can choose who to order from
    axios.get(`${API}/suppliers`).then(res => setSuppliers(res.data)).catch(err => console.log(err));
    // Fetch inventory
    axios.get(`${API}/inventory`).then(res => setInventory(res.data)).catch(err => console.log(err));
  }, []);

  const handleAddNewItemLine = () => {
    setItems([...items, { id: Date.now().toString(), name: '', qty: '1', price: '0' }]);
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

    const invalidItems = items.filter(i => !i.itemId);
    if (invalidItems.length > 0) return Alert.alert("Error", "Please select an inventory item for all rows.");

    setIsSubmitting(true);

    const formattedItems = items.map(i => ({
      itemId: i.itemId,
      qty: parseFloat(i.qty) || 1,
      unitType: i.unitType || 'Count', // Fallback
      cost: parseFloat(i.price) || 0
    }));

    const totalCost = formattedItems.reduce((sum, item) => sum + (item.qty * item.cost), 0);

    const orderData = {
      supplier: selectedSupplier._id,
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
      const serverErr = error.response?.data?.error || error.response?.data?.message;
      Alert.alert("Error", serverErr ? `Server: ${serverErr}` : "Could not place order.");
      setIsSubmitting(false);
    }
  };

  const generatePDF = async (orderData, orderId) => {
    try {
      const htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #84CC16;">Purchase Order Draft</h1>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Supplier:</strong> ${selectedSupplier.companyName}</p>
            <p><strong>Status:</strong> Draft</p>
            <hr />
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="background-color: #f3f4f6; border-bottom: 2px solid #ddd;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Cost</th>
              </tr>
              ${items.map(i => `<tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${i.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${i.qty}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">Rs. ${i.price}</td>
              </tr>`).join('')}
            </table>
            <h3 style="text-align: right; margin-top: 20px;">Total: Rs. ${orderData.totalCost}</h3>
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
              <Text style={styles.tinyLabel}>SELECT INVENTORY ITEM:</Text>
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
                <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                  {inventory.filter(inv => selectedSupplier ? (selectedSupplier.items || []).some(sItem => sItem?.toLowerCase() === inv.name?.toLowerCase()) : true).map(inv => (
                    <TouchableOpacity
                      key={inv._id}
                      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: item.itemId === inv._id ? '#F4FCE3' : '#FFF' }}
                      onPress={() => {
                        const updatedItems = items.map(i => i.id === item.id ? {
                          ...i,
                          itemId: inv._id,
                          name: inv.name,
                          unitType: inv.unitType,
                          price: inv.buyingPrice?.toString() || '0'
                        } : i);
                        setItems(updatedItems);
                        setActiveDropdownId(null);
                      }}
                    >
                      <Text style={{ color: '#1F2937', fontWeight: item.itemId === inv._id ? 'bold' : 'normal' }}>{inv.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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