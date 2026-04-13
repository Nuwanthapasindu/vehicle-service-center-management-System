import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Plus, Search, Phone, ClipboardList, Truck, AlertTriangle, X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import axios from 'axios';

import { styles } from './styles';
import AddSupplier from './addSupplier';
import EditSupplier from './editSupplier';
import AddOrder from './AddOrder';
import EditOrder from './editOrder';

const API_URL = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL.replace('/v1', '') : 'http://localhost:5000/api';

export default function SupplyChainApp() {
  const navigation = useNavigation();
  const [currentView, setCurrentView] = useState('LIST');
  const [activeTab, setActiveTab] = useState('SUPPLIERS');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lowStockWarning, setLowStockWarning] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    if (activeTab === 'SUPPLIERS') {
      const response = await axios.get(`${API_URL}/suppliers`);
      setData(response.data?.payload?.suppliers || []);
    } else {
      const response = await axios.get(`${API_URL}/purchaseOrders`);
      const rawOrders = response.data?.payload?.orders || [];
      const ordersWithCost = rawOrders.map(o => {
        const totalCost = o.items?.reduce((sum, item) => sum + ((item.cost || 0) * (item.qty || 1)), 0);
        return { ...o, totalCost };
      });
      setData(ordersWithCost); 
    }

    const stockRes = await axios.get(`${API_URL}/v1/inventory`);
    const invData = stockRes.data?.payload?.data || [];
    const lowStock = invData.filter(item => item.qty <= (item.reorderLevel !== undefined ? item.reorderLevel : 10));
    setLowStockItems(lowStock);
    setLowStockWarning(lowStock.length > 0);
  } catch (error) {
    console.error("Fetch Error:", error.response?.data || error.message);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (currentView === 'LIST') {
      fetchData();
      setIsWarningDismissed(false);
    }
  }, [activeTab, currentView]);

  const getFilteredData = () => {
    if (!searchText) return data;
    return data.filter(item => {
      const searchStr = activeTab === 'SUPPLIERS' ? item.companyName : item.supplier?.companyName;
      return searchStr?.toLowerCase().includes(searchText.toLowerCase());
    });
  };

  const handleFabPress = () => {
    setCurrentView(activeTab === 'SUPPLIERS' ? 'ADD_SUPPLIER' : 'ADD_ORDER');
  };

  const callSupplier = (phoneNumbers) => {
    if (phoneNumbers && phoneNumbers.length > 0) {
      Linking.openURL(`tel:${phoneNumbers[0]}`);
    } else {
      Alert.alert("No Number", "This supplier doesn't have a registered mobile number.");
    }
  };

  if (currentView === 'ADD_SUPPLIER') return <AddSupplier onBack={() => setCurrentView('LIST')} API={API_URL} />;
  if (currentView === 'EDIT_SUPPLIER') return <EditSupplier supplier={selectedItem} onBack={() => setCurrentView('LIST')} API={API_URL} />;
  if (currentView === 'ADD_ORDER') return <AddOrder onBack={() => setCurrentView('LIST')} API={API_URL} />;
  if (currentView === 'EDIT_ORDER') return <EditOrder order={selectedItem} onBack={() => setCurrentView('LIST')} API={API_URL} />;

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
            <TouchableOpacity
              style={[
                styles.card,
                activeTab === 'SUPPLIES' && {
                  borderLeftWidth: 5,
                  borderLeftColor: item.status === 'Received' ? '#84CC16' : (item.status === 'Sent' ? '#3B82F6' : '#FFB800')
                }
              ]}
              onPress={() => {
                setSelectedItem(item);
                setCurrentView(activeTab === 'SUPPLIERS' ? 'EDIT_SUPPLIER' : 'EDIT_ORDER');
              }}
            >
              <View style={[styles.cardContent, { flex: 1 }]}>
                <Text style={styles.supplierName}>
                  {activeTab === 'SUPPLIERS' ? item.companyName : item.supplier?.companyName || "Unknown Supplier"}
                </Text>

                {activeTab === 'SUPPLIERS' ? (
                  <Text style={styles.infoText}>Agent: {item.agentName || 'N/A'}</Text>
                ) : (
                  <Text style={styles.subtitle}>{item.items?.length || 0} Items - {item.status === 'Sent' ? 'Pending' : item.status}</Text>
                )}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {activeTab === 'SUPPLIERS' ? (
                  <TouchableOpacity style={styles.callButton} onPress={() => callSupplier(item.companyMobile)}>
                    <Phone size={20} color="#1F2937" />
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.totalCostValue}>Rs. {item.totalCost || 0}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Plus size={30} color="#1F2937" />
      </TouchableOpacity>

      <View style={styles.bottomTabs}>
        <TouchableOpacity style={styles.tabItem} onPress={() => { setActiveTab('SUPPLIERS'); setSearchText(''); }}>
          <Truck size={24} color={activeTab === 'SUPPLIERS' ? '#84CC16' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'SUPPLIERS' && styles.activeTabText]}>SUPPLIERS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => { setActiveTab('SUPPLIES'); setSearchText(''); }}>
          <ClipboardList size={24} color={activeTab === 'SUPPLIES' ? '#84CC16' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'SUPPLIES' && styles.activeTabText]}>SUPPLIES</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}