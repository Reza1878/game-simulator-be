const router = require('express').Router();
const userSubscriptionController = require('../controllers/user-subscription.controller');
const auth = require('../middleware/auth');
const Validator = require('../middleware/validator');
const {
  userSubscriptionPostSchema,
} = require('../validators/user-subscription.validator');

router.post(
  '/',
  Validator(userSubscriptionPostSchema),
  auth(),
  userSubscriptionController.create,
);
module.exports = router;
