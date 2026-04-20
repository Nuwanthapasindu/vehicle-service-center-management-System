module.exports = Object.freeze({
  USER_ROLES: {
    ADMIN: "ADMIN",
    MECHANIC: "MECHANIC",
    CUSTOMER: "CUSTOMER",
  },
  GENDERS: {
    MALE: "MALE",
    FEMALE: "FEMALE",
  },
  VEHICLE_TYPES: {
    CAR: "CAR",
    VAN: "VAN",
    SUV: "SUV",
    JEEP: "JEEP",
  },
  JOBCARD_STATUS: {
    PENDING: "PENDING",
    START: "START",
    FINISH: "FINISH",
  },
  INVENTORY_UNIT_TYPES: {
    LITERS: "Liters",
    PIECES: "Pieces",
    UNITS: "Units",
    PAIRS: "Pairs",
    SETS: "Sets"
  },
  INVENTORY_ACTION_TYPES: {
    MANUAL_ADJUSTMENT: "Manual Adjustment",
    INVOICE_SALE: "Invoice Sale",
    PO_RECEIVE: "PO Receive",
    RESTOCK: "Restock"
  },
  PURCHASE_ORDER_STATUS: {
    DRAFT: "Draft",
    SENT: "Sent",
    RECEIVED: "Received",
  },
  MESSAGE_TYPES: {
    INSTANT: "INSTANT",
    SCHEDULE: "SCHEDULE",
    PROMOTIONAL: "PROMOTIONAL",
    TRANSACTIONAL: "TRANSACTIONAL",
  },
  INVOICE_ITEM_TYPES: {
    OIL: "OIL",
    OTHER: "OTHER",
  },
  INVOICE_UPDATE_TYPES: {
    ITEM: "ITEM",
    SERVICE: "SERVICE",
  },
  LOG_PERIODS: {
    ALL: "",
    TODAY: "today",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
    CUSTOM: "custom",
  },
});
