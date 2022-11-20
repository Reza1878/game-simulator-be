const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const Validator = require('../middleware/validator');
const {
  authPostSchema,
  registerPostSchema,
} = require('../validators/auth.validator');

router.post('/login', Validator(authPostSchema), authController.login);
router.post(
  '/register',
  Validator(registerPostSchema),
  authController.register,
);
module.exports = router;
