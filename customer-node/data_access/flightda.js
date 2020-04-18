const knex = require('../knex');

const findFlights = async (source, destination, date) => {
  const flights = await knex('Flight').where({
    sourceAirport: source,
    destinationAirport: destination,
    departureDate: date,
  });
  return flights;
};

module.exports = { findFlights };
