import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { stockStyles as styles } from "./stock.styles";
import StockCard from "./StockCard";

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
