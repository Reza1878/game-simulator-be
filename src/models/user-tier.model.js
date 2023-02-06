module.exports = (sequelize, Sequelize) => {
  const UserTiers = sequelize.define(
    'user_tiers',
    {
      name: {
        type: Sequelize.STRING,
      },
      max_session: {
        type: Sequelize.INTEGER,
      },
    },
    { underscored: true },
  );
  return UserTiers;
};
