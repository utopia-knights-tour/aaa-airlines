const knex = require('../knex');

const findTicketsByCustomer = async (customerId) => {
  const tickets = await knex('Ticket').where({
    'Ticket.customerId': customerId,
    canceled: 0,
  })
    .join('Customer', { 'Ticket.customerId': 'Customer.customerId' })
    .join('Flight', { 'Ticket.flightId': 'Flight.flightId' });
  return tickets.map((_ticket) => {
    const ticket = _ticket;
    delete ticket.flightId;
    delete ticket.customerId;
    delete ticket.canceled;
    delete ticket.agencyId;
    delete ticket.seatsAvailable;
    return ticket;
  });
};

const findTicketById = async (ticketId) => {
  const ticket = await knex('Ticket').where('ticketId', ticketId)
    .join('Customer', { 'Ticket.customerId': 'Customer.customerId' })
    .join('Flight', { 'Ticket.flightId': 'Flight.flightId' })
    .first();
  delete ticket.flightId;
  delete ticket.customerId;
  delete ticket.canceled;
  delete ticket.agencyId;
  delete ticket.seatsAvailable;
  return ticket;
};

module.exports = {
  findTicketsByCustomer, findTicketById,
};
