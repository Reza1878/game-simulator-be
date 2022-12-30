const path = require('path');
const InvariantError = require('../exceptions/InvariantError');
const { Maps } = require('../models');
const { deleteFile } = require('../utils/file');
const { createSuccessResponse } = require('../utils/response');

exports.create = async (req, res, next) => {
  let imageUrl = null;
  try {
    imageUrl = req.files?.image ? req?.files?.image[0]?.filename : null;
    if (!imageUrl) {
      throw new InvariantError('Image is required');
    }
    const maps = await Maps.findOne();
    if (maps) {
      deleteFile(path.join(__dirname, '..', 'uploads', maps.image_url));
      await maps.destroy();
    }
    const newMaps = await Maps.create({ image_url: imageUrl });

    return createSuccessResponse(
      res,
      'Success uplaod maps',
      { maps: newMaps },
      201,
    );
  } catch (error) {
    return next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const maps = await Maps.findOne();
    return createSuccessResponse(res, 'Success get maps', maps);
  } catch (error) {
    return next(error);
  }
};
