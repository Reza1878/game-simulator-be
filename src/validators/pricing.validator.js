const Joi = require('joi');

const pricingPostSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  features: Joi.string().required(),
  user_tier_id: Joi.number().required(),
  interval: Joi.string().valid('month', 'year').required(),
});

const pricingPutSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  features: Joi.string().required(),
  user_tier_id: Joi.number().required(),
  interval: Joi.string().valid('month', 'year').required(),
});

module.exports = { pricingPostSchema, pricingPutSchema };
