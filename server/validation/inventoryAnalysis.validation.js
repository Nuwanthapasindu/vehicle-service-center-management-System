const Joi = require('joi');

const analysisFilterSchema = Joi.object({
    period: Joi.string()
        .valid('today', 'weekly', 'monthly', 'yearly', 'custom', '30days')
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
        })
});

module.exports = { analysisFilterSchema };
