import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, PlusCircle, Trash2, CheckCircle, X, Search } from 'lucide-react-native';
import { ORDER_ITEMS } from './data';
import { styles } from './styles';

export default function AddOrder({ selectedSupplier, onBack }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [items, setItems] = useState(ORDER_ITEMS); // Manage items in state

  const handleUpdateItem = (id, field, value) => {
    const updated = items.map(item => item.id === id ? { ...item, [field]: value } : item);
    setItems(updated);
  };

  const handlePlaceOrder = () => {
    const orderData = {
      supplier: selectedSupplier?.name || "Manual Entry",
      items: items,
      totalCost: items.reduce((sum, i) => sum + (parseFloat(i.qty) * parseFloat(i.price)), 0),
      status: 'PENDING'
    };
    
    console.log("Saving Order:", orderData);
    Alert.alert("Order Placed", "Your order has been sent to the supplier.");
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, modalVisible && { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}><ChevronLeft color="#84CC16" size={32} /></TouchableOpacity>
          <Text style={styles.headerTitle}>ADD NEW ORDER</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.smallLabelCaps}>SELECT SUPPLIER</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{selectedSupplier?.name || 'Search for a vendor...'}</Text>
            <ChevronDown size={20} color="#9CA3AF" />
          </View>

          <View style={styles.sectionHeaderOrder}>
            <Text style={styles.smallLabelCaps}>INVENTORY ITEMS</Text>
            <TouchableOpacity style={styles.addItemBtn} onPress={() => setModalVisible(true)}>
              <PlusCircle size={16} color="#84CC16" />
              <Text style={styles.addItemText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          {items.map(item => (
            <View key={item.id} style={styles.orderItemCard}>
              <View style={styles.itemHeader}>
                <View><Text style={styles.itemName}>{item.name}</Text><Text style={styles.skuText}>SKU: {item.sku}</Text></View>
                <TouchableOpacity onPress={() => setItems(items.filter(i => i.id !== item.id))}>
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <View style={{ flex: 1, marginRight: 10 }}>
                   <Text style={styles.tinyLabel}>QUANTITY</Text>
                   <TextInput 
                     style={styles.formInputSmall} 
                     value={item.qty} 
                     onChangeText={(val) => handleUpdateItem(item.id, 'qty', val)}
                     keyboardType="numeric" 
                   />
                </View>
                <View style={{ flex: 1 }}>
                   <Text style={styles.tinyLabel}>UNIT PRICE (Rs.)</Text>
                   <TextInput 
                     style={styles.formInputSmall} 
                     value={item.price} 
                     onChangeText={(val) => handleUpdateItem(item.id, 'price', val)}
                     keyboardType="numeric" 
                   />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveSupplierBtn} onPress={handlePlaceOrder}>
            <CheckCircle size={20} color="#1F2937" style={{marginRight: 8}} />
            <Text style={styles.saveSupplierBtnText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* ... Modal code remains same ... */}
    </SafeAreaView>
  );
}