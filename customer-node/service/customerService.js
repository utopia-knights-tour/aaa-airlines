const { findCustomer, createCustomer, updateCustomerData } = require('../data_access/customerda');

const getCustomer = (customerId) => findCustomer(customerId);

const addCustomer = (customer) => createCustomer(customer);

const updateCustomer = async (customer) => {
  const dbCustomer = await findCustomer(customer.customerId);

  if (!dbCustomer) {
    const err = new Error('Customer not found');
    err.status = 404;
    throw err;
  }
  return updateCustomerData(customer);
};

module.exports = { getCustomer, addCustomer, updateCustomer };
