const express = require('express');
const {
  getTicketsByCustomerId, getTicketsById,
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

module.exports = router;
