const router = require('express').Router();
const { webhook } = require('../controllers/stripe.controller');

router.post('/', webhook);

module.exports = router;
