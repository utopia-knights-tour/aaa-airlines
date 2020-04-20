const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../index');
const knex = require('../knex');

const { expect } = chai;
chai.use(chaiHttp);

describe('customers', () => {
  after(() => knex('Customer').del());
  const testCustomer = { customerName: 'John', customerAddress: '123 Test Lane', customerPhone: '123-456-7890' };
  it('should respond with 201 and a customer with id when adding a customer', async () => {
    const response = await chai.request(app).post('/customer').send(testCustomer);
    expect(response).to.have.status(201);
    expect(response.body).to.have.property('customerId');
  });

  it('should respond with 204 and properly update when updating a customer and w/ 200 when get by id', async () => {
    const { body: customerFromDB } = await chai.request(app).post('/customer').send(testCustomer);
    customerFromDB.customerName = 'Phillip';
    const putResponse = await chai.request(app).put(`/customer/${customerFromDB.customerId}`).send(customerFromDB);
    expect(putResponse).to.have.status(204);
    const response = await chai.request(app).get(`/customer/${customerFromDB.customerId}`);
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('customerName', 'Phillip');
  });

  it('should respond with 404 if customer does not exist', async () => {
    let response = await chai.request(app).get('/customer/99999999');
    expect(response).to.have.status(404);
    response = await chai.request(app).put('/customer/99999999');
    expect(response).to.have.status(404);
  });

  it('should respond with 400 if customer field is too large', async () => {
    testCustomer.customerAddress = 'asdfasdf asfasfasdf asfasf asfasda sdfasdf asdfasfa sfasf asfasfa sf';
    const response = await chai.request(app).post('/customer').send(testCustomer);
    expect(response).to.have.status(400);
  });
});
