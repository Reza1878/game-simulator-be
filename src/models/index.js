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
const Teams = require('./team.model')(sequelize, Sequelize);
const Heroes = require('./heroes.model')(sequelize, Sequelize);
const HeroesRoles = require('./heroes-role.model')(sequelize, Sequelize);
const HeroesRoleLists = require('./heroes-role-list.model')(sequelize);
const UserTiers = require('./user-tier.model')(sequelize, Sequelize);
const ResetPasswordRequest = require('./reset-password-request.model')(
  sequelize,
  Sequelize,
);
const Maps = require('./map.model')(sequelize, Sequelize);
const Ads = require('./ads.model')(sequelize, Sequelize);
const Icons = require('./icons.model')(sequelize, Sequelize);
const Settings = require('./settings.model')(sequelize, Sequelize);
const Authentications = require('./authentications.model')(
  sequelize,
  Sequelize,
);

UserTiers.hasOne(Users, {
  foreignKey: 'user_tier_id',
});
Users.belongsTo(UserTiers);
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
UserTiers.hasOne(Pricings, {
  foreignKey: 'user_tier_id',
});
Pricings.belongsTo(UserTiers, {
  foreignKey: 'user_tier_id',
});
Heroes.belongsToMany(HeroesRoles, { through: HeroesRoleLists });
HeroesRoles.belongsToMany(Heroes, { through: HeroesRoleLists });

module.exports = {
  sequelize,
  Sequelize,
  Pricings,
  SimulatorOptionBans,
  Users,
  UserSubscriptions,
  Teams,
  HeroesRoles,
  Heroes,
  UserTiers,
  ResetPasswordRequest,
  HeroesRoleLists,
  Maps,
  Ads,
  Icons,
  Settings,
  Authentications,
};
