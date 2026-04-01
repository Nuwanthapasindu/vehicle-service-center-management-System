import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { styles } from "./category.styles";

const CategoryCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.85}
    onPress={() => onPress?.(item)}
  >
    <View style={styles.cardTextWrap}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryMeta}>{item.count || 0} items in stock</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color={colors.SECONDARY} />
  </TouchableOpacity>
);

export default CategoryCard;