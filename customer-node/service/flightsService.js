const { findFlights } = require('../data_access/flightda');

const getFlights = (source, destination, date) => findFlights(source, destination, date);

module.exports = { getFlights };
