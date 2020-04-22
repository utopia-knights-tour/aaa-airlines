const express = require('express');
const {
  addTicket, getTicketsByCustomerId, cancelTicket, getTicketsById,
} = require('../service/ticketsService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { customerId } = req.query;
  try {
    const tickets = await getTicketsByCustomerId(customerId);
    res.status(200).json(tickets);
  } catch (err) {
    next(err);
  }
});

router.get('/:ticketId', async (req, res, next) => {
  const { ticketId } = req.params;
  try {
    const ticket = await getTicketsById(ticketId);
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { flightId, customerId } = req.body;
  if (!flightId || !customerId) {
    return res.status(400).json({ message: 'flightId and customerId required' });
  }
  if (!(Number.isInteger(flightId)) || !(Number.isInteger(customerId))) {
    return res.status(400).json({ message: 'Ids must be integers' });
  }

  const ticket = { flightId, customerId };

  try {
    const newTicket = await addTicket(ticket);
    return res.status(201).json(newTicket);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:ticketId', async (req, res, next) => {
  //TODO - replace this with customerid in jwt token
  //IE - make sure customer can only access their own tickets
  const { customerId } = req.body;
  let { ticketId } = req.params;
  try {
    ticketId = parseInt(ticketId, 10);
  } catch (err) {
    res.status(400).json({ message: 'ticket id invalid' });
  }
  try {
    await cancelTicket(customerId, ticketId);
    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
