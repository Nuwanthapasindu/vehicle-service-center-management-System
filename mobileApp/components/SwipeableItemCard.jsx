import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import enums from '../constants/enums';

export default function SwipeableItemCard({ 
  title,
  subtitle,
  price, 
  onDelete, 
  icon, 
  disabled = false,
  quantity,
  onUpdateQuantity,
  unit
}) {
  const [localQty, setLocalQty] = React.useState(quantity?.toString());
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    setLocalQty(quantity?.toString());
  }, [quantity]);

  const handleQtyBlur = () => {
    const val = parseFloat(localQty);
    if (!isNaN(val)) {
      onUpdateQuantity(val);
    } else {
      setLocalQty(quantity?.toString());
    }
  };

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
          <View style={styles.inputArea}>
             <TextInput 
                style={styles.qtyInputField}
                value={localQty}
                onChangeText={setLocalQty}
                onBlur={handleQtyBlur}
                keyboardType="numeric"
                editable={!disabled}
                placeholder="0"
             />
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
    marginLeft: 8,
    minWidth: 70,
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.DARK,
  },
  inputArea: {
    alignItems: 'center',
    marginRight: 4,
  },
  qtyInputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 6,
    width: 65,
    height: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '900',
    color: colors.DARK,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.LIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '40%',
  },
  modalHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.SECONDARY,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  optItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR + '40',
  },
  optText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.DARK,
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
