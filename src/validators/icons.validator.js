const Joi = require('joi');

const iconsPostSchema = Joi.object({
  name: Joi.string().required(),
});

const iconsPutSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { iconsPostSchema, iconsPutSchema };
