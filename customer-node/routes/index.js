const express = require('express');
const airports = require('./airports');
const customer = require('./customer');
const flights = require('./flights');
const tickets = require('./tickets');

const router = express.Router();

router.use('/airports', airports);
router.use('/customers', customer);
router.use('/flights', flights);
router.use('/tickets', tickets);
router.use('/health', (req, res) => res.sendStatus(200));

module.exports = router;
