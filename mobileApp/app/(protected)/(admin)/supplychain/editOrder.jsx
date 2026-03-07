import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  ChevronDown, 
  PlusCircle, 
  Trash2, 
  Factory, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react-native';
import { styles } from './styles';

export default function EditOrder({ order, onBack }) {
  // 1. Determine the view mode based on order status
  const isPending = order?.status?.toUpperCase() === 'PENDING';
  
  // 2. State for items (Loaded from the selected order)
  const [items, setItems] = useState([
    { id: '1', name: 'Synthetic Oil 5W-30', sku: 'SYN-5W30-01', qty: '12', price: '24.99' },
    { id: '2', name: 'Ceramic Brake Pads (Front)', sku: 'BRK-CER-F88', qty: '5', price: '89.50' },
  ]);

  const handleUpdateItem = (id, field, value) => {
    const updated = items.map(item => item.id === id ? { ...item, [field]: value } : item);
    setItems(updated);
  };

  const handleMarkAsReceived = () => {
    Alert.alert(
      "Confirm Receipt",
      "This will add these items to your current inventory stock. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: () => {
            console.log("Updating Status to RECEIVED in DB...");
            Alert.alert("Success", "Inventory updated successfully!");
            onBack();
          } 
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert("Delete Order", "Are you sure you want to remove this record?", [
      { text: "No" },
      { text: "Yes, Delete", onPress: onBack, style: 'destructive' }
    ]);
  };

  // --- VIEW: MARK AS RECEIVED (For Pending Orders) ---
  const renderReceivedView = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><ChevronLeft color="#84CC16" size={32} /></TouchableOpacity>
        <Text style={styles.headerTitle}>PO DETAILS</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.orderItemCard, { marginBottom: 20 }]}>
          <View style={[styles.badge, { backgroundColor: '#FFFBEB', alignSelf: 'flex-start', paddingHorizontal: 10 }]}>
            <Text style={[styles.badgeText, { color: '#D97706' }]}>PENDING DELIVERY</Text>
          </View>
          <View style={[styles.infoRow, { marginTop: 15 }]}>
            <Factory size={18} color="#84CC16" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.tinyLabel}>Supplier</Text>
              <Text style={[styles.itemName, { fontSize: 16 }]}>{order?.name || "AMW Genuine Parts"}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.smallLabelCaps}>CONFIRM RECEIVED QUANTITIES</Text>
        {items.map(item => (
          <View key={item.id} style={styles.orderItemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.skuText}>SKU: {item.sku}</Text>
            <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', marginTop: 15, paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.tinyLabel}>RECEIVED QTY</Text>
              <TextInput 
                style={[styles.formInputSmall, { width: 80, textAlign: 'center' }]} 
                value={item.qty} 
                keyboardType="numeric"
                onChangeText={(val) => handleUpdateItem(item.id, 'qty', val)}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={handleMarkAsReceived}>
          <Text style={styles.saveSupplierBtnText}>MARK AS RECEIVED</Text>
          <CheckCircle2 size={20} color="#1F2937" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </>
  );

  // --- VIEW: EDIT DETAILS (For Completed/Existing Orders) ---
  const renderEditView = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><ChevronLeft color="#84CC16" size={32} /></TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT ORDER</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeaderOrder}>
          <Text style={styles.smallLabelCaps}>ORDERED ITEMS</Text>
        </View>

        {items.map(item => (
          <View key={item.id} style={styles.orderItemCard}>
            <View style={styles.itemHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.skuText}>SKU: {item.sku}</Text>
              </View>
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
                  keyboardType="numeric" 
                  onChangeText={(val) => handleUpdateItem(item.id, 'qty', val)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tinyLabel}>PRICE (Rs.)</Text>
                <TextInput 
                  style={styles.formInputSmall} 
                  value={item.price} 
                  keyboardType="numeric" 
                  onChangeText={(val) => handleUpdateItem(item.id, 'price', val)}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { height: 160 }]}>
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={() => { Alert.alert("Saved", "Changes updated."); onBack(); }}>
          <Text style={styles.saveSupplierBtnText}>UPDATE ORDER</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.saveSupplierBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444', marginTop: 10 }]} 
          onPress={handleDelete}
        >
          <Trash2 size={18} color="#EF4444" style={{marginRight: 8}} />
          <Text style={[styles.saveSupplierBtnText, { color: '#EF4444' }]}>Delete Order</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isPending ? renderReceivedView() : renderEditView()}
    </SafeAreaView>
  );
}