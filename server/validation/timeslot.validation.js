const Joi = require("joi");

const timeslotSchema = Joi.object({
  startTime: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Start time must be in HH:mm format",
    }),
  endTime: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "End time must be in HH:mm format",
    }),
  maxCapacity: Joi.number().integer().min(1).default(1),
  isActive: Joi.boolean().default(true),
}).custom((value, helpers) => {
  if (value.startTime >= value.endTime) {
    return helpers.message("End time must be after start time");
  }
  return value;
});

const validateTimeslot = (data) => timeslotSchema.validate(data);

module.exports = {
  validateTimeslot,
};
