const Joi = require('joi');

const settingPutSchema = Joi.object({
  email: Joi.string().required(),
});

module.exports = { settingPutSchema };
