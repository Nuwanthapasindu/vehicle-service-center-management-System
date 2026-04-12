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
} from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { invoiceService } from "../../../../services/invoice/invoice.service";
import { serviceService } from "../../../../services/service/service.service";
import { packageService } from "../../../../services/package/package.service";
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
  const [availablePackages, setAvailablePackages] = useState([]);
  const [availableInventory, setAvailableInventory] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);

  // Customer Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [servicesData, packagesData, inventoryData] = await Promise.all([
          serviceService.fetchServices(),
          packageService.fetchPackages(),
          inventoryService.fetchInventory()
        ]);
        setAvailableServices(Array.isArray(servicesData) ? servicesData : []);
        setAvailablePackages(Array.isArray(packagesData) ? packagesData : []);
        setAvailableInventory(Array.isArray(inventoryData) ? inventoryData : []);
        
        console.log("Available Inventory:", inventoryData);
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

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery(customer.mobile);
    setShowSuggestions(false);
    
    // Add to history if not exists
    if (!searchHistory.includes(customer.mobile)) {
      setSearchHistory(prev => [customer.mobile, ...prev].slice(0, 5));
    }
  };

  const addAdditionalService = (name) => {
    const srv = availableServices.find(s => s.name === name);
    if (srv) {
      const newItem = {
        id: `srv-${Date.now()}`,
        type: 'service',
        name: srv.name,
        price: srv.prices[0]?.price || 0, // Fallback to first price entry
        quantity: 1,
        icon: 'cog-outline'
      };
      setInvoiceItems(prev => [...prev, newItem]);
      setService(""); // Reset dropdown
    }
  };

  const addInventoryItem = (name) => {
    const item = availableInventory.find(i => i.name === name);
    if (item) {
      const newItem = {
        id: `inv-${Date.now()}`,
        type: 'inventory',
        name: item.name,
        price: item.sellingPrice || 0,
        quantity: 1,
        icon: 'cube-outline'
      };
      setInvoiceItems(prev => [...prev, newItem]);
      setInventory(""); // Reset dropdown
    }
  };

  const updateItemQuantity = (id, newQty) => {
    setInvoiceItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  const removeItem = (id) => {
    setInvoiceItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    const tierPrice = selectedTier?.price || 0;
    const itemsTotal = invoiceItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    return tierPrice + itemsTotal;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-IN');
  };

  // Core Submission API Integration
  const handleGenerateInvoice = async (markPaid) => {
    try {
      setLoading(true);

      /**
       * CRITICAL TODO:
       * Replace this payload constructor with the actual Dropdown Input states.
       * The API STRICTLY REQUIRES valid Hex Mongoose Object IDs for:
       * - customer (or jobCard)
       * - selectedPackage.package
       */
      const payload = {
        customer: "insert_customer_mongo_id_here",
        selectedPackage: {
          package: "insert_package_mongo_id_here",
          selectedPackageTier: {
            name: "Default Tier",
            price: 0,
          },
        },
      };

      // 1. Initialize the empty pending Invoice wrapper
      /*
      const invoiceResp = await invoiceService.createInvoice(payload);
      const invoiceId = invoiceResp._id; // Evaluate proper path based on post callback

      // 2. Map over added Services & Inventory array inside state natively using `addInvoiceItem`
      // await Promise.all(addedItemsArray.map(item => invoiceService.addInvoiceItem(invoiceId, mappedData)));

      // 3. Mark paid conditionally
      if (markPaid) {
          await invoiceService.completeInvoice(invoiceId);
      }
      */

      Toast.show({
        type: "success",
        text1: markPaid
          ? "Invoice Generated & Marked Paid"
          : "Draft Saved successfully",
        position: "top",
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Generation Failed",
        text2:
          error?.response?.data?.message ||
          "Invalid selections or server error occurred.",
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
        {/* Package & Tier Selection */}
        <Text style={styles.sectionHeader}>SELECT SERVICE PACKAGE</Text>
        <DropdownInput
          value={selectedPackage?.name}
          options={(availablePackages || []).map((p) => p.name)}
          onSelect={(name) => {
            const pkg = availablePackages.find((p) => p.name === name);
            setSelectedPackage(pkg);
            setSelectedTier(null); // Reset tier when package changes
          }}
          placeholder="Choose Base Package"
        />

        {selectedPackage && (
          <>
            <View style={{ height: 16 }} />
            <Text style={styles.sectionHeader}>SELECT PRICING TIER</Text>
            <DropdownInput
              value={selectedTier?.name}
              options={selectedPackage.pricingTiers.map((t) => t.name)}
              onSelect={(name) => {
                const tier = selectedPackage.pricingTiers.find(
                  (t) => t.name === name,
                );
                setSelectedTier(tier);
              }}
              placeholder="Choose Package Tier"
            />
          </>
        )}

        <View style={{ height: 24 }} />

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
              {isSearching && <ActivityIndicator size="small" color={colors.PRIMARY} style={{marginRight: 10}} />}
            </View>
          </View>

          {showSuggestions && (searchQuery.length > 0 || searchHistory.length > 0) && (
            <View style={styles.suggestionsDropdown}>
              {/* History Section */}
              {searchQuery.length === 0 && searchHistory.map((item, index) => (
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

              {searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
                <View style={styles.noResultItem}>
                  <Text style={styles.noResultText}>No customers found</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {selectedCustomer && (
          <View style={styles.selectedCustomerCard}>
            <View style={styles.selectedCustomerInfo}>
              <Text style={styles.selectedCustomerName}>{selectedCustomer.name}</Text>
              <Text style={styles.selectedCustomerMobile}>{selectedCustomer.mobile}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedCustomer(null)}>
               <Ionicons name="close-circle" size={20} color={colors.DANGER_COLOR} />
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
          <Text style={styles.itemsCountText}>{invoiceItems.length + (selectedTier ? 1 : 0)} Items Added</Text>
        </View>

        {/* Package Item (Fixed if selected) */}
        {selectedPackage && selectedTier && (
          <SwipeableItemCard
            title={selectedPackage.name}
            subtitle={`${selectedTier.name} Tier`}
            price={`Rs. ${formatPrice(selectedTier.price)}`}
            icon="card-outline"
            onDelete={() => {
               setSelectedPackage(null);
               setSelectedTier(null);
            }}
          />
        )}

        {/* Dynamically Added Items */}
        {invoiceItems.map((item) => (
          <SwipeableItemCard
            key={item.id}
            title={item.name}
            subtitle={item.type === 'service' ? 'Additional Service' : 'Inventory Item'}
            price={`Rs. ${formatPrice(item.price * item.quantity)}`}
            icon={item.icon}
            quantity={item.quantity}
            onUpdateQuantity={(newQty) => updateItemQuantity(item.id, newQty)}
            onDelete={() => removeItem(item.id)}
          />
        ))}

        {invoiceItems.length === 0 && !selectedTier && (
           <View style={{padding: 40, alignItems: 'center'}}>
              <Text style={{color: colors.SECONDARY, fontSize: 13}}>No items added yet</Text>
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
          <TouchableOpacity style={styles.discountBtn}>
            <MaterialCommunityIcons
              name="receipt-text-remove-outline"
              size={26}
              color={colors.DARK}
            />
          </TouchableOpacity>
        </View>

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
    position: 'relative',
    zIndex: 100,
  },
  suggestionsDropdown: {
    position: 'absolute',
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
    overflow: 'hidden',
  },
  noResultItem: {
    padding: 20,
    alignItems: 'center',
  },
  noResultText: {
    color: colors.SECONDARY,
    fontSize: 14,
  },
  selectedCustomerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(142, 219, 0, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.PRIMARY + "30",
  },
  selectedCustomerName: {
    fontSize: 14,
    fontWeight: '700',
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
});
