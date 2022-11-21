const Joi = require('joi');

const pricingPostSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  features: Joi.string().required(),
});

const pricingPutSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  features: Joi.string().required(),
});

module.exports = { pricingPostSchema, pricingPutSchema };
