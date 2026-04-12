const Joi = require('joi');
const { INVENTORY_UNIT_TYPES } = require('../util/constants');

const inventorySchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .required()
        .pattern(/^[a-zA-Z0-9\s\-&]+$/)
        .messages({
            'string.empty': 'Item name is required',
            'string.min': 'Item name must be at least 2 characters',
            'string.pattern.base': 'Item name can only contain letters, numbers, spaces, hyphens, and ampersands',
            'any.required': 'Item name is required'
        }),

    category: Joi.string()
        .required()
        .messages({
            'string.empty': 'Category is required',
            'any.required': 'Category is required'
        }),

    qty: Joi.number()
        .min(0)
        .default(0),

    unitType: Joi.string()
        .valid(...Object.values(INVENTORY_UNIT_TYPES))
        .required()
        .messages({
            'any.only': 'Invalid unit type',
            'any.required': 'Unit type is required'
        }),

    reorderLevel: Joi.number()
        .min(0)
        .default(10)
        .messages({
            'number.base': 'Reorder level must be a number',
            'number.min': 'Reorder level cannot be negative'
        }),

    buyingPrice: Joi.number()
        .min(0)
        .positive()
        .required()
        .messages({
            'number.base': 'Buying price must be a number',
            'number.positive': 'Buying price must be greater than 0',
            'any.required': 'Buying price is required'
        }),

    sellingPrice: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.base': 'Selling price must be a number',
            'number.min': 'Selling price cannot be negative',
            'any.required': 'Selling price is required'
        })
})
.custom((value, helpers) => {
    if (
        value.sellingPrice !== undefined &&
        value.buyingPrice !== undefined &&
        value.sellingPrice < value.buyingPrice
    ) {
        return helpers.message(
            'Selling price cannot be less than buying price'
        );
    }
    return value;
});

const stockAdjustmentSchema = Joi.object({
    quantityChange: Joi.number()
        .required()
        .not(0)
        .messages({
            'any.required': 'Quantity change is required',
            'number.base': 'Quantity change must be a number',
            'any.invalid': 'Quantity change cannot be 0'
        })
});

module.exports = { inventorySchema, stockAdjustmentSchema };