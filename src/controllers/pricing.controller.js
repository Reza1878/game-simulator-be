const NotFoundError = require('../exceptions/NotFoundError');
const {
  createPrices,
  deletePrices,
  updatePrices,
  createProduct,
  deleteProduct,
  updateProduct,
} = require('../lib/stripe');
const { Pricings, Sequelize } = require('../models');
const { createSuccessResponse } = require('../utils/response');

exports.findAll = async (req, res, next) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { limit, offset, name, description } = req.query;

    const params = {};
    if (limit) params.limit = +limit;
    if (offset) params.offset = +offset - 1;
    if (name) {
      params.where = {
        ...params.where,
        name: { [Sequelize.Op.like]: `%${name}%` },
      };
    }
    if (description) {
      params.where = {
        ...params.where,
        description: { [Sequelize.Op.like]: `%${description}%` },
      };
    }

    const data = await Pricings.findAll(params);
    const response = {
      status: 'success',
      message: 'Success get pricing',
      data,
    };

    delete params.limit;
    delete params.offset;
    if (limit) {
      const totalItems = await Pricings.findAll({
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
      price: req.body.price,
      description: req.body.description,
      features: req.body.features,
    };
    const product = await createProduct(req.body.name, req.body.description);
    const stripePrice = await createPrices(product.id, req.body.price);
    params.stripe_price_id = stripePrice.id;
    params.stripe_product_id = product.id;
    const data = await Pricings.create(params);
    return createSuccessResponse(res, 'Success create pricing', data, 201);
  } catch (error) {
    return next(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Pricings.findByPk(id);
    if (!item) {
      return next(new NotFoundError());
    }
    return createSuccessResponse(res, 'Success get pricing', item);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  const params = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    features: req.body.features,
  };

  const item = await Pricings.findByPk(id);
  if (!item) {
    return next(new NotFoundError());
  }
  await updateProduct(item.stripe_product_id, {
    name: req.body.name,
    description: req.body.description,
  });
  const updatedPrice = await updatePrices(
    item.stripe_price_id,
    item.stripe_product_id,
    req.body.price,
  );
  params.stripe_price_id = updatedPrice.id;
  await Pricings.update(params, { where: { id } });
  return createSuccessResponse(res, 'Success update pricing');
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const item = await Pricings.findByPk(id);
  if (!item) {
    return next(new NotFoundError());
  }
  await deletePrices(item.stripe_price_id);
  await deleteProduct(item.stripe_product_id);
  await Pricings.destroy({ where: { id } });
  return createSuccessResponse(res, 'Success delete pricing');
};
