const { stripe } = require('../lib/stripe');

const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    return res.status(400).send(`Webhook Error:${error.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      //   const session = event.data.object;
      break;
    case 'checkout.session.expired':
      //   const session = event.data.object;
      break;
    case 'customer.subscription.deleted':
      // const subcription = event.data.object;
      break;
    case 'customer.subscription.updated':
      break;
    default:
      break;
  }
  return res.send();
};
