module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define(
    'users',
    {
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
      },
      stripe_customer_id: {
        type: Sequelize.STRING,
      },
    },
    { underscored: true },
  );
  return Users;
};
