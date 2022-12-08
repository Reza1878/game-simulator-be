const router = require('express').Router();
const teamController = require('../controllers/team.controller');
const Validator = require('../middleware/validator');
const {
  teamPostSchema,
  teamPutSchema,
} = require('../validators/team.validator');
const auth = require('../middleware/auth');

router.get('/', auth(), teamController.findAll);
router.post('/', auth(), Validator(teamPostSchema), teamController.create);
router.get('/:id', teamController.findById);
router.put('/:id', auth(), Validator(teamPutSchema), teamController.update);
router.delete('/:id', auth(), teamController.delete);

module.exports = router;
