module.exports = (sequelize, Sequelize) => {
  const UserSubscription = sequelize.define('user_subscriptions', {
    stripe_checkout_session_id: {
      type: Sequelize.STRING,
    },
    stripe_subscription_id: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    stripe_payment_url: {
      type: Sequelize.TEXT,
    },
  });
  return UserSubscription;
};
