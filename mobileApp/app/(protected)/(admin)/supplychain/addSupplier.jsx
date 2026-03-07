import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, Phone, Trash2, Box, ChevronDown } from 'lucide-react-native';
import { styles } from './styles'; 

export default function AddSupplier({ onBack }) {
  // 1. Setup State to capture inputs
  const [companyName, setCompanyName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [phone, setPhone] = useState('');

  // 2. Function to handle saving
  const handleSave = () => {
    if (!companyName) {
      Alert.alert("Error", "Company Name is required");
      return;
    }

    const newSupplier = {
      name: companyName,
      contact: agentName,
      phone: phone,
    };

    console.log("Sending to Backend:", newSupplier);
    // When your friend finishes the service, you'll call it here
    Alert.alert("Success", "Supplier saved successfully!");
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><ChevronLeft color="#84CC16" size={32} /></TouchableOpacity>
        <Text style={styles.headerTitle}>ADD SUPPLIER</Text>
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
          placeholder="e.g. AMW Genuine Parts" 
          value={companyName}
          onChangeText={setCompanyName}
          placeholderTextColor="#9CA3AF" 
        />

        <Text style={[styles.label, {marginTop: 15}]}>Agent Name</Text>
        <TextInput 
          style={styles.formInput} 
          placeholder="e.g. Anura Perera" 
          value={agentName}
          onChangeText={setAgentName}
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
            style={[styles.formInput, {flex: 1, marginBottom: 0}]} 
            placeholder="+94 11 230 4304" 
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF" 
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={handleSave}>
          <Text style={styles.saveSupplierBtnText}>Save Supplier</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}