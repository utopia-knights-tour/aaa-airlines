const { findCustomer, createCustomer, updateCustomerData } = require('../data_access/customerda');

const getCustomer = (customerId) => findCustomer(customerId);

const addCustomer = (customer) => createCustomer(customer);

const updateCustomer = (customer) => updateCustomerData(customer);

module.exports = { getCustomer, addCustomer, updateCustomer };
