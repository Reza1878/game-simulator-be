require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const ClientError = require('./exceptions/ClientError');

const pricingRoute = require('./routes/pricing.routes');
const simulatorBanOptionRoute = require('./routes/simulator-option-ban.routes');
const userRoute = require('./routes/users.routes');
const authRoute = require('./routes/auth.routes');
const userSubsription = require('./routes/user-subscription.routes');

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

app.use((err, req, res, next) => {
  if (err) {
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
