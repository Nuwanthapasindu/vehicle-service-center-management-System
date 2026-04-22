import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, ActivityIndicator, Modal, FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import colors from "../../../../constants/colors";
import getImageFullUrl from "../../../../utils/getImageFullUrl";
import getStatusColor from "../../../../utils/getStatusColor";
import DropdownInput from "../../../../components/DropdownInput";
import CustomInput from "../../../../components/CustomInput";
import { useFormik } from "formik";
import { createJobCardSchema } from "../../../../schema/jobCardSchema";
import Toast from "react-native-toast-message";
import enums from "../../../../constants/enums";
import FALLBACK_IMG from "../../../../assets/default-car.png";

const { height } = Dimensions.get("window");

export default function BookingDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Dropdown States
  const [packages, setPackages] = useState([]);
  const [statusZone, setStatusZone] = useState(enums.JOBCARD_STATUS.PENDING);
  const [isGenerated, setIsGenerated] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  // Formik for Input Validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      booking: id || "",
      milageCount: "",
      selectedPackage: "",
      selectedTier: null,
      assignedTeam: null,
    },
    validationSchema: createJobCardSchema,
    onSubmit: async (values) => {
      if (!data?.customer?._id) return Toast.show({ type: "error", text1: "Error", text2: "Customer data not loaded" });

      try {
        setLoading(true);

        let newJobId = data?.service?.jobCardId;

        if (!newJobId) {
          // 1. Create Job Card
          const jobPayload = {
            booking: id,
            selectedPackage: values.selectedPackage,
            milageCount: Number(values.milageCount),
          };
          const jobResponse = await axios.post("/job-cards", jobPayload);
          newJobId = jobResponse.data?.payload?.data?._id;

          if (!newJobId) throw new Error("Failed to extract Job Card ID from server");

          // 2. Assign Team
          if (values.assignedTeam) {
            await axios.patch("/job-cards/assign", {
              jobCardId: newJobId,
              teamId: values.assignedTeam,
            });
          }
        }

        // 3. Create New Invoice
        const invoicePayload = {
          jobCard: newJobId,
          selectedPackage: {
            package: values.selectedPackage,
            selectedPackageTier: {
              name: values.selectedTier.name,
              price: Number(values.selectedTier.price),
            },
          },
        };
        const invoiceResponse = await axios.post("/invoice", invoicePayload);

        Toast.show({
          type: "success",
          text1: "Job Started Successfully",
          text2: invoiceResponse.data?.payload?.message,
        });

        setIsGenerated(true);
        fetchData();

      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Pipeline Error",
          text2: err.response?.data?.payload?.message || err.response?.data?.message || err.message || "Operation failed",
        });
      } finally {
        setLoading(false);
      }
    },
  });


  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setData(null);
    formik.resetForm();
    setImgError(false);
    setIsGenerated(false);
    setInvoiceDetails(null);
    setStatusZone(enums.JOBCARD_STATUS.PENDING);

    try {
      // Fetch Booking Details and Packages in parallel to reconcile them
      const [bookingResponse, pkgResponse] = await Promise.all([
        axios.get(`/booking/admin/${id}/details`),
        axios.get(`/package/public`)
      ]);
      const details = bookingResponse.data?.payload?.data;
      const allPackages = pkgResponse.data?.payload?.packages || [];
      setData(details);
      setPackages(allPackages);

      if (details.assignedTeam) formik.setFieldValue("assignedTeam", details.assignedTeam);

      // Hydrate selections using the full packages list to ensure pricingTiers are available
      if (details.service && details.service.package) {
        setIsGenerated(true);

        if (details.service.jobCardId) {
          try {
            const invoiceRes = await axios.get(`/invoice/jobcard/${details.service.jobCardId}`);
            setInvoiceDetails(invoiceRes.data?.payload?.data || invoiceRes.data?.data);
          } catch (e) {
            setInvoiceDetails(null);
          }
        }

        if (details.service.milageCount !== undefined && details.service.milageCount !== null) {
          formik.setFieldValue("milageCount", String(details.service.milageCount));
        }

        const fullPkg = allPackages.find(p => p.name === details.service.package);
        if (fullPkg) {
          formik.setFieldValue("selectedPackage", fullPkg._id);
          if (details.service.pricingTier) {
            const fullTier = fullPkg.pricingTiers?.find(t => t.name === details.service.pricingTier);
            if (fullTier) {
              formik.setFieldValue("selectedTier", fullTier);
            }
          }
        } else {
          // Fallback if full package info is not found (Needs ID string)
          const fallbackPkg = allPackages.find(p => p.name === details.service.package);
          if (fallbackPkg) formik.setFieldValue("selectedPackage", String(fallbackPkg._id || fallbackPkg.id));
        }
        setStatusZone(details.service.statusZone || enums.JOBCARD_STATUS.PENDING);
      }

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.payload?.message || "Failed to fetch booking details",
      });
      router.push("/(protected)/(admin)/booking");
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: colors.SECONDARY }}>Booking not found.</Text>
        <TouchableOpacity onPress={() => router.push("/(protected)/(admin)/booking")} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.PRIMARY, fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const imagePath = typeof data.vehicle.image === 'object' ? data.vehicle.image?.filePath : data.vehicle.image;
  const imgSource = imagePath ? { uri: getImageFullUrl(imagePath) } : FALLBACK_IMG;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(protected)/(admin)/booking")}>
          <Ionicons name="chevron-back" size={28} color={colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Schedule Info */}
        <View style={styles.section}>
          <Text style={styles.subtext}>SCHEDULED FOR</Text>
          <Text style={styles.dateText}>{data.date}</Text>
          <View style={styles.timeBadgeRow}>
            <Ionicons name="time-outline" size={16} color={colors.SECONDARY} />
            <Text style={styles.timeText}>{data.time || "Unknown"}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusZone === enums.JOBCARD_STATUS.PENDING ? "#FEF3C7" : "#E0F2FE" }]}>
            <View style={[styles.dot, { backgroundColor: getStatusColor(statusZone) }]} />
            <Text style={[styles.statusBadgeText, { color: getStatusColor(statusZone) }]}>{statusZone}</Text>
          </View>
        </View>

        {/* Customer & Vehicle Card */}
        <View style={styles.card}>
          <View style={styles.customerRow}>
            <View>
              <Text style={styles.customerName}>{data.customer.name || "Unknown Customer"}</Text>
              <View style={styles.vehicleInfoRow}>
                <Ionicons name="car-outline" size={14} color={colors.SECONDARY} />
                <Text style={styles.vehicleInfoText}>
                  {data.vehicle.name || "Unknown Vehicle"} • {data.vehicle.plate || "Unknown"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call-outline" size={20} color={colors.DARK} />
            </TouchableOpacity>
          </View>
          <Image
            source={imgError ? FALLBACK_IMG : imgSource}
            style={styles.vehicleImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        </View>

        {/* Service Details */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="build-outline" size={16} color={colors.SECONDARY} />
          <Text style={styles.sectionHeaderText}>SERVICE DETAILS</Text>
        </View>

        <View style={styles.card}>
          <CustomInput
            label="Vehicle Milage (km)"
            placeholder="e.g. 45000"
            keyboardType="numeric"
            icon={<Ionicons name="speedometer-outline" size={18} color={colors.SECONDARY} />}
            value={String(formik.values.milageCount)}
            onChangeText={formik.handleChange("milageCount")}
            onBlur={formik.handleBlur("milageCount")}
            error={formik.errors.milageCount}
            touched={formik.touched.milageCount}
            editable={!isGenerated}
          />

          <Text style={styles.label}>Assign Package</Text>
          <DropdownInput
            value={packages.find(p => String(p._id || p.id) === String(formik.values.selectedPackage))?.name || null}
            options={packages.map(p => p.name)}
            placeholder="Pending Selection"
            modalTitle="Assign Package"
            disabled={isGenerated}
            onSelect={(name) => {
              const pkg = packages.find(p => p.name === name);
              if (pkg) {
                formik.setFieldValue("selectedPackage", String(pkg._id));
                formik.setFieldTouched("selectedPackage", true, false);
                formik.setFieldValue("selectedTier", null);
              }
            }}
          />
          {formik.touched.selectedPackage && formik.errors.selectedPackage && (
            <Text style={{ color: colors.DANGER_COLOR, fontSize: 12, marginTop: -4 }}>{formik.errors.selectedPackage}</Text>
          )}

          <Text style={styles.label}>Select Pricing tier</Text>
          <DropdownInput
            value={formik.values.selectedTier ? (formik.values.selectedTier.price !== undefined ? `${formik.values.selectedTier.name} - LKR ${formik.values.selectedTier.price}` : formik.values.selectedTier.name) : null}
            options={packages.find(p => String(p._id || p.id) === String(formik.values.selectedPackage))?.pricingTiers?.map(t => `${t.name} - LKR ${t.price}`) || []}
            placeholder="Pending Selection"
            modalTitle="Select Pricing tier"
            disabled={isGenerated}
            onSelect={(str) => {
              const selPkg = packages.find(p => String(p._id || p.id) === String(formik.values.selectedPackage));
              if (selPkg && selPkg.pricingTiers) {
                const tr = selPkg.pricingTiers.find(t => `${t.name} - LKR ${t.price}` === str);
                if (tr) {
                   formik.setFieldValue("selectedTier", tr);
                   formik.setFieldTouched("selectedTier", true, false);
                }
              }
            }}
          />
          {formik.touched.selectedTier && formik.errors.selectedTier && (
            <Text style={{ color: colors.DANGER_COLOR, fontSize: 12, marginTop: -4 }}>{formik.errors.selectedTier}</Text>
          )}
        </View>

        {/* Team Assignment */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="people-outline" size={16} color={colors.SECONDARY} />
          <Text style={styles.sectionHeaderText}>TEAM ASSIGNMENT</Text>
        </View>
        
        {formik.touched.assignedTeam && formik.errors.assignedTeam && (
          <Text style={{ color: colors.DANGER_COLOR, fontSize: 13, alignSelf: 'center', marginBottom: 10 }}>{formik.errors.assignedTeam}</Text>
        )}

        <View style={styles.teamList}>
          {data.teams.map((team) => {
            const teamStatus = team.status || "Available Now";
            const teamColor = team.statusColor || "#8EDB00";
            const isAssigned = formik.values.assignedTeam === team.id;
            const isBusy = teamColor === "#EF4444";

            return (
              <View key={team.id} style={styles.teamCard}>
                <View style={styles.teamInfo}>
                  <View style={styles.teamAvatar}>
                    <Text style={styles.teamAvatarText}>
                      {team.name.split(" ").map(w => w.charAt(0)).join("").substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <View style={styles.teamStatusRow}>
                      <View style={[styles.dot, { backgroundColor: teamColor }]} />
                      <Text style={styles.teamStatusText}>{teamStatus}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.assignButton,
                    isAssigned && styles.assignedButton,
                    isBusy && styles.disabledButton,
                    isGenerated && styles.disabledButton
                  ]}
                  disabled={isBusy || isGenerated}
                  onPress={() => isAssigned ? formik.setFieldValue("assignedTeam", null) : formik.setFieldValue("assignedTeam", team.id)}
                >
                  <Text style={[
                    styles.assignButtonText,
                    isBusy && styles.disabledButtonText,
                    isAssigned && styles.assignedButtonText
                  ]}>
                    {isAssigned ? "Assigned" : "Assign"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Dynamic Invoice Render Block */}
        {isGenerated && invoiceDetails && (
          <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
            <Ionicons name="receipt" size={16} color={colors.PRIMARY} />
            <Text style={styles.sectionHeaderText}>GENERATED INVOICE RECORD</Text>
          </View>
        )}
        
        {isGenerated && invoiceDetails && (
          <View style={[styles.card, { borderColor: colors.PRIMARY_LIGHT, borderWidth: 1 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
               <Text style={{ fontFamily: "Outfit-Bold", color: colors.DARK }}>Invoice ID</Text>
               <Text style={{ fontFamily: "Outfit-Regular", color: colors.SECONDARY }}>{invoiceDetails.invoiceId || invoiceDetails._id}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
               <Text style={{ fontFamily: "Outfit-Bold", color: colors.DARK }}>Package Price</Text>
               <Text style={{ fontFamily: "Outfit-Regular", color: colors.SECONDARY }}>LKR {invoiceDetails.selectedPackage?.selectedPackageTier?.price || "0"}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
               <Text style={{ fontFamily: "Outfit-Bold", color: colors.DARK }}>Job Status</Text>
               <Text style={{ fontFamily: "Outfit-Bold", color: invoiceDetails.isCompleted ? "#10B981" : "#F59E0B" }}>
                 {invoiceDetails.isCompleted ? "COMPLETED" : "IN PROGRESS"}
               </Text>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        {!invoiceDetails && statusZone !== enums.JOBCARD_STATUS.FINISH && (
          <TouchableOpacity style={styles.saveButton} onPress={formik.handleSubmit}>
            <Text style={styles.saveButtonText}>{isGenerated ? "GENERATE INVOICE" : "SAVE & GENERATE"}</Text>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.DARK} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        )}
        {invoiceDetails && (
          <TouchableOpacity style={styles.invoiceButton} onPress={() => router.push(`/(protected)/(admin)/invoice/${invoiceDetails._id}`)}>
            <Ionicons name="receipt-outline" size={20} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.invoiceButtonText}>View / Manage Invoice</Text>
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    flex: 1,
    textAlign: "right",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  subtext: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.DARK,
    marginBottom: 8,
  },
  timeBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.SECONDARY,
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  customerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 4,
  },
  vehicleInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleInfoText: {
    fontSize: 13,
    color: colors.SECONDARY,
    marginLeft: 4,
    fontWeight: "500",
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FBB0",
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: colors.BORDER_COLOR // added background color so it doesn't look completely invisible while loading
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.SECONDARY,
    letterSpacing: 1,
    marginLeft: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 6,
    marginTop: 10,
  },
  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: colors.DARK,
  },
  teamList: {
    gap: 12,
    paddingBottom: 20,
  },
  teamCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.DARK, // Changed to dark for contrast
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  teamAvatarText: {
    color: "#FFF",
    fontSize: 15, // reduced size slightly to fit 2 characters better
    fontWeight: "800",
  },
  teamName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.DARK,
    marginBottom: 2,
  },
  teamStatusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamStatusText: {
    fontSize: 12,
    color: colors.SECONDARY,
  },
  assignButton: {
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignedButton: {
    backgroundColor: colors.DARK,
  },
  assignedButtonText: {
    color: "#FFF",
  },
  disabledButton: {
    backgroundColor: "#F3F4F6",
  },
  assignButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.DARK,
  },
  disabledButtonText: {
    color: colors.SECONDARY,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
    gap: 12,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
  },
  invoiceButton: {
    flexDirection: "row",
    backgroundColor: colors.DARK,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  invoiceButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.BACKGROUND_COLOR,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
    paddingBottom: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: colors.BORDER_COLOR,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  dropdownOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: colors.DARK,
    fontWeight: '600'
  }
});
