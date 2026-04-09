import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../../components/CustomInput";
import colors from "../../constants/colors";
import { styles } from "./category.styles";

const CategoryForm = ({ 
  handleChange, 
  handleBlur, 
  handleSubmit, 
  values, 
  errors, 
  touched, 
  loading, 
  onCancel,
  onDelete,
  onView,
  isEdit = false 
}) => {
  return (
    <View style={styles.modalBody}>
      <CustomInput
        label="CATEGORY NAME"
        placeholder="e.g. Engine Oil"
        value={values.name}
        onChangeText={handleChange("name")}
        onBlur={handleBlur("name")}
        error={errors.name}
        touched={touched.name}
      />

      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        {isEdit && (
          <TouchableOpacity 
            style={[styles.primaryBtn, { flex: 1, marginTop: 0 }]} 
            onPress={onView} 
            disabled={loading}
          >
            <Ionicons name="eye-outline" size={20} color={colors.DARK} />
            <Text style={styles.btnText}>View</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.primaryBtn, { flex: isEdit ? 1.5 : 1, marginTop: 0 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Ionicons 
            name={isEdit ? "save-outline" : "add-circle-outline"} 
            size={22} 
            color={colors.DARK} 
          />
          <Text style={styles.btnText}>
            {loading ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update" : "Add")}
          </Text>
        </TouchableOpacity>
      </View>

      {isEdit && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} disabled={loading}>
          <Ionicons name="trash-outline" size={20} color={colors.LIGHT} />
          <Text style={styles.deleteText}>Delete Category</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryForm;