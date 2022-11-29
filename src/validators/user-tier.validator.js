const Joi = require('joi');

const userTierPostSchema = Joi.object({
  name: Joi.string().required(),
});

const userTierPutSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { userTierPostSchema, userTierPutSchema };
