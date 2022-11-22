const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    operatorAlias: false,
    pool: {
      max: process.env.MAX_POOL,
      min: process.env.MIN_POOL,
      acquire: process.env.DB_AQUIRE,
      idle: process.env.DB_IDLE,
    },
  },
);

const Pricings = require('./pricing.model')(sequelize, Sequelize);
const SimulatorOptionBans = require('./simulator-option-ban.models')(
  sequelize,
  Sequelize,
);
const Users = require('./user.model')(sequelize, Sequelize);
const UserSubscriptions = require('./user-subscription.model')(
  sequelize,
  Sequelize,
);

Pricings.hasOne(Users, {
  foreignKey: 'pricing_id',
});
Users.belongsTo(Pricings);
Users.hasOne(UserSubscriptions, {
  foreignKey: 'user_id',
});
UserSubscriptions.belongsTo(Users, {
  foreignKey: 'user_id',
});
Pricings.hasOne(UserSubscriptions, {
  foreignKey: 'pricing_id',
});
UserSubscriptions.belongsTo(Pricings, {
  foreignKey: 'pricing_id',
});
module.exports = {
  sequelize,
  Sequelize,
  Pricings,
  SimulatorOptionBans,
  Users,
  UserSubscriptions,
};
