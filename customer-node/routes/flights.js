const express = require('express');
const { getFlights, getFlightById } = require('../service/flightsService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const requiredFields = ['originCode', 'destinationCode', 'departureDate'];
  const missingField = requiredFields.find((field) => !(field in req.query));

  if (missingField) {
    return res.status(400).json({ message: `${missingField} is required` });
  }

  const { originCode: source, destinationCode: destination, departureDate: date } = req.query;

  const datere = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
  if (!date.match(datere)) {
    return res.status(400).json({ message: 'Invalid Date' });
  }
  if (source.length !== 3 || destination.length !== 3) {
    return res.status(400).json({ message: 'Invalid Airport' });
  }
  try {
    const flights = await getFlights(source, destination, date);
    return res.status(200).json(flights);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const flight = await getFlightById(req.params.id);
    return res.status(200).json(flight);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
