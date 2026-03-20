const Joi = require('joi');

const validateOrder = (data) => {
    const schema = Joi.object({
        items: Joi.array().items(
            Joi.object({
                qty: Joi.number().min(0).required().messages({
                    'number.min': 'Quantity cannot be a negative value',
                    'any.required': 'Quantity is required'
                }),
                cost: Joi.number().min(0).required().messages({
                    'number.min': 'Price cannot be a negative value',
                    'any.required': 'Price is required'
                })
            }).unknown(true) 
        ).required()
    }).unknown(true); 

    return schema.validate(data);
};

module.exports = { validateOrder };