import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../../../constants/colors";

function StockStatusBadge({ isLowStock }) {
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

function QtyBadge({ qty, isLowStock }) {
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

function StockCard({ item, onPress }) {
  const isLowStock = Number(item.stock) <= Number(item.reorderLevel);
  
  const getImageSource = () => {
    if (item.image && item.image !== "") {
      return { uri: item.image };
    }
    return require('../../../../../assets/logo.png');
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
            defaultSource={require('../../../../../assets/logo.png')}
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

export default function StockList({
  data,
  refreshing,
  onRefresh,
  onItemPress,
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id?.toString() || item.id || Math.random().toString()}
      renderItem={({ item }) => (
        <StockCard item={item} onPress={onItemPress} />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Ionicons name="cube-outline" size={64} color={colors.SECONDARY} />
          <Text style={styles.emptyText}>No stock items found</Text>
          <Text style={styles.emptySubText}>Add items to inventory to see them here</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 110,
  },

  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.BACKGROUND_COLOR,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },

  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  infoSection: {
    flex: 1,
  },

  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },

  productMeta: {
    fontSize: 11,
    color: colors.SECONDARY,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.PRIMARY,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  badgeIcon: {
    marginRight: 2,
  },

  inStockBadge: {
    backgroundColor: "#E8F8EC",
  },

  lowStockBadge: {
    backgroundColor: "#FFF3E0",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  inStockText: {
    color: "#16A34A",
  },

  lowStockText: {
    color: "#F59E0B",
  },

  divider: {
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
    marginVertical: 10,
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reorderWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
  },

  reorderText: {
    fontSize: 11,
    color: colors.SECONDARY,
    fontWeight: "500",
  },

  qtyBadge: {
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 70,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },

  qtyNormalBadge: {
    backgroundColor: colors.BACKGROUND_COLOR,
  },

  qtyLowBadge: {
    backgroundColor: "#F59E0B",
  },

  qtyText: {
    fontWeight: "800",
    fontSize: 11,
  },

  qtyIcon: {
    marginRight: 2,
  },

  qtyNormalText: {
    color: colors.DARK,
  },

  qtyLowText: {
    color: colors.LIGHT,
  },

  emptyWrap: {
    paddingTop: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.SECONDARY,
    fontWeight: "600",
  },

  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "500",
  },
});