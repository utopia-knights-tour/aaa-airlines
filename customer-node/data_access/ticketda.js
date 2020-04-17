const knex = require('../knex');

const findTicketsByCustomer = async (customerId) => {
  const customers = await knex('Ticket').where('customerId', customerId);
  return customers;
};

const createTicket = async (ticket) => {
  const newTicket = ticket;
  try {
    const id = await knex.insert(ticket).into('Ticket');
    [newTicket.ticketId] = id;
    return newTicket;
  } catch (err) {
    if (err.message.includes('ECONNREFUSED')) {
      err.status = 503;
      err.message = 'Service Unavailable - Please try again later';
    }
    if (err.message.includes('constraint')) {
      err.status = 400;
      err.message = 'Invalid flight or customer id';
    }
    throw err;
  }
};

const findTicketById = async (ticketId) => {
  const ticket = await knex('Ticket').where('ticketId', ticketId);
  return ticket;
};

const deleteTicket = (ticketId) => knex('Ticket').where('ticketId', ticketId).update('canceled', 1);

module.exports = {
  findTicketsByCustomer, createTicket, deleteTicket, findTicketById,
};
