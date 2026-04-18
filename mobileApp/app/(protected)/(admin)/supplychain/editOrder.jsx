import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Trash2,
  CheckCircle2,
  FileText,
} from "lucide-react-native";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { styles } from "./styles";
import CustomButton from "../../../../components/CustomButton";
import enums from "../../../../constants/enums";
import supplyChainService from "../../../../services/supplychain/supplychain.service";

export default function EditOrder({ order, onBack }) {
  const displayOrder = order || {};

  const isPending = displayOrder?.status === enums.PURCHASE_ORDER_STATUS.SENT;
  const isDraft = displayOrder?.status === enums.PURCHASE_ORDER_STATUS.DRAFT;

  const handleUpdateStatus = async (newStatus) => {
    try {
      await supplyChainService.updatePurchaseOrder(displayOrder._id, {
        status: newStatus,
      });

      if (newStatus === enums.PURCHASE_ORDER_STATUS.RECEIVED) {
        const itemsWithId = (displayOrder.items || []).filter(
          (i) => !!(i.itemId?._id || i.itemId),
        );

        if (itemsWithId.length !== (displayOrder.items || []).length) {
          return Toast.show({
            type: "error",
            text1: "Error",
            text2: "Order contains items not linked to inventory. Cannot update stock automatically.",
          });
        }

        const inventoryPayload = {
          items: itemsWithId.map((i) => ({
            inventoryId: i.itemId._id || i.itemId,
            quantityReceived: i.qty,
          })),
        };
        await supplyChainService.increaseStock(inventoryPayload);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Order marked as Received and Inventory Stock updated!",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Order marked as ${newStatus}`,
        });
      }
      onBack();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.response?.data?.payload?.message || err.message || "Could not update order",
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await supplyChainService.deletePurchaseOrder(displayOrder._id);
              Toast.show({ type: "success", text1: "Deleted", text2: "Order removed" });
              onBack();
            } catch (err) {
              Toast.show({ type: "error", text1: "Error", text2: "Could not delete order" });
            }
          },
        },
      ],
    );
  };

  const generatePDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { margin: 0; color: #1F2937; }
              .details { margin-bottom: 20px; }
              .details p { margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #E5E7EB; }
              th { background-color: #F9FAFB; color: #374151; }
              .total { margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PURCHASE ORDER</h1>
            </div>
            <div class="details">
              <p><strong>Order ID:</strong> ${displayOrder?._id || "N/A"}</p>
              <p><strong>Supplier:</strong> ${displayOrder?.supplier?.companyName || "Unknown Supplier"}</p>
              <p><strong>Status:</strong> ${displayOrder?.status || "Unknown"}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>QTY</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${(displayOrder?.items || [])
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.itemId?.name || item.name || "Unknown Item"}</td>
                    <td>${item.qty} ${item.unitType || "Nos"}</td>
                    <td>Rs. ${item.cost || 0}</td>
                    <td>Rs. ${(item.cost || 0) * (item.qty || 0)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="total">
              <p>Total Cost: Rs. ${(displayOrder?.items || []).reduce((sum, item) => sum + (item.cost || 0) * (item.qty || 1), 0)}</p>
            </div>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to generate PDF" });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ChevronLeft color="#84CC16" size={32} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ORDER DETAILS</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.tinyLabel}>SUPPLIER INFO</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {displayOrder?.supplier?.companyName || "Unknown Supplier"}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>
            Status: {displayOrder?.status}
          </Text>
        </View>

        <Text style={styles.tinyLabel}>ORDER ITEMS</Text>
        {displayOrder?.items?.map((item, index) => (
          <View key={item._id || index} style={styles.orderItemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>
                {item.itemId?.name || item.name || "Unknown Item"}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.tinyLabel}>
                QTY: {item.qty} {item.unitType}
              </Text>
              <Text style={styles.tinyLabel}>COST: Rs.{item.cost}</Text>
            </View>
          </View>
        ))}

        <View style={{ marginTop: 20, alignItems: "flex-end" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Total: Rs. {displayOrder?.totalCost || 0}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 20 }]}>
        <CustomButton
          text="DOWNLOAD PDF"
          icon={<FileText size={18} color="#1F2937" />}
          onPress={generatePDF}
          style={[
            styles.saveSupplierBtn,
            { backgroundColor: "#E5E7EB", marginBottom: 10 },
          ]}
          textStyle={[styles.saveSupplierBtnText, { color: "#1F2937" }]}
          iconStyle={{ marginLeft: 8 }}
        />
        {isPending ? (
          <View>
            <CustomButton
              text="MARK AS RECEIVED"
              icon={<CheckCircle2 size={20} color="#1F2937" />}
              onPress={() => handleUpdateStatus(enums.PURCHASE_ORDER_STATUS.RECEIVED)}
              style={styles.saveSupplierBtn}
              textStyle={styles.saveSupplierBtnText}
              iconStyle={{ marginLeft: 8 }}
            />

            <CustomButton
              text="DELETE ORDER"
              icon={<Trash2 size={18} color="#EF4444" />}
              onPress={handleDelete}
              style={[
                styles.saveSupplierBtn,
                {
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: "#EF4444",
                  marginTop: 10,
                },
              ]}
              textStyle={[styles.saveSupplierBtnText, { color: "#EF4444" }]}
              iconStyle={{ marginRight: 8 }}
            />
          </View>
        ) : isDraft ? (
          <View>
            <CustomButton
              text="MARK AS SENT"
              icon={<CheckCircle2 size={20} color="#1F2937" />}
              onPress={() => handleUpdateStatus(enums.PURCHASE_ORDER_STATUS.SENT)}
              style={styles.saveSupplierBtn}
              textStyle={styles.saveSupplierBtnText}
              iconStyle={{ marginLeft: 8 }}
            />

            <CustomButton
              text="DELETE ORDER"
              icon={<Trash2 size={18} color="#EF4444" />}
              onPress={handleDelete}
              style={[
                styles.saveSupplierBtn,
                {
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: "#EF4444",
                  marginTop: 10,
                },
              ]}
              textStyle={[styles.saveSupplierBtnText, { color: "#EF4444" }]}
              iconStyle={{ marginRight: 8 }}
            />
          </View>
        ) : (
          <CustomButton
            text="DELETE RECORD"
            icon={<Trash2 size={18} color="#EF4444" />}
            onPress={handleDelete}
            style={[
              styles.saveSupplierBtn,
              {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: "#EF4444",
              },
            ]}
            textStyle={[styles.saveSupplierBtnText, { color: "#EF4444" }]}
            iconStyle={{ marginRight: 8 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
