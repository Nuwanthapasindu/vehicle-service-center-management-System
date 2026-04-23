import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { stockStyles as styles } from "./stock.styles";

export function StockStatusBadge({ isLowStock }) {
  return (
    <View
      style={[
        styles.statusBadge,
        isLowStock ? styles.lowStockBadge : styles.inStockBadge,
      ]}
    >
      <Ionicons 
        name={isLowStock ? "alert-circle" : "checkmark-circle"} 
        size={12} 
        color={isLowStock ? "#F59E0B" : "#16A34A"} 
        style={styles.badgeIcon}
      />
      <Text
        style={[
          styles.statusText,
          isLowStock ? styles.lowStockText : styles.inStockText,
        ]}
      >
        {isLowStock ? "LOW STOCK" : "IN STOCK"}
      </Text>
    </View>
  );
}

export function QtyBadge({ qty, isLowStock }) {
  return (
    <View
      style={[
        styles.qtyBadge,
        isLowStock ? styles.qtyLowBadge : styles.qtyNormalBadge,
      ]}
    >
      <MaterialCommunityIcons 
        name="package-variant" 
        size={12} 
        color={isLowStock ? colors.LIGHT : colors.DARK} 
        style={styles.qtyIcon}
      />
      <Text
        style={[
          styles.qtyText,
          isLowStock ? styles.qtyLowText : styles.qtyNormalText,
        ]}
      >
        {qty} units
      </Text>
    </View>
  );
}

export default function StockCard({ item, onPress }) {
  const isLowStock = Number(item.stock) <= Number(item.reorderLevel);
  
  const getImageSource = () => {
    if (item.image && item.image !== "") {
      return { uri: item.image };
    }
    return require('../../assets/logo.png');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => onPress?.(item)}
    >
      <View style={styles.cardTop}>
        <View style={styles.imageContainer}>
          <Image
            source={getImageSource()}
            style={styles.productImage}
            defaultSource={require('../../assets/logo.png')}
          />
        </View>

        <View style={styles.infoSection}>
          <Text numberOfLines={1} style={styles.productName}>
            {item.name}
          </Text>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="package-variant" size={12} color={colors.SECONDARY} />
            <Text numberOfLines={1} style={styles.productMeta}>
              Unit: {item.unit || "N/A"}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              LKR {Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <StockStatusBadge isLowStock={isLowStock} />
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottom}>
        <View style={styles.reorderWrap}>
          <MaterialCommunityIcons name="arrow-up-down" size={14} color={colors.SECONDARY} />
          <Text style={styles.reorderText}>
            Reorder Level: {item.reorderLevel} units
          </Text>
        </View>
        <QtyBadge qty={item.stock} isLowStock={isLowStock} />
      </View>
    </TouchableOpacity>
  );
}
