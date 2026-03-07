import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Plus, Search, Phone, ClipboardList, Truck, AlertTriangle } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import axios from 'axios';

import { styles } from './styles';
import AddSupplier from './addSupplier';
import EditSupplier from './editSupplier';
import AddOrder from './AddOrder';
import EditOrder from './editOrder';

// Resolve the correct API URL dynamically, removing the '/v1' part since supply chain routes in app.js are just '/api/...'
const API_URL = process.env.EXPO_PUBLIC_API_URL.replace('/v1', '');

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const endpoint = activeTab === 'SUPPLIERS' ? '/suppliers' : '/orders';
      const response = await axios.get(`${API_URL}${endpoint}`);
      setData(response.data);

      // Check for low stock alerts
      const stockRes = await axios.get(`${API_URL}/inventory/low-stock`);
      setLowStockItems(stockRes.data);
      setLowStockWarning(stockRes.data.length > 0);
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
      // Optional: Alert the user if the server is unreachable.
      Alert.alert("Network Error", "Could not connect to the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'LIST') {
      fetchData();
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

  // Views Routing
  if (currentView === 'ADD_SUPPLIER') return <AddSupplier onBack={() => setCurrentView('LIST')} API={API_URL} />;
  if (currentView === 'EDIT_SUPPLIER') return <EditSupplier supplier={selectedItem} onBack={() => setCurrentView('LIST')} API={API_URL} />;
  if (currentView === 'ADD_ORDER') return <AddOrder onBack={() => setCurrentView('LIST')} API={API_URL} />;
  if (currentView === 'EDIT_ORDER') return <EditOrder order={selectedItem} onBack={() => setCurrentView('LIST')} API={API_URL} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Menu color="#1F2937" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeTab}</Text>
        {lowStockWarning ? <AlertTriangle color="#EF4444" size={28} /> : <View style={{ width: 28 }} />}
      </View>

      {/* Low Stock Warning Banner */}
      {lowStockWarning && (
        <TouchableOpacity
          style={{ backgroundColor: '#FEF2F2', padding: 10, alignItems: 'center' }}
          onPress={() => {
            if (lowStockItems.length > 0) {
              const itemNames = lowStockItems.map(i => `• ${i.name} (Qty: ${i.qty})`).join('\n');
              Alert.alert('Low Stock Items', itemNames);
            }
          }}
        >
          <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>⚠️ Inventory Low Stock Alert (Tap to view)</Text>
        </TouchableOpacity>
      )}

      {/* Search Bar */}
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

      {/* Main List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#84CC16" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={getFilteredData()}
          keyExtractor={(item) => item._id}
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
              <View style={styles.cardContent}>
                <Text style={styles.supplierName}>
                  {activeTab === 'SUPPLIERS' ? item.companyName : item.supplier?.companyName || "Unknown Supplier"}
                </Text>

                {activeTab === 'SUPPLIERS' ? (
                  <Text style={styles.infoText}>Agent: {item.agentName || 'N/A'}</Text>
                ) : (
                  <Text style={styles.subtitle}>{item.items?.length || 0} Items - {item.status}</Text>
                )}
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                {activeTab === 'SUPPLIERS' ? (
                  <View style={styles.callButton}>
                    <Phone size={20} color="#1F2937" />
                  </View>
                ) : (
                  <Text style={styles.totalCostValue}>Rs. {item.totalCost || 0}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Plus size={30} color="#1F2937" />
      </TouchableOpacity>

      {/* Bottom Tabs */}
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