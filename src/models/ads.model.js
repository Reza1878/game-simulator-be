module.exports = (sequelize, Sequelize) => {
  const Ads = sequelize.define(
    'ads',
    {
      image_url: {
        type: Sequelize.STRING,
      },
      ratio: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
    },
    { underscored: true },
  );
  return Ads;
};
