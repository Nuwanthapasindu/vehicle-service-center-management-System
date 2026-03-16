import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, Phone, Trash2, Box, PlusCircle } from 'lucide-react-native';
import axios from 'axios';
import { styles } from './styles';

export default function EditSupplier({ supplier, onBack, API }) {
  const [companyName, setCompanyName] = useState(supplier?.companyName || '');
  const [agentName, setAgentName] = useState(supplier?.agentName || '');
  const [phones, setPhones] = useState(supplier?.companyMobile?.length ? supplier.companyMobile : ['']);
  const [selectedItems, setSelectedItems] = useState(supplier?.items?.length ? supplier.items : ['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      "Are you sure you want to remove this supplier?",
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