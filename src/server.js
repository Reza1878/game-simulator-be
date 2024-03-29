require('dotenv').config();
const express = require('express');
const cors = require('cors');
// eslint-disable-next-line no-unused-vars
const db = require('./models');
const ClientError = require('./exceptions/ClientError');

const pricingRoute = require('./routes/pricing.routes');
const simulatorBanOptionRoute = require('./routes/simulator-option-ban.routes');
const userRoute = require('./routes/users.routes');
const authRoute = require('./routes/auth.routes');
const stripeRoute = require('./routes/stripe.routes');
const userSubsription = require('./routes/user-subscription.routes');
const teamRoute = require('./routes/team.routes');
const heroesRoleRoute = require('./routes/heroes-role.routes');
const heroesRoute = require('./routes/heroes.routes');
const userTierRoute = require('./routes/user-tier.routes');
const mapRoute = require('./routes/map.routes');
const adsRoute = require('./routes/ads.route');
const iconRoute = require('./routes/icons.route');
const settingRoute = require('./routes/setting.route');
const contactUsRoute = require('./routes/contact-us.routes');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.use('/api/pricings', pricingRoute);
app.use('/api/simulator-ban-options', simulatorBanOptionRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/subscriptions', userSubsription);
app.use('/api/stripe-webhooks', stripeRoute);
app.use('/api/teams', teamRoute);
app.use('/api/heroes-roles', heroesRoleRoute);
app.use('/api/heroes', heroesRoute);
app.use('/api/user-tiers', userTierRoute);
app.use('/api/maps', mapRoute);
app.use('/api/ads', adsRoute);
app.use('/api/icons', iconRoute);
app.use('/api/settings', settingRoute);
app.use('/api/contact-us', contactUsRoute);

app.use('/files', express.static('./src/uploads'));

app.use((err, req, res, next) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    if (err instanceof ClientError) {
      return res
        .status(err.statusCode)
        .json({ message: err.message, data: null });
    }
    return res
      .status(500)
      .json({ message: 'Internal server error', data: null });
  }
  return next();
});

app.listen(port);
