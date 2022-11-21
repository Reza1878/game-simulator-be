module.exports = (sequelize, Sequelize) => {
  const Pricing = sequelize.define(
    'pricings',
    {
      name: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      description: {
        type: Sequelize.STRING,
      },
      stripe_price_id: {
        type: Sequelize.STRING,
      },
      stripe_product_id: {
        type: Sequelize.STRING,
      },
      features: {
        type: Sequelize.TEXT,
      },
    },
    { underscored: true },
  );
  return Pricing;
};
