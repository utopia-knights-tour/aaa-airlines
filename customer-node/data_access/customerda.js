const knex = require('../knex');

const findCustomer = (customerId) => knex('Customer').where('customerId', customerId).first();

const findCustomerByUserId = (userId) => knex('Customer').where('userId', userId).first();

const createCustomer = async (customer) => {
  const newCustomer = customer;
  const id = await knex.insert(customer).into('Customer');
  [newCustomer.customerId] = id;
  return newCustomer;
};

const updateCustomerData = (customer) => knex('Customer').update(customer).where('customerId', customer.customerId);

module.exports = {
  findCustomer, createCustomer, updateCustomerData, findCustomerByUserId,
};
