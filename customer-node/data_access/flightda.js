const knex = require('../knex');

const findFlights = async (source, destination, date) => {
  const flights = await knex('Flight').where({
    sourceAirport: source,
    destinationAirport: destination,
    departureDate: date,
  });
  return flights;
};

const findFlightById = async (flightId) => {
  const flight = await knex('Flight').where('flightId', flightId).first();
  return flight;
};

module.exports = { findFlights, findFlightById };
