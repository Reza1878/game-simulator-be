const router = require('express').Router();
const Validator = require('../middleware/validator');
const { usersPostSchema } = require('../validators/users-validator');
const userController = require('../controllers/users.controller');

router.post('/', Validator(usersPostSchema), userController.create);

module.exports = router;
