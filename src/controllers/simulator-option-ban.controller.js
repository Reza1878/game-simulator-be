const NotFoundError = require('../exceptions/NotFoundError');
const { SimulatorOptionBans } = require('../models');
const { createSuccessResponse } = require('../utils/response');

exports.findAll = async (req, res, next) => {
  try {
    const data = await SimulatorOptionBans.findAll();
    return createSuccessResponse(
      res,
      'Success get simulator option bans',
      data,
    );
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const params = {
      ban_count: req.body.ban_count,
    };
    const data = await SimulatorOptionBans.create(params);
    return createSuccessResponse(
      res,
      'Success create simulator option bans',
      data,
      201,
    );
  } catch (error) {
    return next(new Error());
  }
};

exports.findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await SimulatorOptionBans.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    return createSuccessResponse(res, 'Success get simulator option ban', item);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = {
      ban_count: req.params.ban_count,
    };
    const item = await SimulatorOptionBans.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    await SimulatorOptionBans.update(params, { where: { id } });
    return createSuccessResponse(res, 'Success update simulator option ban');
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await SimulatorOptionBans.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    await SimulatorOptionBans.destroy({ where: { id } });
    return createSuccessResponse(res, 'Success delete simulator option ban');
  } catch (error) {
    return next(new Error());
  }
};
