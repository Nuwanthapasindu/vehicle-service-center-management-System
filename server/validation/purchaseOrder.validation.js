const joi = require("joi");
const validator = require("./core");
const { PURCHASE_ORDER_STATUS, INVENTORY_UNIT_TYPES } = require("../util/constants");

const purchaseOrderItemsSchema = joi.object({
  itemId: joi.string().required().messages({
    "any.required": "Item ID is required for each line item.",
    "string.empty": "Item ID is required for each line item.",
  }),
  qty: joi.number().greater(0).required().messages({
    "number.greater": "Quantity must be greater than 0.",
    "any.required": "Quantity is required.",
  }),
  unitType: joi.string()
    .valid(...Object.values(INVENTORY_UNIT_TYPES))
    .required()
    .messages({
      "any.only": "Invalid unit type provided.",
      "any.required": "Unit type is required.",
    }),
  cost: joi.number().min(0).allow(null, ""),
});

const purchaseOrderValidationSchema = joi.object({
  supplier: joi.string().required().messages({
    "any.required": "Supplier is required.",
    "string.empty": "Supplier is required.",
  }),
  items: joi.array().items(purchaseOrderItemsSchema).min(1).required().messages({
    "array.min": "At least one item must be added to the purchase order.",
  }),
  status: joi.string()
    .valid(...Object.values(PURCHASE_ORDER_STATUS))
    .default(PURCHASE_ORDER_STATUS.DRAFT)
    .messages({
      "any.only": "Invalid status provided.",
    }),
  expectedDate: joi.date().allow(null, ""),
});

module.exports.purchaseOrderValidator = validator(purchaseOrderValidationSchema);

module.exports.purchaseOrderUpdateValidator = validator(
  purchaseOrderValidationSchema.fork(
    ["supplier", "items"],
    (schema) => schema.optional()
  )
);
