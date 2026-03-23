import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, CheckCircle2 } from 'lucide-react-native';
import { styles } from './styles';

export default function EditOrder({ order, onBack }) {
  const displayOrder = order || {
    status: 'Sent',
    supplierId: { companyName: 'AMW Genuine Parts' },
    totalCost: 1500,
    items: [
      { _id: '1', name: 'Brake Pads', qty: 2, unitType: 'Nos', cost: 1000 },
      { _id: '2', name: 'Engine Oil', qty: 1, unitType: 'Nos', cost: 500 }
    ]
  };

  const isPending = displayOrder?.status === 'Sent'; 
  const isDraft = displayOrder?.status === 'Draft';

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
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{displayOrder?.supplierId?.companyName || 'Unknown Supplier'}</Text>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Status: {displayOrder?.status}</Text>
        </View>

        <Text style={styles.tinyLabel}>ORDER ITEMS</Text>
        {displayOrder?.items?.map(item => (
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
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total: Rs. {displayOrder?.totalCost || 0}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 20 }]}>
        {isPending ? (
          <View>
            <TouchableOpacity style={styles.saveSupplierBtn} onPress={onBack}>
              <Text style={styles.saveSupplierBtnText}>MARK AS RECEIVED</Text>
              <CheckCircle2 size={20} color="#1F2937" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveSupplierBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444', marginTop: 10 }]} onPress={onBack}>
              <Trash2 size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={[styles.saveSupplierBtnText, { color: '#EF4444' }]}>DELETE ORDER</Text>
            </TouchableOpacity>
          </View>
        ) : isDraft ? (
          <View>
            <TouchableOpacity style={[styles.saveSupplierBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444' }]} onPress={onBack}>
              <Trash2 size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={[styles.saveSupplierBtnText, { color: '#EF4444' }]}>DELETE ORDER</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.saveSupplierBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444' }]} onPress={onBack}>
            <Trash2 size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={[styles.saveSupplierBtnText, { color: '#EF4444' }]}>DELETE RECORD</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}