module.exports = (sequelize, Sequelize) => {
  const ResetPasswordRequest = sequelize.define(
    'reset_password_request',
    {
      token: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.STRING,
      },
    },
    { underscored: true },
  );
  return ResetPasswordRequest;
};
