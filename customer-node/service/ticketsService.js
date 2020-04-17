const {
  findTicketsByCustomer, createTicket, findTicketById, deleteTicket,
} = require('../data_access/ticketda');

const getTicketsByCustomerId = (customerId) => findTicketsByCustomer(customerId);

const addTicket = (ticket) => createTicket(ticket);

const cancelTicket = async (customerId, ticketId) => {
  const ticket = await findTicketById(ticketId);
  if (ticket[0].customerId !== customerId) {
    const err = new Error('Ticket does not belong to customer');
    err.status = 401;
    throw err;
  }
  await deleteTicket(ticketId);
};

module.exports = { getTicketsByCustomerId, addTicket, cancelTicket };
