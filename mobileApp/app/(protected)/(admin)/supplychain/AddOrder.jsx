import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, PlusCircle, Trash2, CheckCircle, Save } from 'lucide-react-native';
import { styles } from './styles';

export default function AddOrder({ onBack }) {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const dummySuppliers = [
    { _id: '1', companyName: 'AMW Genuine Parts' },
    { _id: '2', companyName: 'Shine Depot Supplies' }
  ];
  const dummyInventory = ['Brake Pads', 'Engine Oil', 'Oil Filter', 'Spark Plugs'];

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
          <View style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderTopWidth: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 15 }}>
            {dummySuppliers.map(sup => (
              <TouchableOpacity key={sup._id} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }} onPress={() => { setSelectedSupplier(sup); setShowSupplierDropdown(false); }}>
                <Text style={{ color: '#1F2937' }}>{sup.companyName}</Text>
              </TouchableOpacity>
            ))}
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
                  {dummyInventory.map((inv, index) => (
                    <TouchableOpacity key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }} onPress={() => { handleUpdateItem(item.id, 'name', inv); setActiveDropdownId(null); }}>
                      <Text style={{ color: '#1F2937' }}>{inv}</Text>
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
        {/* Dummy buttons */}
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={onBack}>
          <CheckCircle size={20} color="#1F2937" style={{ marginRight: 8 }} />
          <Text style={styles.saveSupplierBtnText}>PLACE ORDER</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.saveSupplierBtn, { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB', marginTop: 10 }]} onPress={onBack}>
          <Save size={20} color="#374151" style={{ marginRight: 8 }} />
          <Text style={[styles.saveSupplierBtnText, { color: '#374151' }]}>SAVE AS DRAFT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}