/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');
const UnauthorizedError = require('../exceptions/UnauthorizedError');

module.exports = () => {
  const callback = (req, res, next) => {
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
      req.user = decoded;
    } catch (error) {
      return next(new AuthenticationError('Invalid token'));
    }
    return next();
  };
  return callback;
};
