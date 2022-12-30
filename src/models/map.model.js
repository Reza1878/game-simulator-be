module.exports = (sequelize, Sequelize) => {
  const Maps = sequelize.define(
    'maps',
    {
      image_url: {
        type: Sequelize.STRING,
      },
    },
    { underscored: true },
  );
  return Maps;
};
