const Joi = require('joi');

const settingPutSchema = Joi.object({
  email: Joi.string().required(),
  donation_link: Joi.string().required(),
});

module.exports = { settingPutSchema };
