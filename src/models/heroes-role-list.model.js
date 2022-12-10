module.exports = (sequelize) => {
  const HeroesRoleLists = sequelize.define(
    'heroes_role_lists',
    {},
    { timestamps: false, underscored: true },
  );
  return HeroesRoleLists;
};
