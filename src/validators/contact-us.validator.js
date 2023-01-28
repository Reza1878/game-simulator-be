const Joi = require('joi');

const contactUsPostSchema = Joi.object({
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().required(),
});

module.exports = { contactUsPostSchema };
