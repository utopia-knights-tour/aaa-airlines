const { findAllAirports } = require('../data_access/airportda');

const getAllAirports = () => findAllAirports();

module.exports = { getAllAirports };
