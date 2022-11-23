const Joi = require('joi');

const teamPostSchema = Joi.object({
  name: Joi.string().required(),
  side: Joi.string().required().valid('LEFT', 'RIGHT'),
});

const teamPutSchema = Joi.object({
  name: Joi.string().required(),
  side: Joi.string().required().valid('LEFT', 'RIGHT'),
});

module.exports = { teamPostSchema, teamPutSchema };
