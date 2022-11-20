const bcrypt = require('bcrypt');
const { Users } = require('../models');
const { createSuccessResponse } = require('../utils/response');

exports.create = async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const params = {
      name: req.body.name,
      email: req.body.email,
      password,
      role: req.body.role,
    };

    const data = await Users.create(params);
    return createSuccessResponse(res, 'Success create user', data, 201);
  } catch (error) {
    return next(error);
  }
};
