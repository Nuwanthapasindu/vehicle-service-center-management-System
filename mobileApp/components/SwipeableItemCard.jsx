import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import enums from '../constants/enums';
import formatPrice from '../utils/formatPrice';

export default function SwipeableItemCard({ 
  title,
  subtitle,
  price, 
  onDelete, 
  icon, 
  disabled = false,
  quantity,
  onUpdateQuantity,
  unit,
  isPrice = false,
  pricingTiers = []
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

  const hasEditableInput = quantity !== undefined && onUpdateQuantity;

  return (
    <Swipeable 
      renderRightActions={renderRightActions} 
      overshootRight={false}
      enabled={!disabled && !!onDelete}
    >
      <View style={[styles.billedItemCard, hasEditableInput && styles.billedItemCardVertical]}>
        {!hasEditableInput ? (
          <>
            {icon && (
              <View style={styles.itemIconContainer}>
                <MaterialCommunityIcons name={icon} size={24} color={colors.PRIMARY} />
              </View>
            )}
            <View style={styles.itemMain}>
              <Text style={styles.itemTitle}>{title}</Text>
              <Text style={styles.itemSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.priceContainer}>
               <Text style={styles.itemPrice}>{price}</Text>
            </View>
          </>
        ) : (
          <View style={styles.cardContent}>
            {/* Row 1: Left side service name (keep it), Right corner editable input */}
            <View style={styles.rowOne}>
              <View style={styles.leftGroup}>
                {icon && (
                  <View style={styles.itemIconContainer}>
                    <MaterialCommunityIcons name={icon} size={24} color={colors.PRIMARY} />
                  </View>
                )}
                <View style={styles.itemMain}>
                  <Text style={styles.itemTitle}>{title}</Text>
                  <Text style={styles.itemSubtitle}>{subtitle}</Text>
                </View>
              </View>

              <View style={styles.inputArea}>
                 <TextInput 
                    style={[styles.qtyInputField, isPrice && { width: 85 }]}
                    value={localQty}
                    onChangeText={setLocalQty}
                    onBlur={handleQtyBlur}
                    keyboardType="numeric"
                    editable={!disabled}
                    placeholder="0"
                 />
              </View>
            </View>

            {/* Pricing Tiers Badge Row (if any available) */}
            {pricingTiers && pricingTiers.length > 0 && (
              <View style={styles.tiersContainer}>
                <Text style={styles.tiersTitle}>Select Pricing Tier (Tap to Apply)</Text>
                <View style={styles.tiersList}>
                  {pricingTiers.map((tier, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={styles.tierPill}
                      onPress={() => {
                        if (!disabled && onUpdateQuantity) {
                          setLocalQty(tier.price.toString());
                          onUpdateQuantity(tier.price);
                        }
                      }}
                      disabled={disabled}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.tierModelText}>{tier.model}: </Text>
                      <Text style={styles.tierPriceText}>{formatPrice(tier.price)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Row 2: Complete row to show price in text */}
            <View style={styles.rowTwo}>
              <Text style={styles.rowTwoLabel}>{isPrice ? "Service Price" : "Total Price"}</Text>
              <Text style={styles.itemPrice}>{price}</Text>
            </View>
          </View>
        )}
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
  billedItemCardVertical: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  cardContent: {
    width: '100%',
  },
  rowOne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  rowTwoLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  tiersContainer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tiersTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tiersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  tierModelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tierPriceText: {
    fontSize: 11,
    fontWeight: '950',
    color: colors.DARK,
  },
});
