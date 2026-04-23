import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { invoiceService } from "../../../../services/invoice/invoice.service";
import { serviceService } from "../../../../services/service/service.service";
import { userService } from "../../../../services/user/user.service";
import { inventoryService } from "../../../../services/inventory/inventory.service";
import SwipeableItemCard from "../../../../components/SwipeableItemCard";
import CustomerSearchResult from "../../../../components/CustomerSearchResult";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import DropdownInput from "../../../../components/DropdownInput";


export default function AddInvoice() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [inventory, setInventory] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableInventory, setAvailableInventory] = useState([]);

  // Customer Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  // Load Search History on Mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await AsyncStorage.getItem("invoice_search_history");
        if (history) setSearchHistory(JSON.parse(history));
      } catch (e) {
        console.error("Failed to load search history", e);
      }
    };
    loadHistory();
  }, []);

  // Save changes to Search History
  const updateSearchHistory = async (newHistory) => {
    setSearchHistory(newHistory);
    try {
      await AsyncStorage.setItem(
        "invoice_search_history",
        JSON.stringify(newHistory),
      );
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save search history",
      })
    }
  };

  const [customer, setCustomer] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [servicesData, inventoryData] = await Promise.all([
          serviceService.fetchServices(),
          inventoryService.fetchInventory(),
        ]);
        setAvailableServices(Array.isArray(servicesData) ? servicesData : []);
        setAvailableInventory(
          Array.isArray(inventoryData) ? inventoryData : [],
        );
      } catch (err) {
        if (err.response) {
          console.error("Error Status:", err.response.status);
          console.error(
            "Error Data:",
            JSON.stringify(err.response.data, null, 2),
          );
        }
      }
    };
    loadInitialData();
  }, []);

  // Customer Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 3) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      setIsSearching(true);
      const results = await userService.searchCustomersByMobile(query);
      setSearchResults(results);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCustomer = (selectedCust) => {
    setCustomer(selectedCust);
    setSearchQuery(selectedCust.mobile);
    setShowSuggestions(false);

    // Add to history if not exists
    if (!searchHistory.includes(selectedCust.mobile)) {
      const newHistory = [selectedCust.mobile, ...searchHistory].slice(0, 5);
      updateSearchHistory(newHistory);
    }
  };

  const addAdditionalService = (name) => {
    const srv = availableServices.find((s) => s.name === name);
    if (srv) {
      const newItem = {
        id: `srv-${Date.now()}`,
        dbId: srv._id || srv.id,
        type: "service",
        name: srv.name,
        price: srv.prices[0]?.price || 0,
        quantity: 1,
        icon: "cog-outline",
      };
      setInvoiceItems([...invoiceItems, newItem]);
      setService(""); // local UI state for dropdown reset remains
    }
  };

  const addInventoryItem = (name) => {
    const item = availableInventory.find((i) => i.name === name);
    if (item) {
      const newItem = {
        id: `inv-${Date.now()}`,
        dbId: item._id || item.id,
        type: "inventory",
        name: item.name,
        price: item.sellingPrice || 0,
        quantity: 1,
        icon: "cube-outline",
      };
      setInvoiceItems([...invoiceItems, newItem]);
      setInventory("");
    }
  };

  const updateItemQuantity = (id, newQty) => {
    const updatedItems = invoiceItems.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item,
    );
    setInvoiceItems(updatedItems);
  };

  const removeItem = (id) => {
    const updatedItems = invoiceItems.filter(
      (item) => item.id !== id,
    );
    setInvoiceItems(updatedItems);
  };

  const calculateTotal = () => {
    const itemsTotal = invoiceItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0,
    );
    return Math.max(0, itemsTotal - discount);
  };

  const formatPrice = (price) => {
    return (price || 0).toLocaleString("en-IN");
  };

  // Core Submission API Integration
  const handleGenerateInvoice = async (markPaid) => {
    try {
      if (!customer || !customer.mobile || customer.mobile.length !== 10) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: "A valid 10-digit customer mobile number is required.",
          position: "top",
        });
        return;
      }

      setLoading(true);

      // 1. Create the Base Invoice
      const createPayload = {
        customer: customer?._id,
      };

      // Consolidate additionalItems and additionalServices natively into the payload
      if (invoiceItems && invoiceItems.length > 0) {
        createPayload.additionalItems = invoiceItems
          .filter((item) => item.type !== "service")
          .map((item) => ({
            item: item.dbId,
            qty: item.quantity,
            sellingPrice: item.price,
          }));

        createPayload.additionalServices = invoiceItems
          .filter((item) => item.type === "service")
          .map((item) => ({
            service: item.dbId,
            charge: item.price,
          }));
      }

      const invoiceResp = await invoiceService.createInvoice(createPayload);

      // Attempt to extract the ID from common response structures
      const invoiceData = invoiceResp?.data?.payload;
      const invoiceId = invoiceData?.id;

      if (!invoiceId) {
        throw new Error("Failed to retrieve invoice ID from server");
      }

      // 3. Mark paid if requested
      if (markPaid) {
        await invoiceService.completeInvoice(invoiceId);
        Toast.show({
          type: "success",
          text1: "Invoice Generated",
          text2:
            invoiceResp?.data?.message || "Invoice successfully finalized.",
          position: "top",
        });
        router.replace(`/(protected)/(admin)/invoice/${invoiceId}`); // Navigate to Details page
      } else {
        Toast.show({
          type: "success",
          text1: "Draft Saved",
          text2: invoiceResp?.data?.payload?.message || "Draft saved successfully.",
          position: "top",
        });
        router.back();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Operation Failed",
        text2:
          error?.response?.data?.payload?.message ||
          error.message ||
          "A server error occurred during submission.",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Details */}
        <Text style={styles.sectionHeader}>CUSTOMER DETAILS</Text>
        <View style={styles.customer_container}>
          <View style={styles.customerRow}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.SECONDARY}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="License Plate or Mobile Number"
                placeholderTextColor={colors.SECONDARY}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {isSearching && (
                <ActivityIndicator
                  size="small"
                  color={colors.PRIMARY}
                  style={{ marginRight: 10 }}
                />
              )}
            </View>
          </View>

          {showSuggestions &&
            (searchQuery.length > 0 || searchHistory.length > 0) && (
              <View style={styles.suggestionsDropdown}>
                {/* History Section */}
                {searchQuery.length === 0 &&
                  searchHistory.map((item, index) => (
                    <CustomerSearchResult
                      key={`hist-${index}`}
                      title={item}
                      isHistory={true}
                      onPress={() => setSearchQuery(item)}
                    />
                  ))}

                {/* Results Section */}
                {searchResults.map((customer) => (
                  <CustomerSearchResult
                    key={customer._id}
                    title={customer.name}
                    subtitle={customer.mobile}
                    onPress={() => handleSelectCustomer(customer)}
                  />
                ))}

                {searchQuery.length >= 3 &&
                  searchResults.length === 0 &&
                  !isSearching && (
                    <View style={styles.noResultItem}>
                      <Text style={styles.noResultText}>
                        No customers found
                      </Text>
                    </View>
                  )}
              </View>
            )}
        </View>
        {customer && (
          <View style={styles.selectedCustomerCard}>
            <View style={styles.selectedCustomerInfo}>
              <Text style={styles.selectedCustomerName}>
                {customer.name}
              </Text>
              <Text style={styles.selectedCustomerMobile}>
                {customer.mobile}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setCustomer(null)}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.DANGER_COLOR}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 8 }} />

        {/* Service Selector */}
        <Text style={styles.sectionHeader}>ADDITIONAL SERVICE SELECTOR</Text>
        <DropdownInput
          value={service}
          options={(availableServices || [])
            .filter((s) => s.name)
            .map((s) => s.name)}
          onSelect={addAdditionalService}
          placeholder="Add Additional Service"
        />

        <View style={{ height: 16 }} />

        {/* Inventory Selector */}
        <Text style={styles.sectionHeader}>
          ADDITIONAL INVENTORY ITEM SELECTOR
        </Text>
        <DropdownInput
          value={inventory}
          options={(availableInventory || [])
            .filter((i) => i.name)
            .map((i) => i.name)}
          onSelect={addInventoryItem}
          placeholder="Add Additional Parts & Fluids"
        />

        <View style={{ height: 24 }} />

        {/* Invoice Items */}
        <View style={styles.itemsHeaderRow}>
          <Text style={styles.sectionHeader}>ADDED ITEMS & SERVICES</Text>
          <Text style={styles.itemsCountText}>
            {invoiceItems.length}{" "}
            Items Added
          </Text>
        </View>

        {invoiceItems.map((item) => (
          <SwipeableItemCard
            key={item.id}
            title={item.name}
            subtitle={
              item.type === "service" ? "Additional Service" : "Inventory Item"
            }
            price={`Rs. ${formatPrice(item.price * item.quantity)}`}
            icon={item.icon}
            quantity={item.type === "service" ? undefined : item.quantity}
            onUpdateQuantity={
              item.type === "service"
                ? undefined
                : (newQty) => updateItemQuantity(item.id, newQty)
            }
            onDelete={() => removeItem(item.id)}
          />
        ))}

        {invoiceItems.length === 0 && (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: colors.SECONDARY, fontSize: 13 }}>
              No items added yet
            </Text>
          </View>
        )}

        <View style={styles.dashedLineContainer}>
          <View style={styles.dashedLine} />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Summary & Actions */}
      <View style={styles.bottomPanel}>
        {/* Total Card */}
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.runningTotalLabel}>RUNNING TOTAL</Text>
            <View style={styles.totalAmountRow}>
              <Text style={styles.currencyLabel}>Rs.</Text>
              <View style={styles.amountValueContainer}>
                <Text style={styles.totalAmountSub}>
                  {formatPrice(calculateTotal())}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.discountBtn,
              discount > 0 && { backgroundColor: colors.DARK },
            ]}
            onPress={() => setShowDiscountInput(!showDiscountInput)}
          >
            {discount > 0 ? (
              <Text
                style={{ color: colors.LIGHT, fontWeight: "800", fontSize: 12 }}
              >
                -{discount}
              </Text>
            ) : (
              <MaterialCommunityIcons
                name="receipt-text-remove-outline"
                size={26}
                color={colors.DARK}
              />
            )}
          </TouchableOpacity>
        </View>

        {showDiscountInput && (
          <View style={styles.discountInputRow}>
            <TextInput
              style={styles.discountInput}
              placeholder="Enter Discount (Rs.)"
              keyboardType="numeric"
              value={discount.toString()}
              onChangeText={(text) => setDiscount(Number(text) || 0)}
              autoFocus
            />
            <TouchableOpacity
              style={styles.applyDiscountBtn}
              onPress={() => setShowDiscountInput(false)}
            >
              <Text style={styles.applyDiscountText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.saveDraftBtn}
          onPress={() => handleGenerateInvoice(false)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.LIGHT} />
          ) : (
            <>
              <Ionicons name="mail-outline" size={20} color={colors.LIGHT} />
              <Text style={styles.saveDraftText}>Save as Draft</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.generateBtn}
          onPress={() => handleGenerateInvoice(true)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.DARK} />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color={colors.DARK}
              />
              <Text style={styles.generateBtnText}>Generate & Mark Paid</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  customer_container: {
    position: "relative",
    zIndex: 100,
  },
  suggestionsDropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    maxHeight: 250,
    overflow: "hidden",
  },
  noResultItem: {
    padding: 20,
    alignItems: "center",
  },
  noResultText: {
    color: colors.SECONDARY,
    fontSize: 14,
  },
  selectedCustomerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(142, 219, 0, 0.05)",
    padding: 12,
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.PRIMARY + "30",
  },
  selectedCustomerName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.DARK,
  },
  selectedCustomerMobile: {
    fontSize: 12,
    color: colors.SECONDARY,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginBottom: 10,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    height: 48,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.DARK,
  },
  itemsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemsCountText: {
    fontSize: 13,
    color: "#94A3B8", // subtle slate
    fontWeight: "500",
  },
  dashedLineContainer: {
    height: 1,
    overflow: "hidden",
    marginTop: 10,
  },
  dashedLine: {
    height: 2,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderStyle: "dashed",
    marginTop: -1,
  },
  bottomPanel: {
    backgroundColor: colors.BACKGROUND_COLOR,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  totalCard: {
    backgroundColor: colors.DARK,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  runningTotalLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalAmountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  currencyLabel: {
    color: colors.PRIMARY,
    fontSize: 18,
    fontWeight: "800",
    marginRight: 4,
    marginBottom: 4,
  },
  amountValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  totalAmountMain: {
    color: colors.LIGHT,
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 40,
  },
  totalAmountSub: {
    color: colors.LIGHT,
    fontSize: 28,
    fontWeight: "900",
  },
  discountBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  saveDraftBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.DARK,
    height: 54,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveDraftText: {
    color: colors.LIGHT,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.PRIMARY,
    height: 54,
    borderRadius: 12,
  },
  generateBtnText: {
    color: colors.DARK,
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 8,
  },
  errorText: {
    color: colors.DANGER_COLOR,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  discountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  discountInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.LIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.DARK,
  },
  applyDiscountBtn: {
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  applyDiscountText: {
    color: colors.DARK,
    fontWeight: "700",
  },
});
