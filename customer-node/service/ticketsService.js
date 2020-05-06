const {
  findTicketsByCustomer, findTicketById,
} = require('../data_access/ticketda');
const { findCustomer } = require('../data_access/customerda');

const getTicketsByCustomerId = async (customerId) => {
  const customer = await findCustomer(customerId);
  if (!customer) {
    const err = new Error('Customer Does Not Exist');
    err.status = 404;
    throw err;
  }
  return findTicketsByCustomer(customerId);
};

const getTicketsById = (ticketId) => findTicketById(ticketId);

module.exports = {
  getTicketsByCustomerId, getTicketsById,
};
