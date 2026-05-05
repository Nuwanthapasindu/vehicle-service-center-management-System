import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, Linking, Modal } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Plus, Search, Phone, AlertTriangle, X } from 'lucide-react-native';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

import { styles } from '../../app/(protected)/(admin)/supplychain/styles';
import enums from '../../constants/enums';
import supplyChainService from '../../services/supplychain/supplychain.service';
import SupplyChainListItem from './SupplyChainListItem';

export default function SupplyChainListScreen({ activeTab }) {
  const navigation = useNavigation();
  const router = useRouter();
  
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lowStockWarning, setLowStockWarning] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);
  const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
  const [currentPhoneNumbers, setCurrentPhoneNumbers] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS) {
        const suppliers = await supplyChainService.getSuppliers();
        setData(suppliers);
      } else {
        const rawOrders = await supplyChainService.getPurchaseOrders();
        const ordersWithCost = rawOrders.map((o) => {
          const totalCost = o.items?.reduce(
            (sum, item) => sum + (item.cost || 0) * (item.qty || 1),
            0,
          );
          return { ...o, totalCost };
        });
        setData(ordersWithCost);
      }

      const invData = await supplyChainService.getInventory();
      const lowStock = invData.filter(
        (item) =>
          item.qty <=
          (item.reorderLevel !== undefined ? item.reorderLevel : 10),
      );
      setLowStockItems(lowStock);
      setLowStockWarning(lowStock.length > 0);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to fetch data",
        text2: error.response?.data?.payload?.message || error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      setIsWarningDismissed(false);
    }, [activeTab])
  );

  const getFilteredData = () => {
    if (!searchText) return data;
    return data.filter(item => {
      const searchStr = activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS ? item.companyName : item.supplier?.companyName;
      return searchStr?.toLowerCase().includes(searchText.toLowerCase());
    });
  };

  const handleFabPress = () => {
    if (activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS) {
      router.push('/(protected)/(admin)/supplychain/addSupplier');
    } else {
      router.push('/(protected)/(admin)/supplychain/AddOrder');
    }
  };

  const handleItemPress = (item) => {
    if (activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS) {
      router.push({ pathname: '/(protected)/(admin)/supplychain/editSupplier', params: { item: JSON.stringify(item) } });
    } else {
      router.push({ pathname: '/(protected)/(admin)/supplychain/editOrder', params: { item: JSON.stringify(item) } });
    }
  };

  const callSupplier = (phoneNumbers) => {
    if (phoneNumbers && phoneNumbers.length > 0) {
      setCurrentPhoneNumbers(phoneNumbers);
      setIsPhoneModalVisible(true);
    } else {
      Toast.show({ type: "error", text1: "No Number", text2: "This supplier doesn't have a registered mobile number." });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Menu color="#1F2937" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeTab}</Text>
        {lowStockWarning && !isWarningDismissed ? <AlertTriangle color="#EF4444" size={28} /> : <View style={{ width: 28 }} />}
      </View>

      {lowStockWarning && !isWarningDismissed && (
        <View style={{ backgroundColor: '#FEF2F2', padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              if (lowStockItems.length > 0) {
                const itemNames = lowStockItems.map(i => `• ${i.name} (Qty: ${i.qty})`).join('\n');
                Alert.alert('Low Stock Items', itemNames);
              }
            }}
          >
            <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>⚠️ Inventory Low Stock Alert (Tap to view)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsWarningDismissed(true)} style={{ paddingHorizontal: 10 }}>
            <X size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchContainer}>
        <View style={styles.searchSection}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#84CC16" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={getFilteredData()}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SupplyChainListItem
              item={item}
              activeTab={activeTab}
              onPress={() => handleItemPress(item)}
              onCallPress={callSupplier}
            />
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Plus size={30} color="#1F2937" />
      </TouchableOpacity>

      <Modal
        visible={isPhoneModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPhoneModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsPhoneModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Supplier</Text>
              <TouchableOpacity onPress={() => setIsPhoneModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {currentPhoneNumbers.map((number, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.numberItem}
                onPress={() => {
                  Linking.openURL(`tel:${number}`);
                  setIsPhoneModalVisible(false);
                }}
              >
                <Text style={styles.numberText}>{number}</Text>
                <View style={styles.callIconContainer}>
                  <Phone size={20} color="#84CC16" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
