const jwt = require('jsonwebtoken');
const express = require('express');
const {
  getTicketsByCustomerId, getTicketsById,
} = require('../service/ticketsService');
const { getCustomerByUserId } = require('../service/customerService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { userId } = jwt.decode(req.get('Authorization'));
  let customer;
  try {
    customer = await getCustomerByUserId(userId);
  } catch (err) {
    next(err);
  }

  const { customerId } = req.query;
  if (customerId !== customer.customerId) {
    res.status(401).json({ message: 'Unauthorized' });
  }
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
