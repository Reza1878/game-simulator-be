const { Settings } = require('../models');
const { createSuccessResponse } = require('../utils/response');

exports.findAll = async (req, res, next) => {
  try {
    const data = await Settings.findOne();
    const response = {
      status: 'success',
      message: 'Success get settings',
      data,
    };
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const curr = await Settings.findOne();
    if (curr) await curr.destroy();

    const data = await Settings.create({
      email: req.body.email,
      donation_link: req.body.donation_link,
    });
    return createSuccessResponse(res, 'Success update setting', data);
  } catch (error) {
    return next(error);
  }
};
