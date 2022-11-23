const NotFoundError = require('../exceptions/NotFoundError');
const { Sequelize, HeroesRoles } = require('../models');
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

    const data = await HeroesRoles.findAll(params);
    const response = {
      status: 'success',
      message: 'Success get heroes role',
      data,
    };

    delete params.limit;
    delete params.offset;
    if (limit) {
      const totalItems = await HeroesRoles.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'total']],
      });

      const page = {
        totalItems: totalItems[0]?.dataValues?.total || 0,
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
    const data = await HeroesRoles.create(params);
    return createSuccessResponse(res, 'Success create heroes role', data, 201);
  } catch (error) {
    return next(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await HeroesRoles.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    return createSuccessResponse(res, 'Success get heroes role', item);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  const params = {
    name: req.body.name,
  };

  const item = await HeroesRoles.findByPk(id);
  if (!item) {
    return next(new NotFoundError());
  }
  await HeroesRoles.update(params, { where: { id } });
  return createSuccessResponse(res, 'Success update heroes role');
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const item = await HeroesRoles.findByPk(id);
  if (!item) {
    return next(new NotFoundError());
  }
  await HeroesRoles.destroy({ where: { id } });
  return createSuccessResponse(res, 'Success delete heroes role');
};
