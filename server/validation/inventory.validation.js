const Joi = require('joi');
const { INVENTORY_UNIT_TYPES } = require('../util/constants');

const inventorySchema = Joi.object({
    name: Joi.string().required(),

    category: Joi.string().required(),

    qty: Joi.number()
        .min(0)
        .default(0),

    unitType: Joi.string()
        .valid(...Object.values(INVENTORY_UNIT_TYPES))
        .required(),

    reorderLevel: Joi.number()
        .min(0)
        .default(0),

    sellingPrice: Joi.number()
        .min(0)
        .required(),

    buyingPrice: Joi.number()
        .min(0)
        .required()
});

const stockAdjustmentSchema = Joi.object({
    quantityChange: Joi.number().required().not(0)
});

module.exports = { inventorySchema, stockAdjustmentSchema };