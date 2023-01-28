const router = require('express').Router();
const controller = require('../controllers/contact-us.controller');
const Validator = require('../middleware/validator');
const { contactUsPostSchema } = require('../validators/contact-us.validator');

router.post('/', Validator(contactUsPostSchema), controller.sendMail);

module.exports = router;
