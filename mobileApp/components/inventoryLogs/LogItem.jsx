import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, User as UserIcon, ArrowUpRight, ArrowDownLeft, RefreshCcw, Edit } from 'lucide-react-native';

const LogItem = ({ log }) => {
  const getActionIcon = (type) => {
    switch (type) {
      case 'Stock In':
      case 'PO Receive':
        return <ArrowUpRight size={16} color="#28a745" />;
      case 'Stock Out':
      case 'Invoice Sale':
        return <ArrowDownLeft size={16} color="#dc3545" />;
      case 'Restock':
        return <RefreshCcw size={16} color="#007bff" />;
      default:
        return <Edit size={16} color="#ffc107" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.actionType}>
          {getActionIcon(log.actionType)}
          <Text style={styles.actionText}>{log.actionType}</Text>
        </View>
        <Text style={[styles.qtyChange, { color: log.quantityChange > 0 ? '#28a745' : '#dc3545' }]}>
          {log.quantityChange > 0 ? '+' : ''}{log.quantityChange}
        </Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.itemName}>{log.inventory?.name || 'Item'}</Text>
        <View style={styles.metaRow}>
          <Clock size={12} color="#6c757d" />
          <Text style={styles.metaText}>{formatDate(log.createdAt)}</Text>
        </View>
        <View style={styles.metaRow}>
          <UserIcon size={12} color="#6c757d" />
          <Text style={styles.metaText}>{log.performedBy?.name || 'System'}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.balanceLabel}>Balance: </Text>
        <Text style={styles.balanceValue}>{log.stockBalance}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textTransform: 'uppercase',
  },
  qtyChange: {
    fontSize: 16,
    fontWeight: '700',
  },
  details: {
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#6c757d',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    paddingTop: 8,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  balanceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212529',
  },
});

export default LogItem;
