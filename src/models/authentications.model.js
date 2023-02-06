module.exports = (sequelize, Sequelize) => {
  const Authentications = sequelize.define(
    'authentications',
    {
      token: {
        type: Sequelize.TEXT,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
    },
    { underscored: true },
  );
  return Authentications;
};
