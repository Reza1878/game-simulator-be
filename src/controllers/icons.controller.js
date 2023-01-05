const path = require('path');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { Icons, Sequelize } = require('../models');
const { deleteFile } = require('../utils/file');
const { createSuccessResponse } = require('../utils/response');

exports.findAll = async (req, res, next) => {
  try {
    const { limit = 0, offset, name = null } = req.query;
    const params = {};
    if (offset) params.offset = (+offset - 1) * limit;
    if (limit) params.limit = +limit;
    if (name) {
      params.where = {
        name: { [Sequelize.Op.like]: `%${name}%` },
      };
    }

    const data = await Icons.findAll({ ...params });
    const response = {
      status: 'success',
      message: 'Success get icons data',
      data,
    };
    delete params.limit;
    delete params.offset;

    if (limit) {
      const totalItems = await Icons.findAll({
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
      name: req.body.name,
      image_url: imageUrl,
    };
    const ads = await Icons.create(params);
    return createSuccessResponse(res, 'Success create icons', ads, 201);
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

    const icons = await Icons.findOne({ where: { id } });
    if (!icons) {
      throw new NotFoundError();
    }
    return createSuccessResponse(res, 'Success get icons', icons);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  let imageUrl = null;
  try {
    const { id } = req.params;
    const icon = await Icons.findByPk(id);
    if (!icon) {
      throw new NotFoundError();
    }
    imageUrl = req.file ? req.file?.filename : null;
    const params = {
      name: req.body.name,
    };
    if (imageUrl) {
      params.image_url = imageUrl;
    }
    await Icons.update(params, { where: { id } });

    return createSuccessResponse(res, 'Success update icons');
  } catch (error) {
    if (imageUrl) {
      deleteFile(path.join(__dirname, '..', 'uploads', imageUrl));
    }
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const icon = await Icons.findByPk(id);
  if (!icon) {
    return next(new NotFoundError());
  }
  deleteFile(path.join(__dirname, '..', 'uploads', icon.image_url));
  await icon.destroy();
  return createSuccessResponse(res, 'Success delete icons');
};
