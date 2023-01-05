module.exports = (sequelize, Sequelize) => {
  const Icons = sequelize.define(
    'icons',
    {
      name: {
        type: Sequelize.STRING,
      },
      image_url: {
        type: Sequelize.STRING,
      },
    },
    { underscored: true },
  );
  return Icons;
};
