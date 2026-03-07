import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Phone, PlusCircle, Trash2, Box, ChevronDown } from 'lucide-react-native';
import axios from 'axios';
import { styles } from './styles';

export default function AddSupplier({ onBack, API }) {
  const [companyName, setCompanyName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [phones, setPhones] = useState(['']);
  const [selectedItems, setSelectedItems] = useState(['']); // array of inventory item names (strings)
  const [inventory, setInventory] = useState([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${API}/inventory`)
      .then(res => setInventory(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSave = async () => {
    if (!companyName) return Alert.alert("Error", "Company Name is required");

    // Clean up empty phone numbers and items
    const validPhones = phones.filter(p => p.trim() !== '');
    const validItems = selectedItems.filter(i => i.trim() !== '');

    setIsSubmitting(true);
    try {
      await axios.post(`${API}/suppliers`, {
        companyName,
        agentName,
        companyMobile: validPhones,
        items: validItems
      });
      Alert.alert("Success", "Supplier saved successfully!");
      onBack();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.error || "Failed to save supplier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><ChevronLeft color="#84CC16" size={32} /></TouchableOpacity>
        <Text style={styles.headerTitle}>ADD SUPPLIER</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Company Name <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={styles.formInput}
          placeholder="e.g. AMW Genuine Parts"
          value={companyName}
          onChangeText={setCompanyName}
          placeholderTextColor="#9CA3AF"
        />

        <Text style={[styles.label, { marginTop: 15 }]}>Agent Name</Text>
        <TextInput
          style={styles.formInput}
          placeholder="e.g. Anura Perera"
          value={agentName}
          onChangeText={setAgentName}
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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={handleSave} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#1F2937" /> : <Text style={styles.saveSupplierBtnText}>Save Supplier</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}