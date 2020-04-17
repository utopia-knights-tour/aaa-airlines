const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../index');

const { expect } = chai;
chai.use(chaiHttp);

describe('flight search', () => {
  it('should return bad request or empty array with 3 char airport not in database', async () => {
    const response = await chai.request(app).get('/flights?source=LHR&destination=LAS&date=2020-01-01');
    expect(response).to.have.status(200);
    expect(response.body).to.be.a('array');
    expect(response.body).to.have.length(0);
  });
  it('should return correct array if query for past flight ', async () => {
    const response = await chai.request(app).get('/flights?source=LAX&destination=LAS&date=2020-01-01');
    expect(response).to.have.status(200);
    expect(response.body).to.be.a('array');
    expect(response.body).to.have.length(1);
  });
  it('should return 400 if date in wrong format, airport more than 3 chars, or missing date ', async () => {
    let response = await chai.request(app).get('/flights?source=ORD&destination=LAS&date=01-01-2020');
    expect(response).to.have.status(400);
    response = await chai.request(app).get('/flights?source=ORDO&destination=LAS&date=2020-01-01');
    expect(response).to.have.status(400);
    response = await chai.request(app).get('/flights?source=DEN&destination=ORD&departureDate=2020-09-09');
    expect(response).to.have.status(400);
  });

  it('should return a bad request with no input', async () => {
    const response = await chai.request(app).get('/flights');
    expect(response).to.have.status(400);
  });

  it('should return an array of flights with correct input', async () => {
    const response = await chai.request(app).get('/flights?source=DEN&destination=ORD&date=2020-09-09');
    expect(response).to.have.status(200);
    expect(response.body).to.be.a('array');
    expect(response.body).to.have.length(1);
  });
});
