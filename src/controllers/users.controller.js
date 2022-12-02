const bcrypt = require('bcrypt');
const { Users, Sequelize } = require('../models');
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

exports.findAll = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const params = {};
    if (limit) params.limit = +limit;
    if (offset) params.offset = +offset - 1;
    const data = await Users.findAll(params);
    const response = {
      status: 'success',
      message: 'Success get user',
      data: data.map((item) => {
        const { dataValues } = item;
        delete dataValues.password;
        return dataValues;
      }),
    };
    if (limit) {
      const totalItems = await Users.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'total']],
      });

      const page = {
        totalItems: parseInt(totalItems[0]?.dataValues?.total || 0, 10),
        limit: +limit,
        page: +offset,
      };
      response.page = page;
    }
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};
