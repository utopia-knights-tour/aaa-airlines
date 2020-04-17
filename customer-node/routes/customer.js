const express = require('express');
const { addCustomer, updateCustomer, getCustomer } = require('../service/customerService');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { customerName, customerAddress, customerPhone } = req.body;

  const customer = {
    customerName,
    customerAddress,
    customerPhone,
  };

  const tooLargeField = Object.keys(customer).find((field) => customer[field].length >= 45);
  if (tooLargeField) {
    return res.status(400).json({ message: `${tooLargeField} exceeds limit of 45 characters` });
  }

  try {
    const newCustomer = await addCustomer(customer);
    return res.status(201).json(newCustomer);
  } catch (err) {
    return next(err);
  }
});

router.get('/:customerId', async (req, res, next) => {
  const { customerId } = req.params;
  try {
    const customer = await getCustomer(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer Not Found' });
    }
    return res.status(200).json(customer);
  } catch (err) {
    return next(err);
  }
});

router.put('/:customerId', async (req, res, next) => {
  const { customerId: pathId } = req.params;

  const {
    customerId, customerName, customerAddress, customerPhone,
  } = req.body;

  const customer = {
    customerId,
    customerName,
    customerAddress,
    customerPhone,
  };

  const tooLargeField = Object.keys(customer).find((field) => customer[field].length >= 45);
  if (tooLargeField) {
    return res.status(400).json({ message: `${tooLargeField} exceeds limit of 45 characters` });
  }
  try {
    if (parseInt(pathId, 10) !== customerId) {
      return res.status(400).json({ message: 'customer id invalid' });
    }
  } catch (err) {
    return res.status(400).json({ message: 'customer id invalid' });
  }
  try {
    const result = await updateCustomer(customer);
    return res.status(204).json(result);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
