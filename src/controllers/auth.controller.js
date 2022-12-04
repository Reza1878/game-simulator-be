/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { addNewCustomer } = require('../lib/stripe');
const { Users, ResetPasswordRequest, UserTiers } = require('../models');
const { createSuccessResponse } = require('../utils/response');
const MailSender = require('../utils/mail-sender');

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
    const userTier = await UserTiers.findOne({ where: { name: 'User' } });
    if (userTier) {
      params.user_tier_id = userTier.dataValues.id;
    }

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

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (!user) {
      throw new NotFoundError('Email not found!');
    }
    const token = crypto.randomBytes(64).toString('hex').substring(0, 10);
    await ResetPasswordRequest.create({ token, email: user.email });
    try {
      const mailSender = new MailSender();
      mailSender.sendEmail(
        user.email,
        'Reset Password',
        null,
        `<p>Hi ${user?.name} you can reset your password by click this <a href="${process.env.CLIENT_URL}reset-password?token=${token}">link</a></p>`,
      );
    } catch (error) {
      await ResetPasswordRequest.destroy({ where: { token } });
      throw Error('Failed to send reset password link');
    }
    return createSuccessResponse(
      res,
      'Request has been created, please check your email',
    );
  } catch (error) {
    return next(error);
  }
};

exports.validateResetPasswordToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    const current = await ResetPasswordRequest.findOne({ where: { token } });
    if (!current) {
      throw new NotFoundError('Token is invalid');
    }

    const limit = current.dataValues.createdAt.setMinutes(
      current.dataValues.createdAt.getMinutes() + 10,
    );

    if (limit < new Date().getTime()) {
      throw new InvariantError('Token expired');
    }
    return createSuccessResponse(res, 'Token valid');
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, new_password, new_password_confirmation } = req.body;

    const current = await ResetPasswordRequest.findOne({ where: { token } });
    if (!current) {
      throw new NotFoundError('Token is invalid');
    }

    const limit = current.dataValues.createdAt.setMinutes(
      current.dataValues.createdAt.getMinutes() + 10,
    );

    if (limit < new Date().getTime()) {
      throw new InvariantError('Token expired');
    }

    if (new_password !== new_password_confirmation) {
      throw new InvariantError('Password not match');
    }

    const password = await bcrypt.hash(req.body.new_password, 10);

    await Users.update(
      { password },
      { where: { email: current.dataValues.email } },
    );
    await ResetPasswordRequest.destroy({ where: { token } });
    return createSuccessResponse(res, 'Success reset password');
  } catch (error) {
    return next(error);
  }
};
