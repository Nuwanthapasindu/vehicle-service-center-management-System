import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Menu, Plus, Search, Phone, User, ClipboardList, Truck 
} from 'lucide-react-native';

import { SUPPLIERS_DATA, SUPPLIES_DATA } from './data';
import { styles } from './styles';
import AddSupplier from './addSupplier';
import EditSupplier from './editSupplier';
import AddOrder from './AddOrder';
import EditOrder from './editOrder';

export default function SupplyChainApp() {
  const [currentView, setCurrentView] = useState('LIST'); 
  const [activeTab, setActiveTab] = useState('SUPPLIERS'); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Search Filtering Logic
  const getFilteredData = () => {
    const data = activeTab === 'SUPPLIERS' ? SUPPLIERS_DATA : SUPPLIES_DATA;
    if (!searchText) return data;
    
    return data.filter(item => 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.contact && item.contact.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  const handleFabPress = () => {
    setSelectedItem(null);
    if (activeTab === 'SUPPLIERS') {
      setCurrentView('ADD_SUPPLIER');
    } else {
      setCurrentView('ADD_ORDER');
    }
  };

  // --- NAVIGATION ROUTER ---
  if (currentView === 'ADD_SUPPLIER') return <AddSupplier onBack={() => setCurrentView('LIST')} />;
  if (currentView === 'EDIT_SUPPLIER') return <EditSupplier supplier={selectedItem} onBack={() => setCurrentView('LIST')} />;
  if (currentView === 'ADD_ORDER') return <AddOrder onBack={() => setCurrentView('LIST')} />;
  if (currentView === 'EDIT_ORDER') return <EditOrder order={selectedItem} onBack={() => setCurrentView('LIST')} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Menu color="#1F2937" size={28} />
        <Text style={styles.headerTitle}>{activeTab}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar - Linked to State */}
      <View style={styles.searchContainer}>
        <View style={styles.searchSection}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder={`Search ${activeTab.toLowerCase()}...`} 
            placeholderTextColor="#9CA3AF" 
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Main List with Loading State */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#84CC16" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={getFilteredData()}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#9CA3AF' }}>No results found</Text>}
          renderItem={({ item }) => {
            const isReceived = item.status?.toUpperCase() === 'RECEIVED';
            
            return (
              <TouchableOpacity 
                style={
                  activeTab === 'SUPPLIERS' 
                    ? styles.card 
                    : [styles.card, { borderLeftWidth: 5, borderLeftColor: isReceived ? '#84CC16' : '#FFB800' }]
                } 
                onPress={() => { 
                    setSelectedItem(item);
                    setCurrentView(activeTab === 'SUPPLIERS' ? 'EDIT_SUPPLIER' : 'EDIT_ORDER');
                }}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.supplierName}>{item.name}</Text>
                  {activeTab === 'SUPPLIERS' ? (
                    <>
                      <View style={styles.infoRow}>
                        <User size={14} color="#9CA3AF" />
                        <Text style={styles.infoText}>Contact: {item.contact}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Phone size={14} color="#9CA3AF" />
                        <Text style={styles.infoText}>{item.phone}</Text>
                      </View>
                    </>
                  ) : (
                    <Text style={styles.subtitle}>{item.date} • {item.items} Items</Text>
                  )}
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  {activeTab === 'SUPPLIES' && (
                    <View style={[styles.badge, { backgroundColor: isReceived ? '#F4FCE3' : '#FFFBEB' }]}>
                      <Text style={[styles.badgeText, { color: isReceived ? '#84CC16' : '#FFB800' }]}>
                        {item.status}
                      </Text>
                    </View>
                  )}
                  
                  {activeTab === 'SUPPLIERS' ? (
                    <View style={styles.callButton}>
                      <Phone size={20} color="#1F2937" />
                    </View>
                  ) : (
                    <Text style={styles.totalCostValue}>Rs. {item.cost}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Plus size={30} color="#1F2937" />
      </TouchableOpacity>

      {/* Bottom Tabs */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => { setActiveTab('SUPPLIERS'); setSearchText(''); }}
        >
          <Truck size={24} color={activeTab === 'SUPPLIERS' ? '#84CC16' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'SUPPLIERS' && styles.activeTabText]}>SUPPLIERS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => { setActiveTab('SUPPLIES'); setSearchText(''); }}
        >
          <ClipboardList size={24} color={activeTab === 'SUPPLIES' ? '#84CC16' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'SUPPLIES' && styles.activeTabText]}>SUPPLIES</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}