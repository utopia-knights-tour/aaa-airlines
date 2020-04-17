const knex = require('../knex');

const findFlights = async (source, destination, date) => {
  try {
    const flights = await knex('Flight').where({
      sourceAirport: source,
      destinationAirport: destination,
      departureDate: date,
    });
    return flights;
  } catch (err) {
    return [];
  }
};

module.exports = { findFlights };
