import { StyleSheet, Platform } from "react-native";
import colors from "../../constants/colors";

export const stockStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },

  topHeader: {
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    marginBottom: 4,
  },

  headerRightSpace: {
    width: 40,
  },

  searchBox: {
    marginHorizontal: 12,
    marginTop: 14,
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    paddingVertical: 0,
    color: colors.DARK,
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  clearSearchBtn: {
    padding: 4,
    marginLeft: 4,
  },

  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  listContent: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 110,
  },

  card: {
    backgroundColor: colors.LIGHT,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.BACKGROUND_COLOR,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },

  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  infoSection: {
    flex: 1,
  },

  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.DARK,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },

  productMeta: {
    fontSize: 11,
    color: colors.SECONDARY,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.PRIMARY,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  badgeIcon: {
    marginRight: 2,
  },

  inStockBadge: {
    backgroundColor: "#E8F8EC",
  },

  lowStockBadge: {
    backgroundColor: "#FFF3E0",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  inStockText: {
    color: "#16A34A",
  },

  lowStockText: {
    color: "#F59E0B",
  },

  divider: {
    height: 1,
    backgroundColor: colors.BORDER_COLOR,
    marginVertical: 10,
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reorderWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
  },

  reorderText: {
    fontSize: 11,
    color: colors.SECONDARY,
    fontWeight: "500",
  },

  qtyBadge: {
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 70,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },

  qtyNormalBadge: {
    backgroundColor: colors.BACKGROUND_COLOR,
  },

  qtyLowBadge: {
    backgroundColor: "#F59E0B",
  },

  qtyText: {
    fontWeight: "800",
    fontSize: 11,
  },

  qtyIcon: {
    marginRight: 2,
  },

  qtyNormalText: {
    color: colors.DARK,
  },

  qtyLowText: {
    color: colors.LIGHT,
  },

  emptyWrap: {
    paddingTop: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: colors.SECONDARY,
    fontWeight: "600",
  },

  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.SECONDARY,
    fontWeight: "500",
  },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "flex-end" 
  },
  dismissArea: { 
    ...StyleSheet.absoluteFillObject 
  },
  modalSheet: { 
    backgroundColor: colors.LIGHT, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    paddingBottom: Platform.OS === "ios" ? 40 : 20 
  },
  modalHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.BORDER_COLOR 
  },
  modalHeading: { 
    fontSize: 18, 
    fontWeight: "700",
    color: colors.DARK 
  },
  modalBody: { 
    padding: 20 
  },
  
  itemCard: { 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR, 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 20,
    backgroundColor: colors.LIGHT
  },
  cardLabel: { 
    fontSize: 10, 
    color: colors.SECONDARY, 
    fontWeight: "700", 
    marginBottom: 4 
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: colors.DARK, 
    marginBottom: 8 
  },
  stockRow: { 
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 4
  },
  stockLabel: { 
    fontSize: 13, 
    color: colors.SECONDARY 
  },
  stockBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 12 
  },
  stockValue: { 
    fontWeight: "600", 
    fontSize: 12 
  },
  modalReorderText: {
    fontSize: 11,
    color: colors.SECONDARY,
    marginTop: 4
  },

  adjustmentLabel: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: colors.DARK, 
    marginBottom: 12 
  },
  stepperContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 8 
  },
  stepBtn: { 
    width: 60, 
    height: 60, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: colors.LIGHT
  },
  inputWrapper: { 
    flex: 1, 
    height: 60, 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR, 
    borderRadius: 12, 
    marginHorizontal: 10,
    justifyContent: "center",
    backgroundColor: colors.LIGHT
  },
  qtyInput: { 
    textAlign: "center", 
    fontSize: 24, 
    fontWeight: "bold",
    color: colors.DARK
  },
  inputError: {
    color: colors.DANGER_COLOR,
  },
  hintText: { 
    fontSize: 12, 
    color: colors.SECONDARY, 
    textAlign: "left", 
    marginBottom: 25 
  },
  errorText: {
    fontSize: 12,
    color: colors.DANGER_COLOR,
    textAlign: "left",
    marginBottom: 25,
  },

  infoBox: { 
    flexDirection: "row", 
    backgroundColor: "#EFF6FF", 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 25,
    alignItems: "center"
  },
  infoText: { 
    flex: 1, 
    fontSize: 12, 
    color: "#1E40AF", 
    marginLeft: 8, 
    lineHeight: 18 
  },

  updateBtn: { 
    backgroundColor: colors.PRIMARY, 
    height: 55, 
    borderRadius: 12, 
    flexDirection: "row",
    justifyContent: "center", 
    alignItems: "center",
    gap: 8
  },
  increaseBtn: {
    backgroundColor: colors.PRIMARY
  },
  decreaseBtn: {
    backgroundColor: colors.DANGER_COLOR
  },
  updateBtnText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: colors.DARK 
  }
});
