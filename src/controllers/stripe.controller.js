const { UserSubscriptions, Users, Pricings } = require('../models');

exports.webhook = async (req, res) => {
  // const sig = req.headers['stripe-signature'];
  // let event;
  // try {
  //   event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  // } catch (error) {
  //   return res.status(400).send(`Webhook Error:${error.message}`);
  // }
  const event = { type: req.body.type, data: req.body.data };
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userSession = await UserSubscriptions.findOne({
        where: { stripe_checkout_session_id: session.id },
      });
      const pricing = await Pricings.findByPk(userSession.pricing_id);
      await Users.update(
        {
          pricing_id: userSession.pricing_id,
          user_tier_id: pricing?.user_tier_id || null,
        },
        { where: { id: userSession.user_id } },
      );
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object;
      const users = await Users.findOne({
        where: { email: invoice.customer_email },
      });
      const pricingId = invoice.lines.data[0].price.id;
      const pricing = await Pricings.findOne({
        where: { stripe_price_id: pricingId },
      });
      await Users.update(
        { pricing_id: pricing.id, user_tier_id: pricing?.user_tier_id || null },
        { where: { id: users.id } },
      );
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const users = await Users.findOne({
        where: { email: invoice.customer_email },
      });
      await Users.update({ pricing_id: null }, { where: { id: users.id } });
      break;
    }
    default:
      // eslint-disable-next-line no-console
      console.log('No event handler', event);
      break;
  }
  return res.send();
};
