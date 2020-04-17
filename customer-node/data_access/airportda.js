const knex = require('../knex');

const findAllAirports = () => knex('Airport');

module.exports = { findAllAirports };
