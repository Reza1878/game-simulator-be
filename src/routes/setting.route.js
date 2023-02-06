const router = require('express').Router();
const settingController = require('../controllers/setting.controller');
const Validator = require('../middleware/validator');
const { settingPutSchema } = require('../validators/setting.validator');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/is-admin');

router.get('/', settingController.findAll);
router.put(
  '/',
  auth(),
  isAdmin(),
  Validator(settingPutSchema),
  settingController.update,
);

module.exports = router;
