const express = require('express');
const {
  addCustomer, updateCustomer, getCustomer, getCustomerByUserId,
} = require('../service/customerService');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { customerName, customerAddress, customerPhone } = req.body;

  const customer = {
    customerName,
    customerAddress,
    customerPhone,
  };

  const nonStringField = Object.keys(customer).find((field) => typeof customer[field] !== 'string');

  if (nonStringField) {
    return res.status(400).json(`${nonStringField} must be a string`);
  }

  const tooLargeField = Object.keys(customer).find((field) => {
    if (typeof customer[field] === 'string') {
      return customer[field].length >= 45;
    }
    return false;
  });
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

router.get('/', async (req, res, next) => {
  const { userId } = req.query;

  try {
    const customer = await getCustomerByUserId(userId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer Not Found' });
    }
    return res.status(200).json(customer);
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
  let { customerId } = req.body;

  if (!customerId) {
    customerId = parseInt(pathId, 10);
  }

  const {
    customerName, customerAddress, customerPhone,
  } = req.body;

  const customer = {
    customerName,
    customerAddress,
    customerPhone,
  };

  const tooLargeField = Object.keys(customer).find((field) => {
    if (typeof customer[field] === 'string') {
      return customer[field].length >= 45;
    }
    return false;
  });
  if (tooLargeField) {
    return res.status(400).json({ message: `${tooLargeField} exceeds limit of 45 characters` });
  }
  try {
    if (parseInt(pathId, 10) !== customerId) {
      return res.status(400).json({ message: 'customer id in path does not match id in body' });
    }
  } catch (err) {
    return res.status(400).json({ message: 'customer id invalid - must be an integer' });
  }
  customer.customerId = customerId;
  try {
    const result = await updateCustomer(customer);
    return res.status(204).json(result);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
