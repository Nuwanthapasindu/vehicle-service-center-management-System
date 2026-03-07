import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, Phone, Trash2, Box, ChevronDown, PlusCircle } from 'lucide-react-native';
import axios from 'axios';
import { styles } from './styles';

export default function EditSupplier({ supplier, onBack, API }) {
  // 1. Initialize state with existing supplier data
  const [companyName, setCompanyName] = useState(supplier?.companyName || '');
  const [agentName, setAgentName] = useState(supplier?.agentName || '');
  const [phones, setPhones] = useState(supplier?.companyMobile?.length ? supplier.companyMobile : ['']);
  const [selectedItems, setSelectedItems] = useState(supplier?.items?.length ? supplier.items : ['']);
  const [inventory, setInventory] = useState([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${API}/inventory`)
      .then(res => setInventory(res.data))
      .catch(err => console.log(err));
  }, []);

  // 2. Handle Update Action
  const handleUpdate = async () => {
    if (!companyName) {
      Alert.alert("Error", "Company Name is required");
      return;
    }

    // Clean up empty phone numbers and items
    const validPhones = phones.filter(p => p.trim() !== '');
    const validItems = selectedItems.filter(i => i.trim() !== '');

    setIsSubmitting(true);
    try {
      await axios.put(`${API}/suppliers/${supplier._id}`, {
        companyName,
        agentName,
        companyMobile: validPhones,
        items: validItems
      });
      Alert.alert("Success", "Supplier updated successfully!");
      onBack();
    } catch (error) {
      Alert.alert("Error", "Could not update supplier");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handle Delete Action
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this supplier? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            try {
              await axios.delete(`${API}/suppliers/${supplier._id}`);
              Alert.alert("Deleted", "Supplier removed.");
              onBack();
            } catch (error) {
              Alert.alert("Error", "Could not delete supplier");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><ChevronLeft color="#84CC16" size={32} /></TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT SUPPLIER</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.sectionTitleRow}>
          <Info size={18} color="#84CC16" />
          <Text style={styles.sectionTitleText}>Basic Information</Text>
        </View>
        <Text style={styles.label}>Company Name <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.formInput}
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="e.g. Shine Depot Supplies"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={[styles.label, { marginTop: 15 }]}>Agent Name</Text>
        <TextInput
          style={styles.formInput}
          value={agentName}
          onChangeText={setAgentName}
          placeholder="e.g. John Doe"
          placeholderTextColor="#9CA3AF"
        />

        <View style={[styles.sectionTitleRow, { marginTop: 25 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Phone size={18} color="#84CC16" />
            <Text style={styles.sectionTitleText}>Mobile Numbers</Text>
          </View>
          <TouchableOpacity onPress={() => setPhones([...phones, ''])}>
            <PlusCircle size={20} color="#84CC16" />
          </TouchableOpacity>
        </View>

        {phones.map((p, index) => (
          <View key={index} style={[styles.inputWithIconRow, { marginBottom: 10 }]}>
            <TextInput
              style={[styles.formInput, { flex: 1, marginBottom: 0 }]}
              placeholder={`Phone Number ${index + 1}`}
              value={p}
              onChangeText={(val) => {
                const newPhones = [...phones];
                newPhones[index] = val;
                setPhones(newPhones);
              }}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
            {phones.length > 1 && (
              <TouchableOpacity onPress={() => setPhones(phones.filter((_, i) => i !== index))} style={{ marginLeft: 10 }}>
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={[styles.sectionTitleRow, { marginTop: 25 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Box size={18} color="#84CC16" />
            <Text style={styles.sectionTitleText}>Supplied Items</Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedItems([...selectedItems, ''])}>
            <PlusCircle size={20} color="#84CC16" />
          </TouchableOpacity>
        </View>

        {selectedItems.map((itemValue, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <View style={[styles.inputWithIconRow, { marginBottom: 5 }]}>
              <TouchableOpacity
                style={[styles.dropdown, { flex: 1, height: 48, marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }]}
                onPress={() => setActiveDropdownIndex(activeDropdownIndex === index ? null : index)}
              >
                <Text style={[styles.dropdownText, { color: itemValue ? '#1F2937' : '#9CA3AF' }]}>
                  {itemValue ? itemValue : `Select Item ${index + 1}`}
                </Text>
                <ChevronDown size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {selectedItems.length > 1 && (
                <TouchableOpacity onPress={() => {
                  setSelectedItems(selectedItems.filter((_, i) => i !== index));
                  if (activeDropdownIndex === index) setActiveDropdownIndex(null);
                }} style={{ marginLeft: 10 }}>
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>

            {activeDropdownIndex === index && (
              <View style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, maxHeight: 150 }}>
                <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                  {inventory.map(inv => (
                    <TouchableOpacity
                      key={inv._id}
                      style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: itemValue === inv.name ? '#F4FCE3' : '#FFF' }}
                      onPress={() => {
                        const newItems = [...selectedItems];
                        newItems[index] = inv.name;
                        setSelectedItems(newItems);
                        setActiveDropdownIndex(null);
                      }}
                    >
                      <Text style={{ color: '#1F2937', fontWeight: itemValue === inv.name ? 'bold' : 'normal' }}>{inv.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {inventory.length === 0 && (
                    <Text style={{ padding: 12, color: '#9CA3AF' }}>No inventory items found.</Text>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { height: 160 }]}>
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={handleUpdate} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#1F2937" /> : <Text style={styles.saveSupplierBtnText}>Update Supplier</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveSupplierBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444', marginTop: 10 }]}
          onPress={handleDelete}
        >
          <Trash2 size={18} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={[styles.saveSupplierBtnText, { color: '#EF4444' }]}>Delete Supplier</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}