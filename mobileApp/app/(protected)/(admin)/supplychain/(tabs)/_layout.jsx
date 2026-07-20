import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Truck, ClipboardList, AlertTriangle, X } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { styles } from '../styles';
import supplyChainService from '../../../../../services/supplychain/supplychain.service';

function SupplyChainHeader({ route, options }) {
  const navigation = useNavigation();
  const [lowStockWarning, setLowStockWarning] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const invData = await supplyChainService.getInventory();
        const lowStock = invData.filter(
          (item) => item.qty <= (item.reorderLevel !== undefined ? item.reorderLevel : 10)
        );
        setLowStockItems(lowStock);
        setLowStockWarning(lowStock.length > 0);
      } catch (err) {
        // ignore
      }
    };
    fetchInventory();
  }, []);

  const title = options.title || route.name;

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: '#FFF' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Menu color="#1F2937" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
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
    </SafeAreaView>
  );
}

export default function SupplyChainTabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        header: (props) => <SupplyChainHeader {...props} />,
        headerShown: true,
        tabBarActiveTintColor: '#84CC16',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 70 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="suppliers"
        options={{
          title: 'SUPPLIERS',
          tabBarIcon: ({ color }) => <Truck size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="supplies"
        options={{
          title: 'SUPPLIES',
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
