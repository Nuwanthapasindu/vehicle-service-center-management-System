import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, PlusCircle, Trash2, CheckCircle, Save } from 'lucide-react-native';
import axios from 'axios';
import { Alert, ActivityIndicator } from 'react-native';
import { styles } from './styles';

export default function AddOrder({ onBack, API }) {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredInventory = React.useMemo(() => {
    if (!selectedSupplier || !selectedSupplier.items || selectedSupplier.items.length === 0) return inventoryList;
    return inventoryList.filter(inv => selectedSupplier.items.includes(inv.name));
  }, [inventoryList, selectedSupplier]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const supRes = await axios.get(`${API}/suppliers`);
        setSuppliers(supRes.data?.payload?.suppliers || []);
        const invRes = await axios.get(`${API}/v1/inventory`);
        setInventoryList(invRes.data?.payload?.data || []);
      } catch (err) {
        console.error("Failed fetching data for AddOrder:", err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (status) => {
    if (!selectedSupplier) return Alert.alert("Error", "Please select a supplier");
    if (items.length === 0) return Alert.alert("Error", "Please add at least one item");
    
    for (let i of items) {
      if (!i.itemId) return Alert.alert("Error", "Please select a valid inventory item for all rows");
      if (!i.qty || Number(i.qty) <= 0) return Alert.alert("Error", "Quantity must be greater than 0");
    }

    const payload = {
      supplier: selectedSupplier._id,
      items: items.map(i => ({
         itemId: i.itemId,
         qty: Number(i.qty),
         unitType: i.unitType || 'Nos',
         cost: Number(i.price)
      })),
      status: status
    };

    setIsSubmitting(true);
    try {
      await axios.post(`${API}/purchaseOrders`, payload);
      Alert.alert("Success", "Purchase Order created successfully!");
      onBack();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.payload?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewItemLine = () => {
    setItems([...items, { id: Date.now().toString(), name: '', qty: '1', price: '0' }]);
  };

  const handleUpdateItemBatch = (id, updates) => {
    setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
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
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowSupplierDropdown(!showSupplierDropdown)}>
          <Text style={styles.dropdownText}>{selectedSupplier ? selectedSupplier.companyName : 'Choose a supplier...'}</Text>
          <ChevronDown size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {showSupplierDropdown && (
          <View style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderTopWidth: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 15, maxHeight: 150 }}>
            <ScrollView nestedScrollEnabled={true}>
            {suppliers.map(sup => (
              <TouchableOpacity key={sup._id} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }} onPress={() => { setSelectedSupplier(sup); setShowSupplierDropdown(false); }}>
                <Text style={{ color: '#1F2937' }}>{sup.companyName}</Text>
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
        )}

        <View style={[styles.sectionTitleRow, { justifyContent: 'space-between', marginBottom: 15, marginTop: 20 }]}>
          <Text style={styles.smallLabelCaps}>ORDER ITEMS</Text>
          <TouchableOpacity style={styles.addItemBtn} onPress={handleAddNewItemLine}>
            <PlusCircle size={16} color="#84CC16" />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {items.map(item => (
          <View key={item.id} style={styles.orderItemCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.tinyLabel}>SELECT ITEM</Text>
              <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.dropdown, { height: 40, marginBottom: 10 }]} onPress={() => setActiveDropdownId(activeDropdownId === item.id ? null : item.id)}>
              <Text style={styles.dropdownText}>{item.name ? item.name : 'Choose item...'}</Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {activeDropdownId === item.id && (
              <View style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 15, maxHeight: 150 }}>
                <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                  {filteredInventory.map((inv, index) => (
                    <TouchableOpacity key={inv._id || index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }} onPress={() => { 
                      handleUpdateItemBatch(item.id, {
                        name: inv.name,
                        itemId: inv._id,
                        unitType: inv.unitType,
                        price: (inv.buyingPrice || 0).toString()
                      }); 
                      setActiveDropdownId(null); 
                    }}>
                      <Text style={{ color: '#1F2937' }}>{inv.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {filteredInventory.length === 0 && (
                    <View style={{ padding: 10 }}>
                      <Text style={{ color: '#9CA3AF' }}>No supplies match this supplier...</Text>
                    </View>
                  )}
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
        <TouchableOpacity style={styles.saveSupplierBtn} disabled={isSubmitting} onPress={() => handleSave('Sent')}>
          {isSubmitting ? <ActivityIndicator color="#1F2937" /> : (
            <>
              <CheckCircle size={20} color="#1F2937" style={{ marginRight: 8 }} />
              <Text style={styles.saveSupplierBtnText}>PLACE ORDER</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.saveSupplierBtn, { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB', marginTop: 10 }]} disabled={isSubmitting} onPress={() => handleSave('Draft')}>
          {isSubmitting ? <ActivityIndicator color="#374151" /> : (
            <>
              <Save size={20} color="#374151" style={{ marginRight: 8 }} />
              <Text style={[styles.saveSupplierBtnText, { color: '#374151' }]}>SAVE AS DRAFT</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}