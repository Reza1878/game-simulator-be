const router = require('express').Router();
const express = require('express');
const { webhook } = require('../controllers/stripe.controller');

router.post('/', express.raw({ type: 'application/json' }), webhook);

module.exports = router;
