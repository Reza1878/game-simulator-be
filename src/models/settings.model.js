module.exports = (sequelize, Sequelize) => {
  const Settings = sequelize.define(
    'settings',
    {
      email: {
        type: Sequelize.STRING,
      },
      donation_link: {
        type: Sequelize.STRING,
      },
    },
    { underscored: true },
  );

  return Settings;
};
