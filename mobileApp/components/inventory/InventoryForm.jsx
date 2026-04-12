import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Formik } from "formik";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomInput from "../../components/CustomInput";
import DropdownInput from "../../components/DropdownInput";
import InventorySchema from "../../schema/inventorySchema";
import colors from "../../constants/colors";
import enums from "../../constants/enums";
import { inventoryStyles as styles } from "./inventory.styles";

export default function InventoryForm({
  initialValues,
  onSubmit,
  categories,
  existingItems = [],
  itemId = null,
  loading,
  btnLabel,
  isEdit = false,
  onDelete
}) {
  const unitOptions = Object.values(enums.INVENTORY_UNIT_TYPES);
  const validationSchema = InventorySchema(existingItems, itemId);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validate={(values) => {
        const errors = {};
        if (values.name && existingItems.length > 0) {
          const lowercaseName = values.name.trim().toLowerCase();
          const isDuplicate = existingItems.some(item => {
            if (!item || !item.name) return false;
            const sameName = String(item.name).trim().toLowerCase() === lowercaseName;
            const differentId = itemId ? (String(item._id) !== String(itemId) && String(item.id) !== String(itemId)) : true;
            return sameName && differentId;
          });
          if (isDuplicate) {
            errors.name = "Item name already exists in inventory";
          }
        }
        return errors;
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >

      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="information-outline" size={20} color={colors.PRIMARY} />
              <Text style={styles.sectionTitle}>GENERAL INFORMATION</Text>
            </View>

            <CustomInput
              label="Item Name"
              placeholder="Enter item name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              error={errors.name}
              touched={touched.name}
              icon={<Ionicons name="cube-outline" size={20} color={colors.SECONDARY} />}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <DropdownInput
                value={categories.find(c => c.value === values.category)?.label || ""}
                options={categories.map(c => c.label)}
                onSelect={(label) => {
                  const selected = categories.find(c => c.label === label);
                  setFieldValue("category", selected ? selected.value : "");
                }}
                placeholder="Select a category"
              />
              {touched.category && errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Unit Type</Text>
              <DropdownInput
                value={values.unitType}
                options={unitOptions}
                onSelect={(v) => setFieldValue("unitType", v)}
                placeholder="Select unit type"
              />
              {touched.unitType && errors.unitType && (
                <Text style={styles.errorText}>{errors.unitType}</Text>
              )}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="package-variant" size={20} color={colors.PRIMARY} />
              <Text style={styles.sectionTitle}>INVENTORY & STOCK</Text>
            </View>

            <CustomInput
              label="Reorder Level"
              placeholder="Enter reorder level"
              keyboardType="numeric"
              value={values.reorderLevel}
              onChangeText={handleChange("reorderLevel")}
              onBlur={handleBlur("reorderLevel")}
              error={errors.reorderLevel}
              touched={touched.reorderLevel}
              icon={<MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.SECONDARY} />}
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="currency-usd" size={20} color={colors.PRIMARY} />
              <Text style={styles.sectionTitle}>PRICING</Text>
            </View>

            <View style={styles.formPriceRow}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <CustomInput
                  label="Buying Price (LKR)"
                  placeholder="Enter price"
                  keyboardType="numeric"
                  value={values.buyingPrice}
                  onChangeText={handleChange("buyingPrice")}
                  onBlur={handleBlur("buyingPrice")}
                  error={errors.buyingPrice}
                  touched={touched.buyingPrice}
                  icon={<Ionicons name="cash-outline" size={20} color={colors.SECONDARY} />}
                />
              </View>

              <View style={{ flex: 1 }}>
                <CustomInput
                  label="Selling Price (LKR)"
                  placeholder="Enter price"
                  keyboardType="numeric"
                  value={values.sellingPrice}
                  onChangeText={handleChange("sellingPrice")}
                  onBlur={handleBlur("sellingPrice")}
                  error={errors.sellingPrice}
                  touched={touched.sellingPrice}
                  icon={<Ionicons name="cash-outline" size={20} color={colors.SECONDARY} />}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.DARK} />
                <Text style={styles.saveBtnText}> Saving...</Text>
              </View>
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle" size={20} color={colors.DARK} />
                <Text style={styles.saveBtnText}> {btnLabel}</Text>
              </>
            )}
          </TouchableOpacity>

          {isEdit && onDelete && (
            <TouchableOpacity
              style={[styles.deleteBtn, loading && styles.btnDisabled]}
              onPress={onDelete}
              disabled={loading}
            >
              <Ionicons name="trash-outline" size={20} color={colors.LIGHT} />
              <Text style={styles.deleteBtnText}>
                Delete Item
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </Formik>
  );
}