const enums = Object.freeze({
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
  LOG_PERIODS: {
    ALL: "",
    TODAY: "today",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
    CUSTOM: "custom",
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
  AVAILABLE_SKILLS: [
    "Engine Repair",
    "Electrical",
    "Body Wash",
    "Diagnostics",
    "Tire Service",
  ],
  INVOICE_STATUS: {
    COMPLETED: "COMPLETED",
    WORK_IN_PROGRESS: "WORK IN PROGRESS",
  },
  SUPPLY_CHAIN_TABS: {
    SUPPLIERS: "SUPPLIERS",
    SUPPLIES: "SUPPLIES",
  },
  SUPPLY_CHAIN_VIEWS: {
    LIST: "LIST",
    ADD_SUPPLIER: "ADD_SUPPLIER",
    EDIT_SUPPLIER: "EDIT_SUPPLIER",
    ADD_ORDER: "ADD_ORDER",
    EDIT_ORDER: "EDIT_ORDER",
  },
  REVIEW_FILTER_TABS: {
    ALL: "All",
    PUBLISHED: "Published",
  },
  REVIEW_ACTION_LABELS: {
    PUBLISH: "Publish",
    UNPUBLISH: "Unpublish",
  },
});

export default enums;