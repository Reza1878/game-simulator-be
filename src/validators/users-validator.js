const Joi = require('joi');

const usersPostSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string(),
});

const usersPutSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

module.exports = { usersPostSchema, usersPutSchema };
