const NotFoundError = require('../exceptions/NotFoundError');
const {
  addNewCustomer,
  createSubscriptionCheckoutSessions,
} = require('../lib/stripe');
const { Users, Pricings, UserSubscriptions } = require('../models');
const { createSuccessResponse } = require('../utils/response');

exports.create = async (req, res, next) => {
  try {
    const users = await Users.findByPk(req.user.user_id);
    if (!users) {
      return next(new NotFoundError('Users not found'));
    }
    let stripeCustomerId = users.stripe_customer_id;
    if (!users.stripe_customer_id) {
      const stripeCustomer = await addNewCustomer(users.email);
      stripeCustomerId = stripeCustomer.id;
      Users.update(
        { stripe_customer_id: stripeCustomer.id },
        { where: { id: users.id } },
      );
    }

    const pricings = await Pricings.findByPk(req.body.pricing_id);
    if (!pricings) {
      return next(new NotFoundError('Subscriptions plan not found'));
    }
    const session = await createSubscriptionCheckoutSessions(
      'http://localhost:5000/cancel-payment',
      'subscription',
      'http://localhost:5000/payment-success',
      pricings.stripe_price_id,
      stripeCustomerId,
    );

    const params = {
      stripe_checkout_session_id: session.id,
      stripe_subscription_id: pricings.stripe_price_id,
      status: 'CREATED',
      user_id: users.id,
      pricing_id: pricings.id,
      stripe_payment_url: session.url,
    };
    await UserSubscriptions.create(params);

    return createSuccessResponse(
      res,
      'Success create checkout session',
      session,
      201,
    );
  } catch (error) {
    return next(error);
  }
};
