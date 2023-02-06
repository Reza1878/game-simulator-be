/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');
const UnauthorizedError = require('../exceptions/UnauthorizedError');
const { Users } = require('../models');
const { checkUserSession } = require('../utils/session');

module.exports = () => {
  const callback = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(new UnauthorizedError('Unauthorized'));
    }
    const token = authorizationHeader.split('Bearer ')[1];
    if (!token) {
      return next(new UnauthorizedError('Unauthorized'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      const user = await Users.findByPk(decoded.user_id);
      await checkUserSession(user);
      req.user = decoded;
    } catch (error) {
      return next(new AuthenticationError('Invalid token'));
    }
    return next();
  };
  return callback;
};
