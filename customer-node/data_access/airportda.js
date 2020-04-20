const knex = require('../knex');

const findAllAirports = () => knex('Airport');

const airportExists = async (airportCode) => {
  const airport = await knex('Airport').where('airportCode', airportCode);
  return airport.length;
};

module.exports = { findAllAirports, airportExists };
