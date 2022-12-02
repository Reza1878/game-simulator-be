const { Users } = require('../models');
const UnauthorizedError = require('../exceptions/UnauthorizedError');

module.exports = () => {
  const callback = async (req, res, next) => {
    const { user_id: userId } = req.user;
    const admin = await Users.findOne({ where: { id: userId, role: 'admin' } });
    if (!admin) {
      return next(new UnauthorizedError('Unauthorized'));
    }
    return next();
  };
  return callback;
};
