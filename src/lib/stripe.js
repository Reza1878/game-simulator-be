const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.addNewCustomer = async (email) => {
  const customer = await stripe.customers.create({
    email,
    description: 'New Customer',
  });
  return customer;
};

exports.getCustomerById = async (id) => {
  const customer = await stripe.customers.retrieve(id);
  return customer;
};

exports.deleteCustomer = async (id) => {
  await stripe.customers.del(id);
};

exports.createProduct = async (name, description) => {
  const product = await stripe.products.create({ name, description });
  return product;
};

exports.updateProduct = async (id, { name, description }) => {
  const product = await stripe.products.update(id, { name, description });
  return product;
};

exports.deleteProduct = async (id) => {
  await stripe.products.update(id, { active: false });
};

exports.createPrices = async (
  productId,
  amount,
  interval = 'month',
  currency = 'usd',
) => {
  const price = await stripe.prices.create({
    unit_amount: amount * 100,
    currency,
    recurring: { interval },
    product: productId,
  });
  return price;
};

exports.updatePrices = async (
  id,
  productId,
  amount,
  interval = 'month',
  currency = 'usd',
) => {
  await this.deletePrices(id);
  return this.createPrices(productId, amount, interval, currency);
};

exports.deletePrices = async (id) => {
  await stripe.prices.update(id, { active: false });
};

exports.addSubscriptions = async (customerId, pricingId) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: pricingId }],
  });
  return subscription;
};

exports.createSubscriptionCheckoutSessions = async (
  cancelUrl,
  mode,
  successUrl,
  stripePriceId,
) => {
  const session = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_method_types: ['card'],
    mode,
    line_items: [{ price: stripePriceId, quantity: 1 }],
  });
  return session;
};
