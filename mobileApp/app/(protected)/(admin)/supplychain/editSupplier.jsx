import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, Phone, Trash2, Box, ChevronDown } from 'lucide-react-native';
import { styles } from './styles';

export default function EditSupplier({ supplier, onBack }) {
  // 1. Initialize state with existing supplier data
  const [companyName, setCompanyName] = useState(supplier?.name || '');
  const [agentName, setAgentName] = useState(supplier?.contact || '');
  const [phone, setPhone] = useState(supplier?.phone || '');

  // 2. Handle Update Action
  const handleUpdate = () => {
    if (!companyName) {
      Alert.alert("Error", "Company Name is required");
      return;
    }

    const updatedSupplier = {
      id: supplier.id, // Needed to identify the record in MongoDB
      name: companyName,
      contact: agentName,
      phone: phone,
    };

    console.log("Updating in Backend:", updatedSupplier);
    // Logic: api.put(`/suppliers/${supplier.id}`, updatedSupplier)
    Alert.alert("Success", "Supplier updated successfully!");
    onBack();
  };

  // 3. Handle Delete Action
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this supplier? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onBack }
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionTitleRow}>
          <Info size={18} color="#84CC16" />
          <Text style={styles.sectionTitleText}>Basic Information</Text>
        </View>
        <Text style={styles.label}>Company Name <Text style={{color: 'red'}}>*</Text></Text>
        <TextInput 
          style={styles.formInput} 
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="e.g. Shine Depot Supplies" 
          placeholderTextColor="#9CA3AF" 
        />
        
        <Text style={[styles.label, {marginTop: 15}]}>Agent Name</Text>
        <TextInput 
          style={styles.formInput} 
          value={agentName}
          onChangeText={setAgentName}
          placeholder="e.g. John Doe" 
          placeholderTextColor="#9CA3AF" 
        />

        <View style={[styles.sectionTitleRow, { marginTop: 25 }]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Phone size={18} color="#84CC16" />
            <Text style={styles.sectionTitleText}>Mobile Number</Text>
          </View>
        </View>
        
        <View style={styles.inputWithIconRow}>
          <TextInput 
            style={[styles.formInput, {flex: 1, marginBottom: 10}]} 
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+94 77 000 0000" 
          />
        </View>

        <View style={[styles.sectionTitleRow, { marginTop: 25 }]}>
          <Box size={18} color="#84CC16" />
          <Text style={styles.sectionTitleText}>Supplied Items</Text>
        </View>
        <Text style={styles.smallLabelCaps}>CURRENTLY SUPPLYING</Text>
        <View style={{marginTop: 10}}>
            {/* These would eventually map from supplier.items */}
            {['Engine Oil', 'Brake Pads'].map((item, i) => (
                <View key={i} style={[styles.card, {marginBottom: 10, padding: 12, backgroundColor: '#F9FAFB'}]}>
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>{item}</Text>
                </View>
            ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { height: 160 }]}>
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={handleUpdate}>
          <Text style={styles.saveSupplierBtnText}>Update Supplier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveSupplierBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444', marginTop: 10 }]} 
          onPress={handleDelete}
        >
          <Trash2 size={18} color="#EF4444" style={{marginRight: 8}} />
          <Text style={[styles.saveSupplierBtnText, { color: '#EF4444' }]}>Delete Supplier</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}