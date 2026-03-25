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
});

export default enums;