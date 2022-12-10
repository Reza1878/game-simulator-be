const Joi = require('joi');

const heroesPostSchema = Joi.object({
  name: Joi.string().required(),
  heroes_role_id: Joi.array().items(Joi.number().required()),
});
const heroesPutSchema = Joi.object({
  name: Joi.string().required(),
  heroes_role_id: Joi.array().items(Joi.number().required()),
});

module.exports = { heroesPostSchema, heroesPutSchema };
