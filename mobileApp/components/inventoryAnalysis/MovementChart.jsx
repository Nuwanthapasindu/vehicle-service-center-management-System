import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MovementChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No movement data available for the last 30 days</Text>
      </View>
    );
  }

  // Group data by actionType
  const summary = data.reduce((acc, curr) => {
    const type = curr._id.actionType;
    if (!acc[type]) {
      acc[type] = { count: 0, totalChange: 0 };
    }
    acc[type].count += curr.count;
    acc[type].totalChange += curr.totalChange;
    return acc;
  }, {});

  const summaryArray = Object.keys(summary).map(type => ({
    type,
    ...summary[type]
  }));

  const maxCount = Math.max(...summaryArray.map(s => s.count), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Stock Activity (Last 30 Days)</Text>
      {summaryArray.map((item, index) => {
        const percentage = (item.count / maxCount) * 100;
        return (
          <View key={item.type} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={styles.actionType}>{item.type}</Text>
              <Text style={styles.actionCount}>{item.count} actions</Text>
            </View>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${percentage}%`, backgroundColor: getActionColor(item.type) }
                ]} 
              />
            </View>
            <Text style={styles.netChange}>
              Net Change: <Text style={{ color: item.totalChange >= 0 ? '#28a745' : '#dc3545' }}>
                {item.totalChange >= 0 ? '+' : ''}{item.totalChange}
              </Text>
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const getActionColor = (type) => {
  switch (type) {
    case 'Stock In':
    case 'PO Receive':
      return '#28a745';
    case 'Stock Out':
    case 'Invoice Sale':
      return '#dc3545';
    case 'Restock':
      return '#007bff';
    default:
      return '#ffc107';
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  row: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  actionType: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  actionCount: {
    fontSize: 12,
    color: '#6c757d',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  netChange: {
    fontSize: 11,
    color: '#6c757d',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
    padding: 20,
  },
});

export default MovementChart;
