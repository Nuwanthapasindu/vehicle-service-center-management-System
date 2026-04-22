import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ChevronDown,
  PlusCircle,
  Trash2,
  CheckCircle,
  Save,
} from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { styles } from "./styles";
import enums from "../../../../constants/enums";
import DropdownInput from "../../../../components/DropdownInput";
import { Formik } from "formik";
import { purchaseOrderSchema } from "../../../../schema/purchaseOrder.schema";
import supplyChainService from "../../../../services/supplychain/supplychain.service";

export default function AddOrder({ onBack }) {
  const initialValues = {
    supplier: null,
    items: [],
    status: enums.PURCHASE_ORDER_STATUS.DRAFT,
  };

  const [suppliers, setSuppliers] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);

  const fetchInventory = async (names = []) => {
    try {
      const data = await supplyChainService.getInventory(names);
      setInventoryList(data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Inventory Error",
        text2: "Failed to load filtered inventory data.",
      });
    }
  };

  React.useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliers = await supplyChainService.getSuppliers();
        setSuppliers(suppliers);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Supplier Error",
          text2: "Failed to load supplier data.",
        });
      }
    };
    fetchSuppliers();
  }, []);

  const handleSave = async (values, { setSubmitting }) => {
    const payload = {
      supplier: values.supplier._id,
      items: values.items.map((i) => ({
        itemId: i.itemId,
        qty: Number(i.qty),
        unitType: i.unitType || "Nos",
        cost: Number(i.price),
      })),
      status: values.status,
    };

    try {
      await supplyChainService.createPurchaseOrder(payload);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Purchase Order created successfully!",
      });
      onBack();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.response?.data?.payload?.message || err.message,
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
        <Text style={styles.headerTitle}>ADD NEW ORDER</Text>
        <View style={{ width: 32 }} />
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={purchaseOrderSchema}
        onSubmit={handleSave}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleSubmit,
          isSubmitting,
        }) => {
          React.useEffect(() => {
            if (values.supplier?.items && values.supplier.items.length > 0) {
              fetchInventory(values.supplier.items);
            } else {
              fetchInventory();
            }
          }, [values.supplier]);

          return (
            <>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.smallLabelCaps}>SELECT SUPPLIER</Text>
                <DropdownInput
                  value={values.supplier?.companyName}
                  options={suppliers.map((sup) => sup.companyName)}
                  placeholder="Choose a supplier..."
                  modalTitle="Select Supplier"
                  onSelect={(val) => {
                    const supplier = suppliers.find(
                      (s) => s.companyName === val,
                    );
                    if (supplier) {
                      if (values.supplier && values.supplier._id !== supplier._id) {
                        setFieldValue("items", []);
                      }
                      setFieldValue("supplier", supplier);
                    }
                  }}
                />
                {touched.supplier && errors.supplier && (
                  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {errors.supplier}
                  </Text>
                )}

                <View
                  style={[
                    styles.sectionTitleRow,
                    {
                      justifyContent: "space-between",
                      marginBottom: 15,
                      marginTop: 20,
                    },
                  ]}
                >
                  <Text style={styles.smallLabelCaps}>ORDER ITEMS</Text>
                  <TouchableOpacity
                    style={styles.addItemBtn}
                    onPress={() =>
                      setFieldValue("items", [
                        ...values.items,
                        {
                          id: Date.now().toString(),
                          name: "",
                          qty: "1",
                          price: "0",
                          itemId: "",
                        },
                      ])
                    }
                  >
                    <PlusCircle size={16} color="#84CC16" />
                    <Text style={styles.addItemText}>Add Item</Text>
                  </TouchableOpacity>
                </View>
                {touched.items && typeof errors.items === "string" && (
                  <Text
                    style={{ color: "red", fontSize: 12, marginBottom: 10 }}
                  >
                    {errors.items}
                  </Text>
                )}

                {values.items.map((item, index) => (
                  <View key={item.id} style={styles.orderItemCard}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text style={styles.tinyLabel}>SELECT ITEM</Text>
                      <TouchableOpacity
                        onPress={() =>
                          setFieldValue(
                            "items",
                            values.items.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <Trash2 size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    <DropdownInput
                      value={item.name}
                      options={inventoryList.map((inv) => inv.name)}
                      placeholder="Choose item..."
                      modalTitle="Select Inventory Item"
                      onSelect={(val) => {
                        const inv = inventoryList.find((i) => i.name === val);
                        if (inv) {
                          const newItems = [...values.items];
                          newItems[index] = {
                            ...newItems[index],
                            name: inv.name,
                            itemId: inv._id,
                            unitType: inv.unitType,
                            price: (inv.buyingPrice || 0).toString(),
                          };
                          setFieldValue("items", newItems);
                        }
                      }}
                    />
                    {touched.items?.[index]?.itemId &&
                      errors.items?.[index]?.itemId && (
                        <Text style={{ color: "red", fontSize: 10 }}>
                          {errors.items[index].itemId}
                        </Text>
                      )}

                    <View style={styles.inputRow}>
                      <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={styles.tinyLabel}>QUANTITY</Text>
                        <TextInput
                          style={styles.formInputSmall}
                          value={item.qty}
                          onChangeText={(val) =>
                            setFieldValue(`items[${index}].qty`, val)
                          }
                          keyboardType="numeric"
                        />
                        {touched.items?.[index]?.qty &&
                          errors.items?.[index]?.qty && (
                            <Text style={{ color: "red", fontSize: 10 }}>
                              {errors.items[index].qty}
                            </Text>
                          )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tinyLabel}>UNIT PRICE (Rs.)</Text>
                        <TextInput
                          style={styles.formInputSmall}
                          value={item.price}
                          onChangeText={(val) =>
                            setFieldValue(`items[${index}].price`, val)
                          }
                          keyboardType="numeric"
                        />
                        {touched.items?.[index]?.price &&
                          errors.items?.[index]?.price && (
                            <Text style={{ color: "red", fontSize: 10 }}>
                              {errors.items[index].price}
                            </Text>
                          )}
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View
                style={[
                  styles.footer,
                  { height: 160, justifyContent: "center" },
                ]}
              >
                <TouchableOpacity
                  style={styles.saveSupplierBtn}
                  disabled={isSubmitting}
                  onPress={async () => {
                    await setFieldValue(
                      "status",
                      enums.PURCHASE_ORDER_STATUS.SENT,
                    );
                    handleSubmit();
                  }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#1F2937" />
                  ) : (
                    <>
                      <CheckCircle
                        size={20}
                        color="#1F2937"
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.saveSupplierBtnText}>
                        PLACE ORDER
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveSupplierBtn,
                    {
                      backgroundColor: "#F3F4F6",
                      borderWidth: 1,
                      borderColor: "#D1D5DB",
                      marginTop: 10,
                    },
                  ]}
                  disabled={isSubmitting}
                  onPress={async () => {
                    await setFieldValue(
                      "status",
                      enums.PURCHASE_ORDER_STATUS.DRAFT,
                    );
                    handleSubmit();
                  }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#374151" />
                  ) : (
                    <>
                      <Save
                        size={20}
                        color="#374151"
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          styles.saveSupplierBtnText,
                          { color: "#374151" },
                        ]}
                      >
                        SAVE AS DRAFT
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
}
