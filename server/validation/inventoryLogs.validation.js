const Joi = require('joi');
const { INVENTORY_ACTION_TYPES, LOG_PERIODS } = require('../util/constants');

const logFilterSchema = Joi.object({
    inventoryId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'Invalid Inventory ID format'
        }),
    
    actionType: Joi.string()
        .valid(...Object.values(INVENTORY_ACTION_TYPES))
        .allow('')
        .messages({
            'any.only': 'Invalid action type'
        }),

    period: Joi.string()
        .valid(...Object.values(LOG_PERIODS))
        .allow('')
        .messages({
            'any.only': 'Invalid period filter'
        }),

    startDate: Joi.date()
        .iso()
        .messages({
            'date.format': 'Start date must be in ISO format'
        }),

    endDate: Joi.date()
        .iso()
        .min(Joi.ref('startDate'))
        .messages({
            'date.format': 'End date must be in ISO format',
            'date.min': 'End date cannot be before start date'
        }),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20),

    timezoneOffset: Joi.number()
        .allow(null, '')
}).with('startDate', 'endDate');

module.exports = { logFilterSchema };
