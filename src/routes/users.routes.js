const router = require('express').Router();
const Validator = require('../middleware/validator');
const { usersPostSchema } = require('../validators/users-validator');
const userController = require('../controllers/users.controller');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/is-admin');

router.post('/', Validator(usersPostSchema), userController.create);
router.get('/', auth(), isAdmin(), userController.findAll);

module.exports = router;
