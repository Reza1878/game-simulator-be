module.exports = (sequelize, Sequelize) => {
  const Team = sequelize.define(
    'teams',
    {
      name: {
        type: Sequelize.STRING,
      },
      side: {
        type: Sequelize.ENUM('LEFT', 'RIGHT'),
      },
    },
    { underscored: true },
  );

  return Team;
};
