const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const addNewCustomer = async (email) => {
  const customer = await stripe.customers.create({
    email,
    description: 'New Customer',
  });
  return customer;
};

const getCustomerById = async (id) => {
  const customer = await stripe.customers.retrieve(id);
  return customer;
};

const deleteCustomer = async (id) => {
  await stripe.customers.del(id);
};

const createProduct = async (name, description) => {
  const product = await stripe.products.create({ name, description });
  return product;
};

const updateProduct = async (id, { name, description }) => {
  const product = await stripe.products.update(id, { name, description });
  return product;
};

const deleteProduct = async (id) => {
  await stripe.products.update(id, { active: false });
};

const createPrices = async (
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

const deletePrices = async (id) => {
  await stripe.prices.update(id, { active: false });
};

const updatePrices = async (
  id,
  productId,
  amount,
  interval = 'month',
  currency = 'usd',
) => {
  await deletePrices(id);
  return createPrices(productId, amount, interval, currency);
};

const addSubscriptions = async (customerId, pricingId) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: pricingId }],
  });
  return subscription;
};

const createSubscriptionCheckoutSessions = async (
  cancelUrl,
  mode,
  successUrl,
  stripePriceId,
  customerId,
) => {
  const session = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_method_types: ['card'],
    mode,
    customer: customerId,
    line_items: [{ price: stripePriceId, quantity: 1 }],
  });
  return session;
};

module.exports = {
  stripe,
  addNewCustomer,
  getCustomerById,
  deleteCustomer,
  createProduct,
  updateProduct,
  deleteProduct,
  createPrices,
  updatePrices,
  deletePrices,
  addSubscriptions,
  createSubscriptionCheckoutSessions,
};
