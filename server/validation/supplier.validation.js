const Joi = require('joi');

const validateSupplier = (data) => {
    const schema = Joi.object({
        companyName: Joi.string().min(3).required().messages({
            'string.min': 'Company name must be at least 3 characters long',
            'any.required': 'Company name is required'
        }),
        companyMobile: Joi.array().items(
            Joi.string().length(10).pattern(/^[0-9]+$/).messages({
                'string.length': 'Mobile number must be exactly 10 digits',
                'string.pattern.base': 'Mobile numbers can only contain numbers',
                'string.empty': 'Mobile number cannot be empty'
            })
        ).min(1).required().messages({
            'array.min': 'At least one mobile number is required',
            'any.required': 'Mobile numbers are required'
        })
    }).unknown(true);

    return schema.validate(data);
};

module.exports = { validateSupplier };