import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Phone } from 'lucide-react-native';
import axios from 'axios';
import { styles } from './styles'; 

export default function AddSupplier({ onBack, API }) {
  const [companyName, setCompanyName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!companyName) return Alert.alert("Error", "Company Name is required");
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/suppliers`, {
        companyName,
        agentName,
        companyMobile: phone ? [phone] : []
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
        <TouchableOpacity style={styles.saveSupplierBtn} onPress={handleSave} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#1F2937" /> : <Text style={styles.saveSupplierBtnText}>Save Supplier</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}