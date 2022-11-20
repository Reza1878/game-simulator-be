const Joi = require('joi');

const simulatorOptionBanPostSchema = Joi.object({
  ban_count: Joi.number().required(),
});

const simulatorOptionBanPutSchema = Joi.object({
  ban_count: Joi.number().required(),
});

module.exports = { simulatorOptionBanPostSchema, simulatorOptionBanPutSchema };
