import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, CheckCircle2, Send } from 'lucide-react-native';
import axios from 'axios';
import { styles } from './styles';

export default function EditOrder({ order, onBack, API }) {
  const isPending = order?.status === 'Sent'; 
  const isDraft = order?.status === 'Draft';

  const handleMarkAsReceived = () => {
    Alert.alert("Confirm Receipt", "This will add items to your inventory. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm", onPress: async () => {
          try {
            await axios.put(`${API}/orders/${order._id}/receive`);
            Alert.alert("Success", "Inventory updated successfully!");
            onBack();
          } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Could not mark as received.");
          }
        }
      }
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete Order", "Are you sure you want to completely remove this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Delete", style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API}/orders/${order._id}`);
            Alert.alert("Deleted", "Order removed successfully.");
            onBack();
          } catch (error) {
            Alert.alert("Error", "Could not delete order.");
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><ChevronLeft color="#84CC16" size={32} /></TouchableOpacity>
        <Text style={styles.headerTitle}>ORDER DETAILS</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.tinyLabel}>SUPPLIER INFO</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{order?.supplierId?.companyName || 'Unknown Supplier'}</Text>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Status: {order?.status}</Text>
        </View>

        <Text style={styles.tinyLabel}>ORDER ITEMS</Text>
        {order?.items?.map(item => (
          <View key={item._id} style={styles.orderItemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.tinyLabel}>QTY: {item.qty} {item.unitType}</Text>
              <Text style={styles.tinyLabel}>COST: Rs.{item.cost}</Text>
            </View>
          </View>
        ))}

        <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total: Rs. {order?.totalCost || 0}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 20 }]}>
        {isPending ? (
          <View>
            <TouchableOpacity style={styles.saveSupplierBtn} onPress={handleMarkAsReceived}>
              <Text style={styles.saveSupplierBtnText}>MARK AS RECEIVED</Text>
              <CheckCircle2 size={20} color="#1F2937" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.saveSupplierBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444', marginTop: 10 }]} 
              onPress={handleDelete}
            >
              <Trash2 size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={[styles.saveSupplierBtnText, { color: '#EF4444' }]}>DELETE ORDER</Text>
            </TouchableOpacity>
          </View>
        ) : isDraft ? (
          <View>

            <TouchableOpacity 
              style={[styles.saveSupplierBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444' }]} 
              onPress={handleDelete}
            >
              <Trash2 size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={[styles.saveSupplierBtnText, { color: '#EF4444' }]}>DELETE ORDER</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.saveSupplierBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444' }]} onPress={handleDelete}>
            <Trash2 size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={[styles.saveSupplierBtnText, { color: '#EF4444' }]}>DELETE RECORD</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}