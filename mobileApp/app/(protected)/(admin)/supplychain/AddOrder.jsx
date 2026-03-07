import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, PlusCircle, Trash2, CheckCircle } from 'lucide-react-native';
import axios from 'axios';
import { styles } from './styles';

export default function AddOrder({ onBack, API }) {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [items, setItems] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch suppliers so we can choose who to order from
    axios.get(`${API}/suppliers`).then(res => setSuppliers(res.data)).catch(err => console.log(err));
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

  const handlePlaceOrder = async () => {
    if (!selectedSupplier) return Alert.alert("Error", "Please select a supplier.");
    if (items.length === 0) return Alert.alert("Error", "Add at least one item.");

    setIsSubmitting(true);
    
    const formattedItems = items.map(i => ({
      name: i.name || 'Unnamed Item',
      qty: parseFloat(i.qty) || 1,
      cost: parseFloat(i.price) || 0
    }));

    const totalCost = formattedItems.reduce((sum, item) => sum + (item.qty * item.cost), 0);

    const orderData = {
      supplier: selectedSupplier._id,
      items: formattedItems,
      totalCost: totalCost,
      status: 'Pending'
    };

    try {
      await axios.post(`${API}/orders`, orderData);
      Alert.alert("Success", "Order placed successfully!");
      onBack();
    } catch (error) {
      Alert.alert("Error", "Could not place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><ChevronLeft color="#84CC16" size={32} /></TouchableOpacity>
        <Text style={styles.headerTitle}>ADD NEW ORDER</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.smallLabelCaps}>SELECT SUPPLIER</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {suppliers.map(sup => (
            <TouchableOpacity 
              key={sup._id} 
              style={[styles.addItemBtn, { marginRight: 10, backgroundColor: selectedSupplier?._id === sup._id ? '#D9F99D' : '#FFF' }]}
              onPress={() => setSelectedSupplier(sup)}
            >
              <Text style={{ color: '#1F2937' }}>{sup.companyName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.sectionTitleRow, { justifyContent: 'space-between', marginBottom: 15 }]}>
          <Text style={styles.smallLabelCaps}>ORDER ITEMS</Text>
          <TouchableOpacity style={styles.addItemBtn} onPress={handleAddNewItemLine}>
            <PlusCircle size={16} color="#84CC16" />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {items.map(item => (
          <View key={item.id} style={styles.orderItemCard}>
            <View style={styles.itemHeader}>
              <TextInput 
                style={[styles.formInput, { flex: 1, marginBottom: 0, height: 40 }]} 
                placeholder="Item Name (e.g. Engine Oil)" 
                value={item.name}
                onChangeText={(val) => handleUpdateItem(item.id, 'name', val)}
              />
              <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={{ marginLeft: 10, marginTop: 10 }}>
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={handlePlaceOrder} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#1F2937" /> : (
            <>
              <CheckCircle size={20} color="#1F2937" style={{marginRight: 8}} />
              <Text style={styles.saveSupplierBtnText}>PLACE ORDER</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}