const path = require('path');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { Ads, Sequelize } = require('../models');
const { deleteFile } = require('../utils/file');
const { createSuccessResponse } = require('../utils/response');

exports.findAll = async (req, res, next) => {
  try {
    const { limit = 0, offset } = req.query;
    const params = {};
    if (offset) params.offset = (+offset - 1) * limit;
    if (limit) params.limit = +limit;

    const data = await Ads.findAll({ ...params });
    const response = {
      status: 'success',
      message: 'Success get ads data',
      data,
    };
    delete params.limit;
    delete params.offset;

    if (limit) {
      const totalItems = await Ads.findAll({
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
  let imageUrl = null;
  try {
    imageUrl = req.file?.filename;
    if (!imageUrl) {
      throw new InvariantError('Image is required');
    }
    const params = {
      ratio: req.body.ratio,
      image_url: imageUrl,
    };
    const ads = await Ads.create(params);
    return createSuccessResponse(res, 'Success create ads', ads, 201);
  } catch (error) {
    if (imageUrl) {
      deleteFile(path.join(__dirname, '..', 'uploads', imageUrl));
    }
    return next(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ads = await Ads.findOne({ where: { id } });
    if (!ads) {
      throw new NotFoundError();
    }
    return createSuccessResponse(res, 'Success get ads', ads);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  let imageUrl = null;
  try {
    const { id } = req.params;
    const ads = await Ads.findByPk(id);
    if (!ads) {
      throw new NotFoundError();
    }
    imageUrl = req.file ? req.file?.filename : null;
    const params = {
      ratio: req.body.ratio,
    };
    if (imageUrl) {
      params.image_url = imageUrl;
    }
    await Ads.update(params, { where: { id } });

    return createSuccessResponse(res, 'Success update ads');
  } catch (error) {
    if (imageUrl) {
      deleteFile(path.join(__dirname, '..', 'uploads', imageUrl));
    }
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const ads = await Ads.findByPk(id);
  if (!ads) {
    return next(new NotFoundError());
  }
  deleteFile(path.join(__dirname, '..', 'uploads', ads.image_url));
  await ads.destroy();
  return createSuccessResponse(res, 'Success delete ads');
};
