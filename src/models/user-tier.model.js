module.exports = (sequelize, Sequelize) => {
  const UserTiers = sequelize.define(
    'user_tiers',
    {
      name: {
        type: Sequelize.STRING,
      },
    },
    { underscored: true },
  );
  return UserTiers;
};
