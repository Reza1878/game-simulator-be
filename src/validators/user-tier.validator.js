const Joi = require('joi');

const userTierPostSchema = Joi.object({
  name: Joi.string().required(),
  max_session: Joi.number().required(),
});

const userTierPutSchema = Joi.object({
  name: Joi.string().required(),
  max_session: Joi.number().required(),
});

module.exports = { userTierPostSchema, userTierPutSchema };
