const router = require('express').Router();
const simulatorOptionBanController = require('../controllers/simulator-option-ban.controller');
const Validator = require('../middleware/validator');
const {
  simulatorOptionBanPostSchema,
  simulatorOptionBanPutSchema,
} = require('../validators/simulator-option-ban.validator');
const auth = require('../middleware/auth');

router.get('/', auth(), simulatorOptionBanController.findAll);
router.post(
  '/',
  auth(),
  Validator(simulatorOptionBanPostSchema),
  simulatorOptionBanController.create,
);
router.put(
  '/:id',
  auth(),
  Validator(simulatorOptionBanPutSchema),
  simulatorOptionBanController.update,
);
router.get('/:id', auth(), simulatorOptionBanController.findById);
router.delete('/:id', auth(), simulatorOptionBanController.delete);

module.exports = router;
