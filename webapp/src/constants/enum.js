// TODO: ADD ENUM FIELDS

export const enums = Object.freeze({
  DEFAULT_ERROR_MESSAGE: "Something went wrong. Please try again later.",
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
    COUNT: "Count",
    LITERS: "Liters",
  },
  INVENTORY_ACTION_TYPES: {
    USAGE: "USAGE",
    RESTOCK: "RESTOCK",
    ADJUSTMENT: "ADJUSTMENT",
    WASTE: "WASTE",
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
  PASSWORD_LABELS: {
    WEAK: "WEAK",
    FAIR: "FAIR",
    GOOD: "GOOD",
    STRONG: "STRONG",
  }
});

export const CONFIGURATION = Object.freeze({
  ACCESS_TOKEN_KEY: "ACCESS_TOKEN",
  REFRESH_TOKEN_KEY: "REFRESH_TOKEN",
  MOBILE_NUMBER_KEY: "MOBILE_NUMBER",
});
