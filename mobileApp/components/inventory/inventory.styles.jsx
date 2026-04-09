import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

export const inventoryStyles = StyleSheet.create({
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

  filterRow: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 18,
  },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 18,
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginRight: 8,
    gap: 6,
  },

  activeFilterBtn: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.SECONDARY,
  },

  activeFilterText: {
    color: colors.DARK,
    fontWeight: "800",
  },

  filterCount: {
    backgroundColor: colors.SECONDARY,
    borderRadius: 10,
    paddingHorizontal: 4,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  filterCountText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.LIGHT,
  },

  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  listContent: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 140,
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

  formHeader: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: colors.LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },

  formHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.DARK,
    letterSpacing: 0.5,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  sectionCard: {
    backgroundColor: colors.LIGHT,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.SECONDARY,
    letterSpacing: 1,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 8,
  },

  inputGroup: {
    marginTop: 16,
  },

  formPriceRow: {
    flexDirection: "row",
    marginTop: 16,
  },

  saveBtn: {
    backgroundColor: colors.PRIMARY,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  saveBtnDisabled: {
    opacity: 0.7,
  },

  saveBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },

  updateBtn: {
    backgroundColor: colors.PRIMARY,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  updateBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },

  deleteBtn: {
    backgroundColor: colors.DANGER_COLOR,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    flexDirection: "row",
    gap: 8,
  },

  deleteBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.LIGHT,
  },

  btnDisabled: {
    opacity: 0.7,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  errorText: {
    fontSize: 12,
    color: colors.DANGER_COLOR,
    marginTop: 4,
    marginLeft: 4,
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.DARK,
    marginTop: 16,
  },

  errorMessage: {
    fontSize: 14,
    color: colors.SECONDARY,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  goBackBtn: {
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  goBackBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
  },
});