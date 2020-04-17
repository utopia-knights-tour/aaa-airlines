const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../index');
const knex = require('../knex');


const { expect } = chai;
chai.use(chaiHttp);

describe('tickets', () => {
  let testCustomer = { customerName: 'John', customerAddress: '123 Test Lane', customerPhone: '123-456-7890' };
  after(async () => {
    await knex('Ticket').del();
    await knex('Customer').del();
    return knex.destroy();
  });
  it('should return a new ticket when given correct input', async () => {
    const customerResponse = await chai.request(app).post('/customer').send(testCustomer);
    testCustomer = customerResponse.body;
    const testTicket = { flightId: 1, customerId: testCustomer.customerId };
    const response = await chai.request(app).post('/tickets').send(testTicket);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('ticketId');
  });
  it('should give a 400 error if required field is missing', async () => {
    const customerResponse = await chai.request(app).post('/customer').send(testCustomer);
    testCustomer = customerResponse.body;
    let testTicket = { flightId: 1 };
    const response = await chai.request(app).post('/tickets').send(testTicket);
    expect(response.status).to.equal(400);
    testTicket = { customerId: testCustomer.customerId };
    expect(response.status).to.equal(400);
  });
  it('should give a 400 error if field is invalid or flight does not exist', async () => {
    const customerResponse = await chai.request(app).post('/customer').send(testCustomer);
    testCustomer = customerResponse.body;
    let testTicket = { flightId: 'one', customerId: testCustomer.customerId };
    let response = await chai.request(app).post('/tickets').send(testTicket);
    expect(response.status).to.equal(400);
    testTicket = { flightId: 999999, customerId: testCustomer.customerId };
    response = await chai.request(app).post('/tickets').send(testTicket);
    expect(response.status).to.equal(400);
  });
  it('should return a 400 error if customer does not exist or invalid', async () => {
    const testTicket = { flightId: 1, customerId: 99999999 };
    let response = await chai.request(app).post('/tickets').send(testTicket);
    expect(response.status).to.equal(400);
    testTicket.customerId = 'one';
    response = await chai.request(app).post('/tickets').send(testTicket);
    expect(response.status).to.equal(400);
  });
  it('should return a list of tickets when given a correct customerId', async () => {
    const customerResponse = await chai.request(app).post('/customer').send(testCustomer);
    testCustomer = customerResponse.body;
    const testTicket = { flightId: 1, customerId: testCustomer.customerId };
    await chai.request(app).post('/tickets').send(testTicket);
    const response = await chai.request(app).get(`/tickets/${testCustomer.customerId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.a('array');
    expect(response.body).to.have.length(1);
  });
  it('should update ticket to canceled if ticket is deleted', async () => {
    const customerResponse = await chai.request(app).post('/customer').send(testCustomer);
    testCustomer = customerResponse.body;
    const testTicket = { flightId: 1, customerId: testCustomer.customerId };
    const ticketResponse = await chai.request(app).post('/tickets').send(testTicket);
    const ticketFromDb = ticketResponse.body;
    let response = await chai.request(app).get(`/tickets/${testCustomer.customerId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.a('array');
    expect(response.body).to.have.length(1);
    response = await chai.request(app).delete(`/tickets/${ticketFromDb.ticketId}`);
    expect(response.status).to.equal(401);
    response = await chai.request(app).delete(`/tickets/${ticketFromDb.ticketId}`).send({ customerId: testCustomer.customerId });
    expect(response.status).to.equal(204);
    response = await chai.request(app).get(`/tickets/${testCustomer.customerId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.a('array');
    expect(response.body).to.have.length(1);
  });
});
