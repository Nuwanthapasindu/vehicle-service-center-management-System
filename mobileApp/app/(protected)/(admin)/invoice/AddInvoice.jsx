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
import { packageService } from "../../../../services/package/package.service";
import { useFormik } from "formik";
import { CreateInvoiceSchema } from "../../../../schema/invoice.schema";
import DateTimePicker from "@react-native-community/datetimepicker";


export default function AddInvoice() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      customer: null,
      selectedPackage: null,
      invoiceItems: [],
      discount: 0,
      markPaid: false,
      date: new Date(),
    },
    validationSchema: CreateInvoiceSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await handleGenerateInvoice(values, { setSubmitting });
    },
  });

  const { values, errors, touched, setFieldValue, handleSubmit } = formik;
  const { customer, selectedPackage, invoiceItems, discount, date } = values;

  const [service, setService] = useState("");
  const [inventory, setInventory] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableInventory, setAvailableInventory] = useState([]);

  // Package Selection States
  const [selectedPkgName, setSelectedPkgName] = useState("");
  const [availablePackages, setAvailablePackages] = useState([]);

  // Customer Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [servicesData, inventoryData, packagesData] = await Promise.all([
          serviceService.fetchServices(),
          inventoryService.fetchInventory(),
          packageService.fetchPackagesAdmin({ limit: 100 }),
        ]);
        setAvailableServices(Array.isArray(servicesData) ? servicesData : []);
        setAvailableInventory(
          Array.isArray(inventoryData) ? inventoryData : [],
        );
        const fetchedPackages = packagesData?.data?.payload?.packages || [];
        setAvailablePackages(Array.isArray(fetchedPackages) ? fetchedPackages : []);
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
    setFieldValue("customer", selectedCust);
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
        prices: srv.prices || [],
        quantity: 1,
        icon: "cog-outline",
      };
      setFieldValue("invoiceItems", [...invoiceItems, newItem]);
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
      setFieldValue("invoiceItems", [...invoiceItems, newItem]);
      setInventory("");
    }
  };

  const updateItemQuantity = (id, newQty) => {
    const updatedItems = invoiceItems.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item,
    );
    setFieldValue("invoiceItems", updatedItems);
  };

  const updateItemPrice = (id, newPrice) => {
    const updatedItems = invoiceItems.map((item) =>
      item.id === id ? { ...item, price: newPrice } : item,
    );
    setFieldValue("invoiceItems", updatedItems);
  };

  const updatePackagePrice = (newPrice) => {
    if (selectedPackage) {
      const pkg = availablePackages.find(p => p._id === selectedPackage.packageId || p.id === selectedPackage.packageId);
      let tierName = selectedPackage.tierName;
      if (pkg && pkg.pricingTiers) {
        const matchingTier = pkg.pricingTiers.find(t => t.price === newPrice);
        if (matchingTier) {
          tierName = matchingTier.name;
        }
      }
      setFieldValue("selectedPackage", { ...selectedPackage, price: newPrice, tierName });
    }
  };

  const removeItem = (id) => {
    const updatedItems = invoiceItems.filter(
      (item) => item.id !== id,
    );
    setFieldValue("invoiceItems", updatedItems);
  };

  const handleSelectPackage = (name) => {
    const pkg = availablePackages.find((p) => p.name === name);
    if (pkg) {
      if (pkg.pricingTiers && pkg.pricingTiers.length > 0) {
        const firstTier = pkg.pricingTiers[0];
        const newItem = {
          id: `pkg-${Date.now()}`,
          packageId: pkg._id || pkg.id,
          packageName: pkg.name,
          tierName: firstTier.name,
          price: firstTier.price,
          allTiers: pkg.pricingTiers,
          icon: "package-variant-closed"
        };
        setFieldValue("selectedPackage", newItem);
        setSelectedPkgName("");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "This package does not have any pricing tiers.",
        });
      }
    }
  };

  const calculateTotal = () => {
    let itemsTotal = invoiceItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0,
    );
    if (selectedPackage) {
      itemsTotal += (selectedPackage.price || 0);
    }
    return Math.max(0, itemsTotal - discount);
  };

  const formatPrice = (price) => {
    return (price || 0).toLocaleString("en-IN");
  };

  // Core Submission API Integration
  const handleGenerateInvoice = async (values, { setSubmitting }) => {
    try {
      setLoading(true);

      // 1. Create the Base Invoice
      const createPayload = {
        customer: values.customer?._id,
        date: values.date ? new Date(values.date).toISOString() : new Date().toISOString(),
      };

      if (values.selectedPackage) {
        createPayload.selectedPackage = {
          package: values.selectedPackage.packageId,
          selectedPackageTier: {
            name: values.selectedPackage.tierName,
            price: values.selectedPackage.price
          }
        };
      }

      // Consolidate additionalItems and additionalServices natively into the payload
      if (values.invoiceItems && values.invoiceItems.length > 0) {
        createPayload.additionalItems = values.invoiceItems
          .filter((item) => item.type !== "service")
          .map((item) => ({
            item: item.dbId,
            qty: item.quantity,
            sellingPrice: item.price,
          }));

        createPayload.additionalServices = values.invoiceItems
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
      if (values.markPaid) {
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
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice Date */}
        <Text style={styles.sectionHeader}>INVOICE DATE</Text>
        <TouchableOpacity
          style={styles.dateSelectorContainer}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.PRIMARY} style={{ marginRight: 10 }} />
          <Text style={styles.dateSelectorText}>
            {date ? new Date(date).toLocaleDateString() : "Select Invoice Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type === "set" && selectedDate) {
                setFieldValue("date", selectedDate);
              }
            }}
          />
        )}

        <View style={{ height: 20 }} />

        {/* Customer Details */}
        <Text style={styles.sectionHeader}>CUSTOMER DETAILS</Text>
        <View style={styles.customer_container}>
          <View style={styles.customerRow}>
            <View style={[styles.searchContainer, isSearchFocused && styles.searchContainerFocused]}>
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
                onFocus={() => {
                  setShowSuggestions(true);
                  setIsSearchFocused(true);
                }}
                onBlur={() => setIsSearchFocused(false)}
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
            <View style={styles.selectedCustomerAvatar}>
              <Ionicons name="person" size={20} color={colors.PRIMARY} />
            </View>
            <View style={styles.selectedCustomerInfo}>
              <Text style={styles.selectedCustomerName}>
                {customer.name}
              </Text>
              <Text style={styles.selectedCustomerMobile}>
                {customer.mobile}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removeCustomerBtn}
              onPress={() => setFieldValue("customer", null)}
            >
              <Ionicons
                name="close"
                size={18}
                color={colors.SECONDARY}
              />
            </TouchableOpacity>
          </View>
        )}
        {touched.customer && errors.customer && (
          <Text style={[styles.errorText, { marginTop: -10, marginBottom: 15 }]}>
            {typeof errors.customer === "string" ? errors.customer : errors.customer.mobile}
          </Text>
        )}

        <View style={{ height: 8 }} />

        {/* Selector Section Card */}
        <View style={styles.selectorCard}>
          <View style={styles.selectorCardHeader}>
            <MaterialCommunityIcons name="playlist-plus" size={22} color={colors.PRIMARY} />
            <Text style={styles.selectorCardTitle}>ADD SERVICES & INVENTORY</Text>
          </View>
          
          <View style={styles.selectorItem}>
            <Text style={styles.selectorItemLabel}>Service Package</Text>
            <DropdownInput
              value={selectedPkgName}
              options={(availablePackages || [])
                .filter((p) => p.name)
                .map((p) => p.name)}
              onSelect={handleSelectPackage}
              placeholder={selectedPackage ? "Package Already Selected" : "Select Package"}
              disabled={!!selectedPackage}
            />
          </View>

          <View style={styles.selectorItem}>
            <Text style={styles.selectorItemLabel}>Additional Service</Text>
            <DropdownInput
              value={service}
              options={(availableServices || [])
                .filter((s) => s.name)
                .map((s) => s.name)}
              onSelect={addAdditionalService}
              placeholder="Select Additional Service"
            />
          </View>

          <View style={styles.selectorItem}>
            <Text style={styles.selectorItemLabel}>Parts & Fluids</Text>
            <DropdownInput
              value={inventory}
              options={(availableInventory || [])
                .filter((i) => i.name)
                .map((i) => i.name)}
              onSelect={addInventoryItem}
              placeholder="Select Inventory Parts / Fluids"
            />
          </View>
        </View>

        <View style={{ height: 16 }} />

        {/* Invoice Items */}
        <View style={styles.itemsHeaderRow}>
          <Text style={styles.sectionHeader}>ADDED ITEMS & SERVICES</Text>
          <Text style={styles.itemsCountText}>
            {(invoiceItems.length + (selectedPackage ? 1 : 0))}{" "}
            Items Added
          </Text>
        </View>

        {selectedPackage && (
          <SwipeableItemCard
            title={selectedPackage.packageName}
            subtitle={`Package - ${selectedPackage.tierName}`}
            price={`Rs. ${formatPrice(selectedPackage.price)}`}
            icon="package-variant-closed"
            quantity={selectedPackage.price}
            isPrice={true}
            pricingTiers={(selectedPackage.allTiers || []).map((t) => ({
              model: t.name,
              price: t.price,
            }))}
            onUpdateQuantity={updatePackagePrice}
            onDelete={() => setFieldValue("selectedPackage", null)}
          />
        )}

        {invoiceItems.map((item) => (
          <SwipeableItemCard
            key={item.id}
            title={item.name}
            subtitle={
              item.type === "service" ? "Additional Service" : "Inventory Item"
            }
            price={`Rs. ${formatPrice(item.price * item.quantity)}`}
            icon={item.icon}
            quantity={item.type === "service" ? item.price : item.quantity}
            isPrice={item.type === "service"}
            pricingTiers={
              item.type === "service"
                ? (item.prices || []).map((p) => ({ model: p.model, price: p.price }))
                : []
            }
            onUpdateQuantity={(newVal) => {
              if (item.type === "service") {
                updateItemPrice(item.id, newVal);
              } else {
                updateItemQuantity(item.id, newVal);
              }
            }}
            onDelete={() => removeItem(item.id)}
          />
        ))}

        {invoiceItems.length === 0 && !selectedPackage && (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="cart-outline" size={32} color="#CBD5E1" />
            <Text style={styles.emptyStateText}>
              Billed items list is empty. Add a package or additional services/parts above.
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
              onChangeText={(text) => setFieldValue("discount", Number(text) || 0)}
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

        <View style={styles.actionRowButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.saveDraftBtn]}
            onPress={async () => {
              await setFieldValue("markPaid", false);
              handleSubmit();
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.LIGHT} />
            ) : (
              <>
                <Ionicons name="mail-outline" size={18} color={colors.LIGHT} />
                <Text style={styles.actionBtnText}>Save Draft</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.generateBtn]}
            onPress={async () => {
              await setFieldValue("markPaid", true);
              handleSubmit();
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.DARK} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.DARK}
                />
                <Text style={[styles.actionBtnText, { color: colors.DARK }]}>Generate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    height: 52,
    paddingHorizontal: 16,
  },
  searchContainerFocused: {
    borderColor: colors.PRIMARY,
    borderWidth: 1.5,
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
    backgroundColor: colors.DARK,
  },
  generateBtn: {
    backgroundColor: colors.PRIMARY,
  },
  actionRowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 12,
  },
  actionBtnText: {
    color: colors.LIGHT,
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 6,
  },
  selectedCustomerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(142, 219, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  removeCustomerBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  selectorCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectorCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  selectorCardTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.DARK,
    letterSpacing: 0.5,
  },
  selectorItem: {
    marginBottom: 14,
  },
  selectorItemLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.SECONDARY,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyStateContainer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderStyle: "dashed",
    marginTop: 4,
  },
  emptyStateText: {
    color: colors.SECONDARY,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
    fontWeight: "500",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.LIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  modalHeader: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.SECONDARY,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  optItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR + "40",
  },
  optText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.DARK,
  },
  dateSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  dateSelectorText: {
    fontSize: 15,
    color: colors.DARK,
    fontWeight: "700",
  },
});
