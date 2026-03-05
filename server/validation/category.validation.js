const Joi = require('joi');

const categorySchema = Joi.object({
    name: Joi.string().trim().required()
});

module.exports = { categorySchema };