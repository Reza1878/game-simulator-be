const router = require('express').Router();
const heroesController = require('../controllers/herores-role.controller');
const {
  heroesRolePostSchema,
  heroesRolePutSchema,
} = require('../validators/heroes-role.validator');
const auth = require('../middleware/auth');
const Validator = require('../middleware/validator');

router.get('/', heroesController.findAll);
router.post(
  '/',
  auth(),
  Validator(heroesRolePostSchema),
  heroesController.create,
);
router.get('/:id', heroesController.findById);
router.put(
  '/:id',
  auth(),
  Validator(heroesRolePutSchema),
  heroesController.update,
);
router.delete('/:id', auth(), heroesController.delete);

module.exports = router;
