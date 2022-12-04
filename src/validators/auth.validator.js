const Joi = require('joi');

const authPostSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerPostSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

const forgotPasswordPostSchema = Joi.object({
  email: Joi.string().email().required(),
});

const validateForgotPasswordPostSchema = Joi.object({
  token: Joi.string().required(),
});

const resetPasswordPostSchema = Joi.object({
  token: Joi.string().required(),
  new_password: Joi.string().min(8).required(),
  new_password_confirmation: Joi.string().min(8).required(),
});

module.exports = {
  authPostSchema,
  registerPostSchema,
  forgotPasswordPostSchema,
  validateForgotPasswordPostSchema,
  resetPasswordPostSchema,
};
