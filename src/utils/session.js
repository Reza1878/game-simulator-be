const { UserTiers, Authentications } = require('../models');

const checkUserSession = async (user) => {
  if (user.role === 'user') {
    const tier = await UserTiers.findByPk(user.user_tier_id);
    if (tier.max_session) {
      const { count } = await Authentications.findAndCountAll({
        where: { user_id: user.id },
      });
      if (+count > +tier.max_session) {
        const curr = await Authentications.findOne({
          where: { user_id: user.id },
        });
        curr.destroy();
      }
    }
  }
};

module.exports = { checkUserSession };
