module.exports = (sequelize, Sequelize) => {
  const Settings = sequelize.define(
    'settings',
    {
      email: {
        type: Sequelize.STRING,
      },
    },
    { underscored: true },
  );

  return Settings;
};
