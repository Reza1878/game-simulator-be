module.exports = (sequelize, Sequelize) => {
  const SimulatorOptionBan = sequelize.define(
    'simulator_option_bans',
    {
      ban_count: {
        type: Sequelize.INTEGER,
      },
    },
    { underscored: true },
  );
  return SimulatorOptionBan;
};
