const { findFlights, findFlightById } = require('../data_access/flightda');
const { airportExists } = require('../data_access/airportda');

const getFlights = async (source, destination, date) => {
  const sourceExists = await airportExists(source);
  const destinationExists = await airportExists(destination);

  if (!sourceExists) {
    const err = new Error('source airport not in database');
    err.status = 400;
    throw err;
  }
  if (!destinationExists) {
    const err = new Error('destination airport not in database');
    err.status = 400;
    throw err;
  }
  return findFlights(source, destination, date);
};

const getFlightById = (flightId) => findFlightById(flightId);

module.exports = { getFlights, getFlightById };
