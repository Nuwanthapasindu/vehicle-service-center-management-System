const Joi = require('joi');
const Inventory = require('../model/Inventory');

const categorySchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .pattern(/^[a-zA-Z0-9\s\-&]+$/)
        .messages({
            'string.empty': 'Category name is required',
            'string.min': 'Category name must be at least 2 characters',
            'string.max': 'Category name cannot exceed 50 characters',
            'string.pattern.base': 'Category name can only contain letters, numbers, spaces, hyphens, and ampersands',
            'any.required': 'Category name is required'
        })
});

const categoryIdSchema = Joi.string().hex().length(24).required().messages({
    'string.hex': 'Invalid category ID format',
    'string.length': 'Invalid category ID length',
    'any.required': 'Category ID is required'
});

const deleteCategoryValidation = (id) => {
    return categoryIdSchema.validate(id);
};

module.exports = { categorySchema, deleteCategoryValidation };