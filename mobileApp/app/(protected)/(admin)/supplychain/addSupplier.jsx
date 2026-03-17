import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Phone, PlusCircle, Trash2, Box } from 'lucide-react-native';
import axios from 'axios';
import { styles } from './styles';

export default function AddSupplier({ onBack, API }) {
  const [companyName, setCompanyName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [phones, setPhones] = useState(['']);
  const [selectedItems, setSelectedItems] = useState(['']); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!companyName) return Alert.alert("Error", "Company Name is required");

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

        {/* SUPPLIED ITEMS SECTION */}
        <View style={[styles.sectionTitleRow, { marginTop: 25, marginBottom: 15 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Box size={18} color="#84CC16" />
            <Text style={styles.sectionTitleText}>Supplied Items</Text>
          </View>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4FCE3', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#D9F99D' }} 
            onPress={() => setSelectedItems([...selectedItems, ''])}
          >
            <PlusCircle size={18} color="#84CC16" />
            <Text style={{ color: '#84CC16', fontWeight: 'bold', marginLeft: 5, fontSize: 12 }}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {selectedItems.map((itemValue, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>ITEM {index + 1}</Text>
                <View style={styles.searchSection}>
                  <Box size={20} color="#9CA3AF" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Type item name (e.g. Brake Pads)"
                    value={itemValue}
                    onChangeText={(text) => {
                      const newItems = [...selectedItems];
                      newItems[index] = text;
                      setSelectedItems(newItems);
                    }}
                  />
                </View>
              </View>

              {selectedItems.length > 1 && (
                <TouchableOpacity 
                  style={{ padding: 10, marginTop: 20, marginLeft: 5 }}
                  onPress={() => {
                    const newItems = selectedItems.filter((_, i) => i !== index);
                    setSelectedItems(newItems);
                  }}
                >
                  <Trash2 size={24} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
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