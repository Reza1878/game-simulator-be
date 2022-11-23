module.exports = (sequelize, Sequelize) => {
  const HeroesRoles = sequelize.define(
    'heroes_role',
    {
      name: {
        type: Sequelize.STRING,
      },
    },
    { underscored: true },
  );

  return HeroesRoles;
};
