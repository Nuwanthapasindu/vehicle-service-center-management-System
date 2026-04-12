import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function SwipeableItemCard({ 
  title, 
  subtitle, 
  price, 
  onDelete, 
  icon, 
  disabled = false 
}) {

  const renderRightActions = () => {
    if (disabled || !onDelete) return null;
    return (
      <TouchableOpacity style={styles.deleteSwipeAction} onPress={onDelete}>
        <Ionicons name="trash-outline" size={24} color={colors.LIGHT} />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable 
      renderRightActions={renderRightActions} 
      overshootRight={false}
      enabled={!disabled && !!onDelete}
    >
      <View style={styles.billedItemCard}>
        {icon && (
          <View style={styles.itemIconContainer}>
            <MaterialCommunityIcons name={icon} size={24} color={colors.PRIMARY} />
          </View>
        )}
        <View style={styles.itemMain}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.itemPrice}>{price}</Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  billedItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.LIGHT,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(142, 219, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemMain: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.DARK,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.DARK,
    marginRight: 4, // Prevent touch overflow boundary
  },
  deleteSwipeAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 12,
    marginBottom: 10,
    marginLeft: 8,
  },
});
