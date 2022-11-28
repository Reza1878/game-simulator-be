module.exports = (sequelize, Sequelize) => {
  const Heroes = sequelize.define(
    'heroes',
    {
      name: {
        type: Sequelize.STRING,
      },
      icon_url: {
        type: Sequelize.TEXT,
      },
      banner_url: {
        type: Sequelize.TEXT,
      },
    },
    { underscored: true },
  );
  return Heroes;
};
