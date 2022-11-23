const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { Teams, Sequelize } = require('../models');
const { createSuccessResponse } = require('../utils/response');

exports.findAll = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const params = {};
    if (limit) params.limit = +limit;
    if (offset) params.offset = +offset - 1;

    const data = await Teams.findAll(params);
    const response = {
      status: 'success',
      message: 'Success get teams',
      data,
    };
    delete params.limit;
    delete params.offset;
    if (limit) {
      const totalItems = await Teams.findAll({
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

exports.create = async (req, res, next) => {
  try {
    const params = {
      name: req.body.name,
      side: req.body.side,
    };
    const current = await Teams.findOne({ where: { side: req.body.side } });
    if (current) {
      return next(new InvariantError('Team side already exist'));
    }
    const data = await Teams.create(params);
    return createSuccessResponse(res, 'Success create team', data, 201);
  } catch (error) {
    return next(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Teams.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    return createSuccessResponse(res, 'Success get team', item);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Teams.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    const params = {
      name: req.body.name,
      side: req.body.side,
    };
    const current = await Teams.findOne({ where: { side: req.body.side } });
    if (current) {
      if (+current.id !== +id) {
        return next(new InvariantError('Team side already exist'));
      }
    }
    await Teams.update(params, { where: { id } });
    return createSuccessResponse(res, 'Success update team');
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Teams.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    await Teams.destroy({ where: { id } });
    return createSuccessResponse(res, 'Success delete team');
  } catch (error) {
    return next(error);
  }
};
