const router = require('express').Router();
const simulatorOptionBanController = require('../controllers/simulator-option-ban.controller');
const Validator = require('../middleware/validator');
const {
  simulatorOptionBanPostSchema,
  simulatorOptionBanPutSchema,
} = require('../validators/simulator-option-ban.validator');

router.get('/', simulatorOptionBanController.findAll);
router.post(
  '/',
  Validator(simulatorOptionBanPostSchema),
  simulatorOptionBanController.create,
);
router.put(
  '/:id',
  Validator(simulatorOptionBanPutSchema),
  simulatorOptionBanController.update,
);
router.get('/:id', simulatorOptionBanController.findById);
router.delete('/:id', simulatorOptionBanController.delete);

module.exports = router;
