const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const Validator = require('../middleware/validator');
const {
  authPostSchema,
  registerPostSchema,
  forgotPasswordPostSchema,
  validateForgotPasswordPostSchema,
  resetPasswordPostSchema,
  refreshAccessTokenPostSchema,
} = require('../validators/auth.validator');

router.post('/login', Validator(authPostSchema), authController.login);
router.post(
  '/register',
  Validator(registerPostSchema),
  authController.register,
);
router.post(
  '/forgot-password',
  Validator(forgotPasswordPostSchema),
  authController.forgotPassword,
);
router.post(
  '/validate-forgot-password-token',
  Validator(validateForgotPasswordPostSchema),
  authController.validateResetPasswordToken,
);
router.post(
  '/reset-password',
  Validator(resetPasswordPostSchema),
  authController.resetPassword,
);
router.post(
  '/refresh-token',
  Validator(refreshAccessTokenPostSchema),
  authController.refreshToken,
);
router.post(
  '/logout',
  Validator(refreshAccessTokenPostSchema),
  authController.logout,
);
module.exports = router;
