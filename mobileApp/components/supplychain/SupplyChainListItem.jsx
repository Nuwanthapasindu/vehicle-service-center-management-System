import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Phone } from 'lucide-react-native';
import enums from '../../constants/enums';
import { styles } from '../../app/(protected)/(admin)/supplychain/styles';

export default function SupplyChainListItem({ item, activeTab, onPress, onCallPress }) {
  const isSuppliersTab = activeTab === enums.SUPPLY_CHAIN_TABS.SUPPLIERS;
  
  const cardStyles = [
    styles.card,
    !isSuppliersTab && {
      borderLeftWidth: 5,
      borderLeftColor: item.status === enums.PURCHASE_ORDER_STATUS.RECEIVED 
        ? '#84CC16' 
        : (item.status === enums.PURCHASE_ORDER_STATUS.SENT ? '#3B82F6' : '#FFB800')
    }
  ];

  const title = isSuppliersTab 
    ? item.companyName 
    : (item.supplier?.companyName || "Unknown Supplier");

  return (
    <TouchableOpacity
      style={cardStyles}
      onPress={onPress}
    >
      <View style={[styles.cardContent, { flex: 1 }]}>
        <Text style={styles.supplierName}>{title}</Text>

        {isSuppliersTab ? (
          <Text style={styles.infoText}>Agent: {item.agentName || 'N/A'}</Text>
        ) : (
          <Text style={styles.subtitle}>
            {item.items?.length || 0} Items - {item.status === enums.PURCHASE_ORDER_STATUS.SENT ? 'Pending' : item.status}
          </Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isSuppliersTab ? (
          <TouchableOpacity 
            style={styles.callButton} 
            onPress={() => onCallPress(item.companyMobile)}
          >
            <Phone size={20} color="#1F2937" />
          </TouchableOpacity>
        ) : (
          <Text style={styles.totalCostValue}>Rs. {item.totalCost || 0}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
