const NotFoundError = require('../exceptions/NotFoundError');
const { UserTiers, Sequelize } = require('../models');
const { createSuccessResponse } = require('../utils/response');

exports.findAll = async (req, res, next) => {
  try {
    const { limit, offset, name } = req.query;
    const params = {};
    if (limit) params.limit = +limit;
    if (offset) params.offset = +offset - 1;
    if (name) {
      params.where = {
        ...params.where,
        name: { [Sequelize.Op.like]: `%${name}%` },
      };
    }

    const data = await UserTiers.findAll(params);
    const response = {
      status: 'success',
      message: 'Success get tiers',
      data,
    };
    delete params.limit;
    delete params.offset;
    if (limit) {
      const totalItems = await UserTiers.findAll({
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
    };
    const data = await UserTiers.create(params);
    return createSuccessResponse(res, 'Success create user tier', data, 201);
  } catch (error) {
    return next(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await UserTiers.findByPk(id);
    if (!item) {
      throw new NotFoundError();
    }
    return createSuccessResponse(res, 'Success get tier', item);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await UserTiers.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    const params = {
      name: req.body.name,
    };
    await UserTiers.update(params, { where: { id } });
    return createSuccessResponse(res, 'Success update tier');
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await UserTiers.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    await UserTiers.destroy({ where: { id } });
    return createSuccessResponse(res, 'Success delete tier');
  } catch (error) {
    return next(error);
  }
};
