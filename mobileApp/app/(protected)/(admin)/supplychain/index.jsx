import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Plus, Search, Phone, ClipboardList, Truck, AlertTriangle, X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { styles } from './styles';
import AddSupplier from './addSupplier';
import EditSupplier from './editSupplier';
import AddOrder from './AddOrder';
import EditOrder from './editOrder';

import enums from '../../../../constants/enums';
import supplyChainService from '../../../../services/supplychain/supplychain.service';

export default function SupplyChainApp() {
  const navigation = useNavigation();
  const [currentView, setCurrentView] = useState(enums.SUPPLY_CHAIN_VIEWS.LIST);
  const [activeTab, setActiveTab] = useState(enums.SUPPLY_CHAIN_TABS.SUPPLIERS);
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

  useEffect(() => {
    if (currentView === enums.SUPPLY_CHAIN_VIEWS.LIST) {
      fetchData();
      setIsWarningDismissed(false);
    }
  }, [activeTab, currentView]);

  const getFilteredData = () => {
    if (!searchText) return data;
    return data.filter(item => {
      const searchStr = activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS ? item.companyName : item.supplier?.companyName;
      return searchStr?.toLowerCase().includes(searchText.toLowerCase());
    });
  };

  const handleFabPress = () => {
    setCurrentView(activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS ? enums.SUPPLY_CHAIN_VIEWS.ADD_SUPPLIER : enums.SUPPLY_CHAIN_VIEWS.ADD_ORDER);
  };

  const callSupplier = (phoneNumbers) => {
    if (phoneNumbers && phoneNumbers.length > 0) {
      Linking.openURL(`tel:${phoneNumbers[0]}`);
    } else {
      Toast.show({ type: "error", text1: "No Number", text2: "This supplier doesn't have a registered mobile number." });
    }
  };

  if (currentView === enums.SUPPLY_CHAIN_VIEWS.ADD_SUPPLIER) return <AddSupplier onBack={() => setCurrentView(enums.SUPPLY_CHAIN_VIEWS.LIST)} />;
  if (currentView === enums.SUPPLY_CHAIN_VIEWS.EDIT_SUPPLIER) return <EditSupplier supplier={selectedItem} onBack={() => setCurrentView(enums.SUPPLY_CHAIN_VIEWS.LIST)} />;
  if (currentView === enums.SUPPLY_CHAIN_VIEWS.ADD_ORDER) return <AddOrder onBack={() => setCurrentView(enums.SUPPLY_CHAIN_VIEWS.LIST)} />;
  if (currentView === enums.SUPPLY_CHAIN_VIEWS.EDIT_ORDER) return <EditOrder order={selectedItem} onBack={() => setCurrentView(enums.SUPPLY_CHAIN_VIEWS.LIST)} />;

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
                activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIES && {
                  borderLeftWidth: 5,
                  borderLeftColor: item.status === enums.PURCHASE_ORDER_STATUS.RECEIVED ? '#84CC16' : (item.status === enums.PURCHASE_ORDER_STATUS.SENT ? '#3B82F6' : '#FFB800')
                }
              ]}
              onPress={() => {
                setSelectedItem(item);
                setCurrentView(activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS ? enums.SUPPLY_CHAIN_VIEWS.EDIT_SUPPLIER : enums.SUPPLY_CHAIN_VIEWS.EDIT_ORDER);
              }}
            >
              <View style={[styles.cardContent, { flex: 1 }]}>
                <Text style={styles.supplierName}>
                  {activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS ? item.companyName : item.supplier?.companyName || "Unknown Supplier"}
                </Text>

                {activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS ? (
                  <Text style={styles.infoText}>Agent: {item.agentName || 'N/A'}</Text>
                ) : (
                  <Text style={styles.subtitle}>{item.items?.length || 0} Items - {item.status === enums.PURCHASE_ORDER_STATUS.SENT ? 'Pending' : item.status}</Text>
                )}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS ? (
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
        <TouchableOpacity style={styles.tabItem} onPress={() => { setActiveTab(enums.SUPPLY_CHAIN_TABS.SUPPLIERS); setSearchText(''); }}>
          <Truck size={24} color={activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS ? '#84CC16' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS && styles.activeTabText]}>SUPPLIERS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => { setActiveTab(enums.SUPPLY_CHAIN_TABS.SUPPLIES); setSearchText(''); }}>
          <ClipboardList size={24} color={activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIES ? '#84CC16' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIES && styles.activeTabText]}>SUPPLIES</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}