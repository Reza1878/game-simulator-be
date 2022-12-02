const router = require('express').Router();
const pricingController = require('../controllers/pricing.controller');
const Validator = require('../middleware/validator');
const {
  pricingPostSchema,
  pricingPutSchema,
} = require('../validators/pricing.validator');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/is-admin');

router.get('/', pricingController.findAll);
router.post(
  '/',
  auth(),
  isAdmin(),
  Validator(pricingPostSchema),
  pricingController.create,
);
router.get('/:id', pricingController.findById);
router.put(
  '/:id',
  auth(),
  isAdmin(),
  Validator(pricingPutSchema),
  pricingController.update,
);
router.delete('/:id', auth(), isAdmin(), pricingController.delete);

module.exports = router;
