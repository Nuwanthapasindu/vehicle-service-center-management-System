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
  disabled = false,
  quantity,
  onUpdateQuantity
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

        {quantity !== undefined && onUpdateQuantity && (
          <View style={styles.qtySelector}>
            <TouchableOpacity 
              onPress={() => onUpdateQuantity(Math.max(1, quantity - 1))}
              style={styles.qtyBtn}
            >
              <Ionicons name="remove" size={16} color={colors.DARK} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity 
              onPress={() => onUpdateQuantity(quantity + 1)}
              style={styles.qtyBtn}
            >
              <Ionicons name="add" size={16} color={colors.DARK} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.priceContainer}>
           <Text style={styles.itemPrice}>{price}</Text>
        </View>
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
  priceContainer: {
    marginLeft: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.DARK,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginRight: 4,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.DARK,
    paddingHorizontal: 4,
    minWidth: 24,
    textAlign: 'center',
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
