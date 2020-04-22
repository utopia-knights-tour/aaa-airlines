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

const createTicket = async (ticket) => {
  try {
    const newTicket = ticket;
    await knex.transaction(async (trx) => {
      const flight = await knex('Flight').where('flightId', ticket.flightId).first()
        .transacting(trx);
      const id = await knex.insert(ticket).into('Ticket')
        .transacting(trx);
      [newTicket.ticketId] = id;

      if (flight.seatsAvailable < 1) {
        const err = new Error('No seats left. Sold out');
        err.status = 422;
        throw err;
      }
      await knex('Flight').where('flightId', flight.flightId).decrement('seatsAvailable', 1)
        .transacting(trx);
    });
    return newTicket;
  } catch (err) {
    if (err.message.includes('ECONNREFUSED')) {
      err.status = 503;
      err.message = 'Service Unavailable - Please try again later';
      throw err;
    }
    if (err.message.includes('constraint')) {
      err.status = 400;
      err.message = 'Invalid flight or customer id';
      throw err;
    }
    throw err;
  }
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

const deleteTicket = async (ticketId, flightId) => {
  try {
    await knex.transaction(async (trx) => {
      await knex('Ticket').where('ticketId', ticketId).update('canceled', 1).transacting(trx);
      await knex('Flight').where('flightId', flightId).increment('seatsAvailable', 1).transacting(trx);
    });
  } catch (err) {
    if (err.message.includes('ECONNREFUSED')) {
      err.status = 503;
      err.message = 'Service Unavailable - Please try again later';
      throw err;
    }
    throw err;
  }
};

module.exports = {
  findTicketsByCustomer, createTicket, deleteTicket, findTicketById,
};
