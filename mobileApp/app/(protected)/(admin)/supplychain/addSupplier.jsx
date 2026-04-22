import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Phone,
  PlusCircle,
  Trash2,
  Box,
} from "lucide-react-native";
import { Formik } from "formik";
import Toast from "react-native-toast-message";
import { ChevronDown } from "lucide-react-native";
import { supplierValidationSchema } from "../../../../schema/supplier.schema";
import { styles } from "./styles";
import DropdownInput from "../../../../components/DropdownInput";
import supplyChainService from "../../../../services/supplychain/supplychain.service";

const Form = {
  Item: ({ help, status, children, style }) => (
    <View style={style}>
      {children}
      {status === "error" && help ? (
        <Text
          style={{
            color: "#EF4444",
            fontSize: 12,
            marginTop: 4,
            marginBottom: 8,
          }}
        >
          {help}
        </Text>
      ) : null}
    </View>
  ),
};

export default function AddSupplier({ onBack }) {
  const initialValues = {
    companyName: "",
    agentName: "",
    companyMobile: [""],
    items: [""],
  };

  const [inventoryList, setInventoryList] = React.useState([]);

  React.useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await supplyChainService.getInventory();
        setInventoryList(data);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Fetch Error",
          text2: "Failed to load inventory list.",
        });
      }
    };
    fetchInventory();
  }, []);

  const handleSave = async (values, { setSubmitting }) => {
    try {
      await supplyChainService.createSupplier({
        companyName: values.companyName,
        agentName: values.agentName,
        companyMobile: values.companyMobile.filter((p) => p.trim() !== ""),
        items: values.items.filter((i) => i.trim() !== ""),
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Supplier saved successfully!",
        position: "bottom",
      });
      onBack();
    } catch (error) {
      const errorMessage =
        error.response?.data?.payload?.message || "Failed to save supplier";
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: errorMessage,
        position: "bottom",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ChevronLeft color="#84CC16" size={32} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ADD SUPPLIER</Text>
        <View style={{ width: 32 }} />
      </View>
      <Formik
        initialValues={initialValues}
        validationSchema={supplierValidationSchema}
        onSubmit={handleSave}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          isSubmitting,
        }) => (
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>
                Company Name <Text style={{ color: "red" }}>*</Text>
              </Text>
              <Form.Item
                help={
                  touched.companyName && errors.companyName
                    ? errors.companyName
                    : null
                }
                status={
                  touched.companyName && errors.companyName ? "error" : ""
                }
              >
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. AMW Genuine Parts"
                  value={values.companyName}
                  onChangeText={handleChange("companyName")}
                  onBlur={handleBlur("companyName")}
                  placeholderTextColor="#9CA3AF"
                />
              </Form.Item>

              <Text style={[styles.label, { marginTop: 15 }]}>Agent Name</Text>
              <Form.Item
                help={
                  touched.agentName && errors.agentName
                    ? errors.agentName
                    : null
                }
                status={touched.agentName && errors.agentName ? "error" : ""}
              >
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Anura Perera"
                  value={values.agentName}
                  onChangeText={handleChange("agentName")}
                  onBlur={handleBlur("agentName")}
                  placeholderTextColor="#9CA3AF"
                />
              </Form.Item>

              <View style={[styles.sectionTitleRow, { marginTop: 25 }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Phone size={18} color="#84CC16" />
                  <Text style={styles.sectionTitleText}>Mobile Numbers</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setFieldValue("companyMobile", [
                      ...values.companyMobile,
                      "",
                    ])
                  }
                >
                  <PlusCircle size={20} color="#84CC16" />
                </TouchableOpacity>
              </View>

              {typeof errors.companyMobile === "string" && (
                <Text
                  style={{ color: "#EF4444", fontSize: 12, marginBottom: 10 }}
                >
                  {errors.companyMobile}
                </Text>
              )}

              {values.companyMobile.map((p, index) => (
                <View
                  key={index}
                  style={[
                    styles.inputWithIconRow,
                    { marginBottom: 10, alignItems: "center" },
                  ]}
                >
                  <Form.Item
                    style={{ flex: 1 }}
                    help={
                      touched.companyMobile &&
                      errors.companyMobile &&
                      errors.companyMobile[index]
                        ? errors.companyMobile[index]
                        : null
                    }
                    status={
                      touched.companyMobile &&
                      errors.companyMobile &&
                      errors.companyMobile[index]
                        ? "error"
                        : ""
                    }
                  >
                    <TextInput
                      style={[styles.formInput, { flex: 1, marginBottom: 0 }]}
                      placeholder={`Phone Number ${index + 1}`}
                      value={p}
                      onChangeText={(val) => {
                        const newPhones = [...values.companyMobile];
                        newPhones[index] = val;
                        setFieldValue("companyMobile", newPhones);
                      }}
                      onBlur={handleBlur(`companyMobile[${index}]`)}
                      keyboardType="phone-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                  </Form.Item>
                  {values.companyMobile.length > 1 && (
                    <TouchableOpacity
                      onPress={() =>
                        setFieldValue(
                          "companyMobile",
                          values.companyMobile.filter((_, i) => i !== index),
                        )
                      }
                      style={{ marginLeft: 10 }}
                    >
                      <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {/* SUPPLIED ITEMS SECTION */}
              <View
                style={[
                  styles.sectionTitleRow,
                  { marginTop: 25, marginBottom: 15 },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Box size={18} color="#84CC16" />
                  <Text style={styles.sectionTitleText}>Supplied Items</Text>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F4FCE3",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#D9F99D",
                  }}
                  onPress={() => setFieldValue("items", [...values.items, ""])}
                >
                  <PlusCircle size={18} color="#84CC16" />
                  <Text
                    style={{
                      color: "#84CC16",
                      fontWeight: "bold",
                      marginLeft: 5,
                      fontSize: 12,
                    }}
                  >
                    Add Item
                  </Text>
                </TouchableOpacity>
              </View>

              {typeof errors.items === "string" && (
                <Text
                  style={{ color: "#EF4444", fontSize: 12, marginBottom: 10 }}
                >
                  {errors.items}
                </Text>
              )}

              {values.items.map((itemValue, index) => (
                <View key={index} style={{ marginBottom: 15 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>ITEM {index + 1}</Text>
                      <Form.Item
                        help={
                          touched.items && errors.items && errors.items[index]
                            ? errors.items[index]
                            : null
                        }
                        status={
                          touched.items && errors.items && errors.items[index]
                            ? "error"
                            : ""
                        }
                      >
                         <DropdownInput
                          value={itemValue}
                          options={inventoryList.map((invItem) => invItem.name)}
                          placeholder="Select item..."
                          modalTitle="Select Inventory Item"
                          onSelect={(val) => {
                            const newItems = [...values.items];
                            newItems[index] = val;
                            setFieldValue("items", newItems);
                          }}
                        />
                      </Form.Item>
                    </View>

                    {values.items.length > 1 && (
                      <TouchableOpacity
                        style={{ padding: 10, marginTop: 20, marginLeft: 5 }}
                        onPress={() =>
                          setFieldValue(
                            "items",
                            values.items.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <Trash2 size={24} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.saveSupplierBtn}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#1F2937" />
                ) : (
                  <Text style={styles.saveSupplierBtnText}>Save Supplier</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}
