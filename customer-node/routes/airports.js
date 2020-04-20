const express = require('express');
const { getAllAirports } = require('../service/airportsService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const airports = await getAllAirports();
    res.status(200).json(airports);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
