const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { addNewCustomer } = require('../lib/stripe');
const { Users } = require('../models');
const { createSuccessResponse } = require('../utils/response');

exports.login = async (req, res, next) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (!user) {
      return next(new NotFoundError('Email address not found'));
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return next(new InvariantError('Credential is invalid'));
    }
    const val = { ...user.dataValues };
    const token = jwt.sign({ user_id: user.id }, process.env.JWT_ACCESS_KEY, {
      expiresIn: +process.env.TOKEN_MAX_AGE_SEC,
    });
    delete val.password;
    val.token = token;
    return createSuccessResponse(res, 'Authentication success', val);
  } catch (error) {
    return next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const existUser = await Users.findOne({ where: { email: req.body.email } });

    if (existUser) {
      return next(new InvariantError('Email already exists!'));
    }
    const password = await bcrypt.hash(req.body.password, 10);
    const params = {
      email: req.body.email,
      name: req.body.name,
      role: 'user',
      password,
    };
    const stripeCustomer = await addNewCustomer(params.email);
    params.stripe_customer_id = stripeCustomer.id;
    const user = await Users.create(params);

    const val = { ...user.dataValues };

    const token = jwt.sign({ user_id: val.id }, process.env.JWT_ACCESS_KEY, {
      expiresIn: +process.env.TOKEN_MAX_AGE_SEC,
    });
    delete val.password;
    return createSuccessResponse(
      res,
      'Register success',
      { ...val, token },
      201,
    );
  } catch (error) {
    return next(error);
  }
};
