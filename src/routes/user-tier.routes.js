const router = require('express').Router();
const controller = require('../controllers/user-tier.controller');
const Validator = require('../middleware/validator');
const {
  userTierPostSchema,
  userTierPutSchema,
} = require('../validators/user-tier.validator');
const auth = require('../middleware/auth');

router.get('/', controller.findAll);
router.post('/', auth(), Validator(userTierPostSchema), controller.create);
router.get('/:id', controller.findById);
router.put('/:id', auth(), Validator(userTierPutSchema), controller.update);
router.delete('/:id', auth(), controller.delete);

module.exports = router;
