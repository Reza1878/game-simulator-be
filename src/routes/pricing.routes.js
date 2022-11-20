const router = require('express').Router();
const pricingController = require('../controllers/pricing.controller');
const Validator = require('../middleware/validator');
const {
  pricingPostSchema,
  pricingPutSchema,
} = require('../validators/pricing.validator');
const auth = require('../middleware/auth');

router.get('/', pricingController.findAll);
router.post(
  '/',
  auth(),
  Validator(pricingPostSchema),
  pricingController.create,
);
router.get('/:id', pricingController.findById);
router.put(
  '/:id',
  auth(),
  Validator(pricingPutSchema),
  pricingController.update,
);
router.delete('/:id', auth(), pricingController.delete);

module.exports = router;
