import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { FileText } from "lucide-react-native";
import { useRouter } from "expo-router";
import colors from "../../../../../constants/colors";
import { useCustomerDetails } from "./_layout";

export default function CustomerInvoicesTab() {
  const { details } = useCustomerDetails();
  const router = useRouter();

  const { invoices } = details;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <FileText size={20} color={colors.DARK} />
        <Text style={styles.sectionTitle}>Invoices Issued ({invoices?.length || 0})</Text>
      </View>

      {invoices?.length > 0 ? (
        <View style={styles.cardsWrapper}>
          {invoices.map((invoice) => {
            const isPaid = invoice.isCompleted;
            const dateStr = new Date(invoice.createdAt).toLocaleDateString();
            const totalAmount = invoice.totalPrice ? `LKR ${invoice.totalPrice.toFixed(2)}` : 'LKR 0.00';
            const plateno = invoice.jobCard?.booking?.vehicle?.licensePlate || 'N/A';

            return (
              <TouchableOpacity
                key={invoice._id}
                style={styles.invoiceCard}
                onPress={() => {
                  if (invoice._id) {
                    router.push(`/(protected)/(admin)/invoice/${invoice._id}`);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.invoiceCardHeader}>
                  <Text style={styles.invoiceId}>{invoice.invoiceId}</Text>
                  <View style={[styles.invoiceBadge, isPaid ? styles.invoiceBadgePaid : styles.invoiceBadgeUnpaid]}>
                    <Text style={[styles.invoiceBadgeText, isPaid ? styles.invoiceBadgeTextPaid : styles.invoiceBadgeTextUnpaid]}>
                      {isPaid ? 'PAID' : 'UNPAID'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.invoiceVehicleInfo}>Vehicle: {plateno}</Text>

                <View style={styles.invoiceCardFooter}>
                  <Text style={styles.invoiceDateText}>{dateStr}</Text>
                  <Text style={styles.invoiceAmountText}>{totalAmount}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyBoxText}>No invoices issued.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.DARK,
    letterSpacing: -0.5,
  },
  cardsWrapper: {
    gap: 12,
    marginBottom: 24,
  },
  emptyBox: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  emptyBoxText: {
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "500",
  },
  invoiceCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  invoiceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceId: {
    color: colors.PRIMARY,
    fontWeight: '800',
    fontSize: 13,
  },
  invoiceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  invoiceBadgePaid: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)', 
  },
  invoiceBadgeUnpaid: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  invoiceBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  invoiceBadgeTextPaid: {
    color: '#22C55E', 
  },
  invoiceBadgeTextUnpaid: {
    color: '#F59E0B', 
  },
  invoiceVehicleInfo: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.DARK,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  invoiceCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  invoiceDateText: {
    fontSize: 13,
    color: colors.SECONDARY,
    fontWeight: '500',
  },
  invoiceAmountText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.DARK,
    letterSpacing: -0.5,
  },
});
