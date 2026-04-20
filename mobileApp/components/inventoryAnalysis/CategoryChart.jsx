import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No category data available</Text>
      </View>
    );
  }

  const totalValue = data.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Value by Category</Text>
      {data.map((item, index) => {
        const percentage = totalValue > 0 ? (item.totalValue / totalValue) * 100 : 0;
        return (
          <View key={item._id} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={styles.categoryName}>{item._id}</Text>
              <Text style={styles.categoryValue}>Rs. {item.totalValue.toLocaleString()}</Text>
            </View>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${percentage}%`, backgroundColor: getColor(index) }
                ]} 
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const getColor = (index) => {
  const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6610f2', '#e83e8c'];
  return colors[index % colors.length];
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
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#495057',
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
    padding: 20,
  },
});

export default CategoryChart;
