const {
  findTicketsByCustomer, createTicket, findTicketById, deleteTicket,
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

const addTicket = (ticket) => createTicket(ticket);

const cancelTicket = async (customerId, ticketId) => {
  const ticket = await findTicketById(ticketId);
  if (!ticket) {
    const err = new Error('Ticket does not exist');
    err.status = 404;
    throw err;
  }
  if (ticket.customerId !== customerId) {
    const err = new Error('Ticket does not belong to customer');
    err.status = 401;
    throw err;
  }
  await deleteTicket(ticketId);
};

module.exports = { getTicketsByCustomerId, addTicket, cancelTicket };
