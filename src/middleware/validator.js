const InvariantError = require('../exceptions/InvariantError');

module.exports = (joiSchema) =>
  // eslint-disable-next-line implicit-arrow-linebreak, func-names
  function (req, res, next) {
    try {
      const validated = joiSchema.validate(req.body);
      if (validated.error) {
        throw Error(validated.error);
      }
      req.body = validated.value;
      return next();
    } catch (error) {
      throw new InvariantError(error.message.replace('ValidationError: ', ''));
    }
  };
