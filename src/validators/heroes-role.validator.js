const Joi = require('joi');

const heroesRolePostSchema = Joi.object({
  name: Joi.string().required(),
});

const heroesRolePutSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { heroesRolePostSchema, heroesRolePutSchema };
