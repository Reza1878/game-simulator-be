const Joi = require('joi');

const adsPostSchema = Joi.object({
  ratio: Joi.string(),
});

const adsPutSchema = Joi.object({
  ratio: Joi.string(),
});

module.exports = { adsPostSchema, adsPutSchema };
