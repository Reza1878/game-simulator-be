const Joi = require('joi');

const userSubscriptionPostSchema = Joi.object({
  pricing_id: Joi.number().required(),
});

module.exports = { userSubscriptionPostSchema };
