import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../../constants/colors";
import { inventoryStyles as styles } from "../../../../../components/inventory/inventory.styles";
import InventoryCard from "../../../../../components/inventory/InventoryCard";

export default function InventoryList({
  data,
  refreshing,
  onRefresh,
  onItemPress,
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id?.toString() || item.id || Math.random().toString()}
      renderItem={({ item }) => <InventoryCard item={item} onPress={onItemPress} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Ionicons name="cube-outline" size={64} color={colors.SECONDARY} />
          <Text style={styles.emptyText}>No inventory items found</Text>
          <Text style={styles.emptySubText}>Tap + to add your first item</Text>
        </View>
      }
    />
  );
}
