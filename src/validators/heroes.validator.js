const Joi = require('joi');

const heroesPostSchema = Joi.object({
  name: Joi.string().required(),
  heroes_role_id: Joi.string().required(),
});
const heroesPutSchema = Joi.object({
  name: Joi.string().required(),
  heroes_role_id: Joi.string().required(),
});

module.exports = { heroesPostSchema, heroesPutSchema };
